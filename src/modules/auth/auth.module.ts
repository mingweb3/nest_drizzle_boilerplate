import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DbModule } from '@db/db.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/guards/accessToken.strategy';
import { RefreshTokenStrategy } from 'src/guards/refreshToken.strategy';
import { UsersService } from '@modules/users/users.service';

@Module({
	imports: [DbModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [
		AuthService,
		UsersService,
		AccessTokenStrategy,
		RefreshTokenStrategy,
	],
})
export class AuthModule {}
