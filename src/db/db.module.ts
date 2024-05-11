import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import PG_CONNECTION from '@utils/urls';
import { DatabaseConfig } from '@config/config.service';
import * as schema from './schema';

@Module({
  providers: [
    {
      provide: PG_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const db = configService.get<DatabaseConfig>('database');
        const pool = new Pool({
          connectionString: db.uri,
          ssl: false,
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DbModule {}
