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
import { ProfileDto } from './dtos/profile.dto';

@Injectable()
export class ProfileService {
	constructor(
		@Inject(PG_CONNECTION) private db: NodePgDatabase<typeof schema>,
		private usersService: UsersService,
	) {}

	async createProfile({ name, bio, userId }: ProfileDto) {
		console.log(name);
		console.log(bio);
		// Check user exists
		const user = await this.usersService.findOne(userId);
		if (!user) throw new ForbiddenException('Access Denied');

		try {
			await this.db.insert(schema.profiles).values({ name, bio, userId });
			return { status: 'Added' };
		} catch (err) {
			throw new BadRequestException(`Your data is invalid!`);
		}
	}
}
