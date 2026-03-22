# Database Migrations

## Current System
- **prisma/migrations/** — Active Prisma migrations (source of truth)
- **prisma/schema.prisma** — Current database schema

## Historical (Pre-Prisma)
- **migrations/pre-prisma/** — Old raw SQL migrations
  - Already applied to production database
  - Kept for historical reference only
  - Do NOT re-run these migrations

## SQL Archive
- **sql/archive/** — One-time data fix scripts and old schema file
  - Already executed
  - Kept for reference only
