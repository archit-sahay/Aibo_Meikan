# How to Run Database Migrations on Vercel

## Step 1: Login to Vercel CLI

```bash
vercel login
```

## Step 2: Link to Your Project

```bash
vercel link
```

When prompted:
- Select your project: `infibizz` (or your current project name)
- Select scope: Your account
- Link to existing project: Yes

## Step 3: Pull Environment Variables

```bash
vercel env pull .env.local
```

This will download the environment variables including `AIBO_DB_PRISMA_DATABASE_URL`

## Step 4: Run Migrations

```bash
npx prisma migrate deploy
```

This will create all the tables in your database.

## Step 5: Verify

Check the health endpoint:
```
https://your-project-name.vercel.app/api/health
```

Should return: `{"status":"ok","database":"connected"}`

---

## Alternative: Run Migrations Directly with Connection String

If you have the connection string from Vercel dashboard:

1. Copy `AIBO_DB_PRISMA_DATABASE_URL` from Vercel → Settings → Environment Variables
2. Run:
```bash
export AIBO_DB_PRISMA_DATABASE_URL="your-connection-string-here"
npx prisma migrate deploy
```

