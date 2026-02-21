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
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'cgp',
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false,
    };

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
