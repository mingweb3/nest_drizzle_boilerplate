import * as dotenv from 'dotenv';
dotenv.config();

const PG_CONNECTION = process.env.DATABASE_URI;
export default PG_CONNECTION;

export const secret = process.env.SECRET;

export const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRATION || '60m';
export const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRATION || '7d';
