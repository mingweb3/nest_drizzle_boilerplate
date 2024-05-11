export interface DatabaseConfig {
  uri: string;
}

export const appConfigService = () => ({
  port: Number(process.env.PORT),
  database: {
    uri: process.env.DATABASE_URI,
  },
  secret: process.env.SECRET,
});
