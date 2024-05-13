import {
	Controller,
	Delete,
	FileTypeValidator,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/decorators/user.decorator';
import { UserProperties } from '@modules/auth/auth.constants';

@UseGuards(AccessTokenGuard)
@Controller('media')
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async upload(
		@User(UserProperties.USER_ID) userId: number,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({ fileType: 'image/jpeg|image/png' }),
					new MaxFileSizeValidator({ maxSize: 528000 }),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		return this.mediaService.upload(userId, file);
	}

	@Delete(':id')
	async deleteMedia(
		@User(UserProperties.USER_ID) userId: number,
		@Param('id') id: number,
	) {
		return this.mediaService.deleteMedia(userId, id);
	}
}
