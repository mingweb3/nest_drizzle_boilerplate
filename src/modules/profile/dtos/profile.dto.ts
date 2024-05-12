import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	bio: string;

	@IsNotEmpty()
	userId: number;
}

export class UpdateProfileDto extends PartialType(ProfileDto) {}
