import {
	Controller,
	Post,
	Body,
	Get,
	Req,
	UseGuards,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto, SigninDto, SignupDto } from './dtos/auth.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/signup')
	signup(@Body() body: SignupDto) {
		return this.authService.signup(body);
	}

	@Post('/signin')
	signin(@Body() body: SigninDto) {
		return this.authService.signin(body);
	}

	@UseGuards(AccessTokenGuard)
	@Get('logout')
	logout(@Req() req: Request) {
		if (!req.headers['authorization']) throw new UnauthorizedException();
		const authToken = req.headers['authorization'].split(' ')[1];
		return this.authService.logout(authToken);
	}

	@Post('/refresh-token')
	refreshToken(@Body() body: RefreshTokenDto) {
		return this.authService.refreshToken(body);
	}
}
