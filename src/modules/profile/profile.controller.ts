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

@UseGuards(AccessTokenGuard)
@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Post()
	createProfile(@Body() body: ProfileDto) {
		return this.profileService.createProfile(body);
	}

	@Put(':id')
	updateProfile(@Param('id') id: string, @Body() body: UpdateProfileDto) {
		return this.profileService.updateProfile(Number(id), body);
	}

	@Get('/user/:userId')
	async findProfileByUserId(@Param('userId') userId: string) {
		return await this.profileService.findOneByUserId(Number(userId));
	}
}
