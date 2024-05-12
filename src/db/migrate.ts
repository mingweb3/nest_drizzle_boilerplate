import * as postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate as NodePgMigrate } from 'drizzle-orm/postgres-js/migrator';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '@config/config.service';

async function migrate(configService: ConfigService) {
	const dbConfig = configService.get<DatabaseConfig>('database');
	const client = postgres(dbConfig.uri, { max: 1 });

	const db = drizzle(client);
	await NodePgMigrate(db, {
		migrationsFolder: 'migrations',
	});

	await client.end();
}

migrate(new ConfigService());
