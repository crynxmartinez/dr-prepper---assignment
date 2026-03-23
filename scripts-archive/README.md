# Archived Scripts

These scripts are **legacy code** from before Prisma migration. They use old local database connections (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`).

**Do not use these scripts.** They are kept for historical reference only.

## Current Database Setup

The project now uses **Prisma ORM** with a single `DATABASE_URL` environment variable.

- **Active seed script:** `prisma/seed.js`
- **Database schema:** `prisma/schema.prisma`
- **Migrations:** `prisma/migrations/`

## Legacy Scripts in This Folder

All scripts here used the old `pg.Pool` connection with separate environment variables:
- `seed.js` - Old seeding script (replaced by `prisma/seed.js`)
- `seed-products.js` - Old product seeding
- `seed-categories.js` - Old category seeding
- `migrate.js` - Old migration runner (replaced by Prisma migrations)
- `populate-image-urls.js` - One-time data fix
- `fix-images-*.js` - One-time image fixes
- `cleanup-logs.js` - Old log cleanup utility

**These are archived and should not be run.**
