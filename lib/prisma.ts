import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;

  // 1. If using a remote database (PostgreSQL, Supabase, Neon), return as-is
  if (envUrl && (envUrl.startsWith('postgres://') || envUrl.startsWith('postgresql://'))) {
    return envUrl;
  }

  // 2. On Vercel / AWS Lambda Serverless environments:
  // The Lambda root filesystem (/var/task) is read-only.
  // We copy the pre-seeded SQLite database into /tmp (the only writable directory).
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) {
    const tmpDbPath = path.join('/tmp', 'dev.db');

    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.resolve('./prisma/dev.db'),
        path.resolve('./dev.db'),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            console.log(`[Prisma] Successfully initialized /tmp/dev.db from ${candidate}`);
            break;
          } catch (err) {
            console.error(`[Prisma] Error copying database from ${candidate}:`, err);
          }
        }
      }
    }

    const tmpUrl = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = tmpUrl;
    return tmpUrl;
  }

  return envUrl;
}

function createPrismaClient(): PrismaClient {
  const dbUrl = getDatabaseUrl();

  const clientOptions: any = {
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  };

  if (dbUrl) {
    clientOptions.datasources = {
      db: {
        url: dbUrl,
      },
    };
  }

  return new PrismaClient(clientOptions);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
