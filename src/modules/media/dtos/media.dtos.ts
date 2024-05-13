import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class MediaDto {
	@IsNotEmpty()
	file: Express.Multer.File;
}

export class MediaFindDto {
	@IsNumber()
	@IsOptional()
	limit?: number;

	@IsNumber()
	@IsOptional()
	page?: number;

	@IsString()
	@IsOptional()
	keyword?: string;
}
