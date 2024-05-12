import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import PG_CONNECTION from '@utils/app.config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@db/schema';
import { UpdateUserDto } from './dtos/update-user.dto';
import { eq } from 'drizzle-orm';
import { UserEntity } from './entites/user.entity';

@Injectable()
export class UsersService {
	userTable = schema.users;
	constructor(
		@Inject(PG_CONNECTION) private db: NodePgDatabase<typeof schema>,
	) {}

	async findAll(): Promise<UserEntity[]> {
		const pageSize = 2;
		const page = 1;

		const users = this.db.query.users.findMany({
			orderBy: (users, { desc }) => desc(users.id),
			limit: pageSize,
			offset: pageSize * (page - 1),
		});

		return users;
	}

	async findOne(id: number): Promise<UserEntity> {
		const user = await this.db.query.users.findFirst({
			with: {
				profile: true,
			},
			columns: {
				password: false,
			},
			where: (users, { eq }) => eq(users.id, id),
		});
		return user;
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		const userExists = this.findOne(id);
		if (!userExists) {
			throw new BadRequestException(`no user exists`);
		}

		this.db
			.update(this.userTable)
			.set(updateUserDto)
			.where(eq(this.userTable.id, id));

		return { status: 'updated' };
	}
}
