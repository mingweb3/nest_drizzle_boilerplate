import { UsersService } from '@modules/users/users.service';
import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
	forwardRef,
} from '@nestjs/common';

@Injectable()
export class SelfGuard implements CanActivate {
	constructor(
		@Inject(forwardRef(() => UsersService)) private usersService: UsersService,
	) {}

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user;
		if (!user) {
			throw new UnauthorizedException();
		}

		// Check user exists - Move this logic to Interceptor
		const userExists = await this.usersService.findOne(user.id);
		if (!userExists) return false;
		return true;
	}
}
