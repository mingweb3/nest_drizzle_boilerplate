import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { DbModule } from '@db/db.module';
import { ProfileService } from './profile.service';
import { UsersService } from '@modules/users/users.service';

@Module({
	imports: [DbModule],
	controllers: [ProfileController],
	providers: [ProfileService, UsersService],
})
export class ProfileModule {}
