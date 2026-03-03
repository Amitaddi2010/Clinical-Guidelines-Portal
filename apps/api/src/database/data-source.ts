import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { Guideline } from './entities/guideline.entity';
import { GuidelineMember } from './entities/guideline-member.entity';
import { Section } from './entities/section.entity';
import { Recommendation } from './entities/recommendation.entity';
import { Pico } from './entities/pico.entity';
import { EvidenceSummary } from './entities/evidence-summary.entity';
import { Reference } from './entities/reference.entity';
import { SectionReference } from './entities/section-reference.entity';
import { AuditLog } from './entities/audit-log.entity';
import { Comment } from './entities/comment.entity';
import { DelphiRound } from './entities/delphi-round.entity';
import { DelphiVote } from './entities/delphi-vote.entity';
import { CoiDeclaration } from './entities/coi-declaration.entity';
import { PublishedSnapshot } from './entities/published-snapshot.entity';
import { Notification } from './entities/notification.entity';

config();

const useSqlite = process.env.USE_SQLITE === 'true';

const ENTITIES = [
    User, Guideline, GuidelineMember, Section, Recommendation, Pico, EvidenceSummary,
    Reference, SectionReference, AuditLog, Comment, DelphiRound, DelphiVote,
    CoiDeclaration, PublishedSnapshot, Notification
];

export const dataSourceOptions: DataSourceOptions = useSqlite
    ? {
        type: 'sqlite',
        database: 'db.sqlite',
        entities: ENTITIES,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: true, // Auto-create tables for local dev fallback
    }
    : process.env.DATABASE_URL
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: ENTITIES,
            migrations: [__dirname + '/migrations/*{.ts,.js}'],
            synchronize: true, // FORCE TRUE FOR NOW TO DEBUG RENDER
            ssl: { rejectUnauthorized: false },
        }
        : {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'cgp',
            entities: ENTITIES,
            migrations: [__dirname + '/migrations/*{.ts,.js}'],
            synchronize: true, // FORCE TRUE FOR NOW TO DEBUG RENDER
            ssl: process.env.DB_SSL === 'true' || (process.env.DB_HOST || '').includes('.neon.tech')
                ? { rejectUnauthorized: false }
                : false,
        };

const dataSource = new DataSource(dataSourceOptions);

console.log('--- TypeORM Initialization ---');
console.log('Database URL Provider:', process.env.DATABASE_URL ? 'DATABASE_URL' : 'Host/Port');
console.log('Synchronize Setting:', dataSourceOptions.synchronize);
console.log('Entities Loaded:', ENTITIES.length);

export default dataSource;
