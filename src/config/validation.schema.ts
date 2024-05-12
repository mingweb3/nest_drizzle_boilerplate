import * as Joi from 'joi';

export const envVarsSchema: Joi.ObjectSchema = Joi.object({
	NODE_ENV: Joi.string()
		.valid('development', 'production', 'test', 'provision', 'staging')
		.default('development'),
	PORT: Joi.number().default(3333),
	DATABASE_URI: Joi.string().required(),
	ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
	REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
});
