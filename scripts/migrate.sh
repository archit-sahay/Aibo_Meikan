#!/bin/bash
# Migration script for Vercel
# Run this after deployment if DATABASE_URL is set

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL not set, skipping migrations"
  exit 0
fi

echo "Running database migrations..."
npx prisma migrate deploy
exit $?

