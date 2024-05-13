export interface DatabaseConfig {
	uri: string;
}

export interface S3Config {
	accessKeyId: string;
	secretAccessKey: string;
	bucketName: string;
	url: string;
	region: string;
}

export const appConfigService = () => ({
	port: Number(process.env.PORT),
	database: {
		uri: process.env.DATABASE_URI,
	},
	secret: process.env.SECRET,
	s3Config: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		bucketName: process.env.S3_BUCKET_NAME,
		url: process.env.S3_URL,
		region: process.env.S3_REGION,
	},
});
