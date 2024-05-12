import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProfileDto } from './dtos/profile.dto';
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
}
