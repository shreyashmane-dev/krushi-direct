/**
 * Dynamic Database Preparation Script for KisanDirect
 * - Detects SQLite vs PostgreSQL based on DATABASE_URL
 * - Automatically adjusts schema.prisma provider
 * - Ensures pre-seeded SQLite database exists for serverless deployments
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
const devDbPath = path.join(rootDir, 'prisma', 'dev.db');
const envPath = path.join(rootDir, '.env');

// Simple .env parser in case dotenv is not loaded
function loadEnvFile() {
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnvFile();

function run() {
  let dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
  const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');

  let schemaContent = fs.readFileSync(schemaPath, 'utf8');

  if (isPostgres) {
    console.log('🚀 [KisanDirect DB] PostgreSQL environment detected.');
    if (schemaContent.includes('provider = "sqlite"')) {
      console.log('⚙️ [KisanDirect DB] Switching schema provider to "postgresql"...');
      schemaContent = schemaContent.replace('provider = "sqlite"', 'provider = "postgresql"');
      fs.writeFileSync(schemaPath, schemaContent, 'utf8');
    }
  } else {
    console.log('🌿 [KisanDirect DB] SQLite environment detected.');
    if (schemaContent.includes('provider = "postgresql"')) {
      console.log('⚙️ [KisanDirect DB] Switching schema provider to "sqlite"...');
      schemaContent = schemaContent.replace('provider = "postgresql"', 'provider = "sqlite"');
      fs.writeFileSync(schemaPath, schemaContent, 'utf8');
    }
  }

  const childEnv = {
    ...process.env,
    DATABASE_URL: dbUrl,
  };

  // Generate Prisma client
  console.log('📦 [KisanDirect DB] Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit', env: childEnv });

  // If SQLite and dev.db doesn't exist, build & seed it automatically
  if (!isPostgres && !fs.existsSync(devDbPath)) {
    console.log('🌱 [KisanDirect DB] dev.db not found. Initializing and seeding demo database...');
    try {
      execSync('npx prisma db push --skip-generate', { stdio: 'inherit', env: childEnv });
      execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', env: childEnv });
      console.log('✅ [KisanDirect DB] Seeded SQLite database created successfully at prisma/dev.db');
    } catch (err) {
      console.error('⚠️ [KisanDirect DB] Note: Database push or seed notice:', err.message);
    }
  }
}

run();
