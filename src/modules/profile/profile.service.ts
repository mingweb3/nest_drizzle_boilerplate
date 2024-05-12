import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
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

	async createProfile({ name, bio, userId }: ProfileDto) {
		// Check user exists
		const user = await this.usersService.findOne(userId);
		if (!user) throw new ForbiddenException('Access Denied');

		// Exec
		try {
			await this.db.insert(schema.profiles).values({ name, bio, userId });
			return { status: 'Added' };
		} catch (err) {
			throw new BadRequestException(`Your data is invalid!`);
		}
	}

	async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
		const profile = await this.findOne(id);
		if (!profile) {
			throw new BadRequestException(`no data exists`);
		}

		try {
			await this.db
				.update(schema.profiles)
				.set(updateProfileDto)
				.where(eq(schema.profiles.id, id));
			return { status: 'updated' };
		} catch (e) {
			throw new BadRequestException(`Your data is invalid!`);
		}
	}
}
