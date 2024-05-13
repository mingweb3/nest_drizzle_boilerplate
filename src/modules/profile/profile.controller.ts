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

@UseGuards(AccessTokenGuard)
@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Post()
	createProfile(
		@User(UserProperties.USER_ID) userId: number,
		@Body() body: ProfileDto,
	) {
		return this.profileService.createProfile(userId, body);
	}

	@Put(':id')
	updateProfile(
		@User(UserProperties.USER_ID) userId: number,
		@Param('id') id: string,
		@Body() body: UpdateProfileDto,
	) {
		return this.profileService.updateProfile(userId, Number(id), body);
	}

	@Get('/user/:userId')
	async findProfileByUserId(@Param('userId') userId: string) {
		return await this.profileService.findOneByUserId(Number(userId));
	}
}
