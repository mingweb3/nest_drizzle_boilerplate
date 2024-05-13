import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import PG_CONNECTION from '@utils/app.config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UsersService } from '@modules/users/users.service';
import * as schema from '@db/schema';
import { ProfileDto, UpdateProfileDto } from './dtos/profile.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProfileService {
	constructor(
		@Inject(PG_CONNECTION) private db: NodePgDatabase<typeof schema>,
		private usersService: UsersService,
	) {}

	async findOneByUserId(id: number) {
		const profile = await this.db.query.profiles.findFirst({
			where: (profiles, { eq }) => eq(profiles.userId, id),
		});
		return profile;
	}

	async findOne(id: number) {
		const profile = await this.db.query.profiles.findFirst({
			where: (profiles, { eq }) => eq(profiles.id, id),
		});
		return profile;
	}

	async createProfile(userId: number, { name, bio }: ProfileDto) {
		// Check user exists - Move this logic to Interceptor
		const user = await this.usersService.findOne(userId);
		if (!user || user.id !== userId)
			throw new ForbiddenException('Access Denied');

		const profile = await this.db.query.profiles.findFirst({
			where: (profiles, { eq }) => eq(profiles.userId, userId),
		});

		if (profile) throw new BadRequestException('Already had');

		// Exec
		try {
			const profiles = await this.db
				.insert(schema.profiles)
				.values({ name, bio, userId })
				.returning();
			return profiles[0];
		} catch (err) {
			throw new BadRequestException(`Your data is invalid!`);
		}
	}

	async updateProfile(
		userId: number,
		id: number,
		updateProfileDto: UpdateProfileDto,
	) {
		// Check user exists - Move this logic to Interceptor
		const user = await this.usersService.findOne(userId);
		if (!user || user.id !== userId)
			throw new ForbiddenException('Access Denied');

		// if not existing then create new
		const profile = await this.findOne(id);
		if (!profile) throw new BadRequestException(`Your data is invalid!`);

		try {
			const profiles = await this.db
				.update(schema.profiles)
				.set(updateProfileDto)
				.where(eq(schema.profiles.id, id))
				.returning();
			return profiles[0];
		} catch (e) {
			throw new InternalServerErrorException(
				`Error uploading file: ${e.message}`,
			);
		}
	}
}
