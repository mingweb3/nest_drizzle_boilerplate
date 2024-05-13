import * as AWS_S3 from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { lookupMimeType } from '@utils/file';
import { appConfigService, S3Config } from '@config/config.service';

@Injectable()
export class S3Service {
	private readonly s3: AWS_S3.S3;
	private readonly s3Config: S3Config;

	constructor() {
		this.s3Config = appConfigService().s3Config;
		this.s3 = new AWS_S3.S3({
			region: this.s3Config.region,
			credentials: {
				accessKeyId: this.s3Config.accessKeyId,
				secretAccessKey: this.s3Config.secretAccessKey,
			},
		});
	}

	async uploadFileToS3(
		bucketName: string,
		file: Buffer,
		fileName: string,
	): Promise<string> {
		const params = new AWS_S3.PutObjectCommand({
			Bucket: bucketName,
			Key: fileName,
			Body: file,
			ACL: 'public-read',
			ContentType: lookupMimeType(fileName),
		});

		try {
			await this.s3.send(params);
			const objectUrl = `${this.s3Config.url}/${fileName}`;
			return objectUrl;
		} catch (error) {
			throw new Error(`Error uploading file to S3: ${error.message}`);
		}
	}

	async renameObjectS3(bucketName: string, oldPath: string, newPath: string) {
		const copyParams = new AWS_S3.CopyObjectCommand({
			Bucket: bucketName,
			CopySource: `${bucketName}/${oldPath}`,
			Key: newPath,
		});

		try {
			await this.s3.send(copyParams);
			await this.deleteFileFromS3(bucketName, oldPath);
			const newObjectUrl = `${this.s3Config.url}/${newPath}`;
			return newObjectUrl;
		} catch (error) {
			throw new Error(`Error renaming file from S3: ${error.message}`);
		}
	}

	async getObjectContentFromS3(
		bucketName: string,
		path: string,
	): Promise<Buffer> {
		const params = new AWS_S3.GetObjectCommand({
			Bucket: bucketName,
			Key: path,
		});

		const response = await this.s3.send(params);
		const stream = response.Body as Readable;

		return new Promise<Buffer>((resolve, reject) => {
			const chunks: Buffer[] = [];
			stream.on('data', (chunk) => chunks.push(chunk));
			stream.once('end', () => resolve(Buffer.concat(chunks)));
			stream.once('error', reject);
		});
	}

	async deleteFileFromS3(bucketName: string, path: string): Promise<boolean> {
		const params = new AWS_S3.DeleteObjectCommand({
			Bucket: bucketName,
			Key: path,
		});

		try {
			await this.s3.send(params);
			return true;
		} catch (error) {
			throw new Error(`Error deleting file from S3: ${error.message}`);
		}
	}

	async getPresignUrl(path: string): Promise<string> {
		const putObjectParams = {
			Bucket: this.s3Config.bucketName,
			Key: path,
		};
		const command = new AWS_S3.PutObjectCommand(putObjectParams);
		const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
		return url;
	}
}
