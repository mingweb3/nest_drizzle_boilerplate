import {
	Inject,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import * as schema from '@db/schema';
import { S3Service } from '@modules/common/services/s3.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import PG_CONNECTION from '@utils/app.config';
import { S3Config, appConfigService } from '@config/config.service';
import { eq } from 'drizzle-orm';

@Injectable()
export class MediaService {
	private readonly s3Config: S3Config;

	constructor(
		private s3Service: S3Service,
		@Inject(PG_CONNECTION) private db: NodePgDatabase<typeof schema>,
	) {
		this.s3Config = appConfigService().s3Config;
	}

	async findOne(id: number) {
		const data = await this.db.query.medias.findFirst({
			where: (medias, { eq }) => eq(medias.id, id),
		});
		return data;
	}

	async upload(userId: number, file: Express.Multer.File) {
		const folder = 'temp';
		const filePath = `${folder}/${file.originalname}`;

		try {
			// UPLOAD FILE TO S3
			const uploadFileUrl = await this.s3Service.uploadFileToS3(
				this.s3Config.bucketName,
				file.buffer,
				filePath,
			);

			// INSERT MEDIA to DB
			const media = await this.db
				.insert(schema.medias)
				.values({
					ownerId: userId,
					url: uploadFileUrl,
					path: filePath,
					name: file.originalname,
				})
				.returning();

			return {
				id: media[0].id,
				url: uploadFileUrl,
				name: file.originalname,
			};
		} catch (error) {
			throw new InternalServerErrorException(
				`Error uploading file: ${error.message}`,
			);
		}
	}

	async deleteMedia(userId: number, id: number) {
		const mediaExists = await this.findOne(id);

		if (!mediaExists) {
			throw new InternalServerErrorException('Media not found');
		}

		if (mediaExists.ownerId !== userId) {
			throw new InternalServerErrorException(
				'You are not authorized to delete this media',
			);
		}

		try {
			// remove from s3
			await this.s3Service.deleteFileFromS3(
				this.s3Config.bucketName,
				mediaExists.path,
			);
			// remove from db
			await this.db
				.delete(schema.medias)
				.where(eq(schema.medias.id, id))
				.execute();
		} catch (error) {
			throw new InternalServerErrorException(
				`Error deleting media: ${error.message}`,
			);
		}

		return {
			status: 'deleted',
		};
	}
}
