import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';
import { UserProperties } from '@modules/auth/auth.constants';

export const User = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user;
		if (!user) {
			throw new UnauthorizedException();
		}

		switch (data) {
			case UserProperties.USER_ID:
				return +user[UserProperties.USER_ID];
			case UserProperties.EMAIL:
				return user[UserProperties.EMAIL];
			default:
				return user;
		}
	},
);
