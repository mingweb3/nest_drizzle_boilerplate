import {
	Body,
	Controller,
	Param,
	Post,
	Put,
	Get,
	UseGuards,
} from '@nestjs/common';
import { ProfileDto, UpdateProfileDto } from './dtos/profile.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { ProfileService } from './profile.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserProperties } from '@modules/auth/auth.constants';
import { SelfGuard } from 'src/guards/self.guard';

@UseGuards(AccessTokenGuard)
@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@UseGuards(SelfGuard)
	@Post()
	createProfile(
		@User(UserProperties.USER_ID) userId: number,
		@Body() body: ProfileDto,
	) {
		return this.profileService.createProfile(userId, body);
	}

	@UseGuards(SelfGuard)
	@Put()
	updateProfile(
		@User(UserProperties.USER_ID) userId: number,
		@Body() body: UpdateProfileDto,
	) {
		return this.profileService.updateProfile(userId, body);
	}

	@Get('/user/:userId')
	async findProfileByUserId(@Param('userId') userId: string) {
		return await this.profileService.findOneByUserId(Number(userId));
	}
}
