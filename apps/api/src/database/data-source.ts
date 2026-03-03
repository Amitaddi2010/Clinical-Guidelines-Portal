import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

const useSqlite = process.env.USE_SQLITE === 'true';

export const dataSourceOptions: DataSourceOptions = useSqlite
    ? {
        type: 'sqlite',
        database: 'db.sqlite',
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: true, // Auto-create tables for local dev fallback
    }
    : process.env.DATABASE_URL
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [__dirname + '/entities/*.entity{.ts,.js}'],
            migrations: [__dirname + '/migrations/*{.ts,.js}'],
            synchronize: process.env.DB_SYNCHRONIZE === 'true',
            ssl: { rejectUnauthorized: false },
        }
        : {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'cgp',
            entities: [__dirname + '/entities/*.entity{.ts,.js}'],
            migrations: [__dirname + '/migrations/*{.ts,.js}'],
            synchronize: process.env.DB_SYNCHRONIZE === 'true',
            ssl: process.env.DB_SSL === 'true' || (process.env.DB_HOST || '').includes('.neon.tech')
                ? { rejectUnauthorized: false }
                : false,
        };

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
