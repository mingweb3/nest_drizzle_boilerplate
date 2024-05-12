import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config/dist';
import { appConfigService } from './config/config.service';
import { envVarsSchema } from './config/validation.schema';
import { DbModule } from './db/db.module';
import { CommonModule } from './modules/common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { ProfileModule } from '@modules/profile/profile.module';

@Module({
	imports: [
		DbModule,
		CommonModule,
		AuthModule,
		UsersModule,
		ProfileModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath:
				process.env.NODE_ENV === 'development'
					? '.env.development.local'
					: '.env',
			load: [appConfigService],
			validationSchema: envVarsSchema,
			validationOptions: {
				abortEarly: false,
			},
			cache: true,
			expandVariables: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
