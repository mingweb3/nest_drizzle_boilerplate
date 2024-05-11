import { Inject, Injectable } from '@nestjs/common';
import PG_CONNECTION from '@utils/urls';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@db/schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(PG_CONNECTION) private db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    const users = this.db.select().from(schema.users);
    return users;
  }

  async findOne(id: number) {
    const user = await this.db.query.users.findFirst({
      columns: {
        password: false,
      },
      where: (users, { eq }) => eq(users.id, id),
    });
    return user;
  }
}
