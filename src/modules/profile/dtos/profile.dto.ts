import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class ProfileDto {
	@IsString()
	name: string;

	@IsString()
	bio: string;
}

export class UpdateProfileDto extends PartialType(ProfileDto) {}
