# Deployment Guide for Vercel

## Quick Fix: Database Connection Issue

If you're seeing "Database connection failed" errors, follow these steps:

### Step 1: Set Up Database in Vercel

**Option A: Vercel Postgres (Recommended)**
1. Go to your Vercel project dashboard
2. Click on the **Storage** tab
3. Click **Create Database** → Select **Postgres**
4. Choose a name and region
5. Copy the connection string (it will be automatically added as `DATABASE_URL`)

**Option B: Supabase (Free Tier)**
1. Go to https://supabase.com and create an account
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. In Vercel, go to **Settings** → **Environment Variables**
6. Add `DATABASE_URL` with the Supabase connection string

### Step 2: Set Environment Variables in Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add these variables:

```
ADMIN_PASSWORD=msahay410
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Important:** Make sure to add `DATABASE_URL` for all environments (Production, Preview, Development)

### Step 3: Run Database Migrations

After setting `DATABASE_URL`, you need to run migrations:

**Option A: Via Vercel CLI**
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link to your project
vercel link

# Run migrations
npx prisma migrate deploy
```

**Option B: Via Vercel Dashboard**
1. Go to your project → **Deployments**
2. Click on the latest deployment
3. Go to **Functions** tab
4. Or trigger a new deployment after setting environment variables

### Step 4: Verify Deployment

1. Check health endpoint: `https://your-site.vercel.app/api/health`
   - Should return: `{"status":"ok","database":"connected"}`
2. Test registration: Try registering a partner
3. Test admin login: Use password `msahay410`

## Troubleshooting

### Database Still Not Connected?

1. **Check Environment Variables:**
   - Go to Vercel → Settings → Environment Variables
   - Verify `DATABASE_URL` is set for Production environment
   - Make sure there are no extra spaces or quotes

2. **Verify Connection String Format:**
   - Should be: `postgresql://user:password@host:port/database`
   - For Vercel Postgres: Usually starts with `postgres://`
   - For Supabase: Usually starts with `postgresql://postgres:...`

3. **Redeploy After Setting Variables:**
   - After adding environment variables, trigger a new deployment
   - Go to Deployments → Click "Redeploy"

4. **Check Build Logs:**
   - Go to your deployment → View build logs
   - Look for Prisma errors or connection issues

### Common Issues

**Issue:** "DATABASE_URL environment variable is not set"
- **Fix:** Add `DATABASE_URL` in Vercel environment variables

**Issue:** "Database connection failed"
- **Fix:** Check connection string format, ensure database is accessible
- **Fix:** For Supabase, make sure connection pooling is disabled or use direct connection

**Issue:** "Table does not exist"
- **Fix:** Run migrations: `npx prisma migrate deploy`

## Environment Variables Summary

Required for production:
- `ADMIN_PASSWORD` = `msahay410`
- `DATABASE_URL` = Your Postgres connection string

Optional:
- `NODE_ENV` = `production` (automatically set by Vercel)

