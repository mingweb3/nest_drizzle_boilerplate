import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@db/schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import PG_CONNECTION, { secret } from '@utils/urls';

interface ISignUp {
  email: string;
  password: string;
  username: string;
}

interface ISignIn {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(PG_CONNECTION) private db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    const users = this.db.select().from(schema.users);
    return users;
  }

  async signup({ email, password, username }: ISignUp) {
    const userExists = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (userExists.length > 0) {
      throw new BadRequestException(`User exists`);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.db
        .insert(schema.users)
        .values({ email, password: hashedPassword, username });

      return { token: this.generateToken(email, user.oid.toString()) };
    }
  }

  async signin({ email, password }: ISignIn) {
    const userExists = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (userExists.length > 0) {
      const isValidPassword = await bcrypt.compare(
        password,
        userExists[0].password,
      );

      if (!isValidPassword)
        throw new HttpException('Invalid username or password', 400);
      else {
        return {
          user: userExists[0],
          token: this.generateToken(email, userExists[0]?.id.toString()),
        };
      }
    } else {
      throw new HttpException('User does not exist', 400);
    }
  }

  private generateToken(email: string, id: string) {
    const token = jwt.sign({ email, id }, secret, {
      expiresIn: 2 * 3600, // 2 days
    });
    return token;
  }
}
