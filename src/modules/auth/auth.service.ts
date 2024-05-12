import {
	BadRequestException,
	ForbiddenException,
	HttpException,
	Inject,
	Injectable,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@db/schema';
import * as argon2 from 'argon2';
import PG_CONNECTION, {
	accessTokenExpire,
	refreshTokenExpire,
	secret,
} from '@utils/app.config';
import { SigninDto, SignupDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@modules/users/users.service';

@Injectable()
export class AuthService {
	constructor(
		@Inject(PG_CONNECTION) private db: NodePgDatabase<typeof schema>,
		private jwtService: JwtService,
		private usersService: UsersService,
	) {}

	async findAll() {
		const users = this.db.select().from(schema.users);
		return users;
	}

	async signup({ email, password, username }: SignupDto) {
		const userExists = await this.db
			.select()
			.from(schema.users)
			.where(eq(schema.users.email, email));

		if (userExists.length > 0) {
			throw new BadRequestException(`Your data is invalid!`);
		}

		// Hash password
		const hashedPassword = await this.hashData(password);

		const user = await this.db
			.insert(schema.users)
			.values({ email, password: hashedPassword, username })
			.returning();

		const tokens = await this.getTokens(user[0].id, email);
		await this.updateRefreshToken(user[0].id, tokens.refreshToken);
		return tokens;
	}

	async signin({ email, password }: SigninDto) {
		const userExists = await this.db
			.select()
			.from(schema.users)
			.where(eq(schema.users.email, email));

		if (userExists.length > 0) {
			const isValidPassword = await argon2.verify(
				userExists[0].password,
				password,
			);

			if (!isValidPassword)
				throw new HttpException('Invalid username or password', 400);

			const tokens = await this.getTokens(
				userExists[0].id,
				userExists[0].email,
			);
			await this.updateRefreshToken(userExists[0].id, tokens.refreshToken);
			return tokens;
		} else {
			throw new HttpException('User does not exist', 400);
		}
	}

	async logout(token: string) {
		const tokenObj = this.jwtService.verify(token, { secret });
		if (!tokenObj.id) throw new HttpException('User does not exist', 400);

		await this.updateRefreshToken(Number(tokenObj.id), null);
		return { status: 'ok' };
	}

	async refreshToken(refreshToken: string) {
		const tokenObj = this.jwtService.verify(refreshToken, { secret });
		if (!tokenObj.id) throw new ForbiddenException('Access Denied');

		const userExists = await this.db
			.select()
			.from(schema.users)
			.where(eq(schema.users.id, tokenObj.id));
		if (!userExists.length || !userExists[0].refreshToken)
			throw new ForbiddenException('Access Denied');

		const refreshTokenMatches = await argon2.verify(
			userExists[0].refreshToken,
			refreshToken,
		);

		if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
		const tokens = await this.getTokens(tokenObj.id, tokenObj.email);
		await this.updateRefreshToken(tokenObj.id, tokens.refreshToken);
		return tokens;
	}

	/**
	 * PRIVATE FUNCTIONS
	 */
	private hashData(data: string) {
		return argon2.hash(data);
	}

	private async updateRefreshToken(userId: number, refreshToken?: string) {
		if (!refreshToken) {
			await this.usersService.update(userId, {
				refreshToken: null,
			});
			return;
		}

		const hashedRefreshToken = await this.hashData(refreshToken);
		await this.usersService.update(userId, {
			refreshToken: hashedRefreshToken,
		});
		return;
	}

	private async getTokens(id: number, email: string) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{
					id,
					email,
				},
				{
					secret,
					expiresIn: accessTokenExpire,
				},
			),
			this.jwtService.signAsync(
				{
					id,
					email,
				},
				{
					secret,
					expiresIn: refreshTokenExpire,
				},
			),
		]);

		return {
			accessToken,
			refreshToken,
		};
	}
}
