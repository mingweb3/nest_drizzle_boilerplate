/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import PG_CONNECTION, { secret } from '@utils/urls';
import * as schema from '@db/schema';
import { UsersService } from '@modules/users/users.service';

interface jwtPayload {
  email: string;
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    @Inject(PG_CONNECTION) db: NodePgDatabase<typeof schema>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization;
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const verified = jwt.verify(
        token.replace('Bearer ', ''),
        secret,
      ) as jwtPayload;

      if (!verified.id) {
        return false;
      }
    } catch (error) {
      return false;
    }

    return true;
  }
}
