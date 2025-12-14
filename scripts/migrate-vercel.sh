#!/bin/bash
# Migration script for Vercel deployment
# This creates the database tables

echo "Running Prisma migrations..."

# Check if DATABASE_URL or Prisma Postgres URL is set
if [ -z "$AIBO_DB_PRISMA_DATABASE_URL" ] && [ -z "$DATABASE_URL" ]; then
  echo "Error: Database URL not found. Please set AIBO_DB_PRISMA_DATABASE_URL or DATABASE_URL"
  exit 1
fi

# Run migrations
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully!"
else
  echo "❌ Migration failed"
  exit 1
fi

