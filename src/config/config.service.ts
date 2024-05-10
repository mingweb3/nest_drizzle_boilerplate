export interface AppConfig {
  port: number | string;
}

export const appConfigService = () => ({
  port: Number(process.env.PORT),
});
