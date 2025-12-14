# Partner Registration Site

A Next.js application for partner registration and management with admin dashboard, deployable on Vercel.

## Features

- **Partner Registration**: Guests can register with their details and receive a unique partner code
- **Admin Dashboard**: Password-protected admin panel to view and manage all registered partners
- **Admin Notes**: Store private notes against each partner (not visible to partners)
- **Contact Us**: Contact form with email notifications
- **Email Notifications**: Automatic emails on registration and contact form submissions
- **Dark Mode**: Full light/dark mode support with theme toggle
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless)
- **Database**: Prisma ORM (supports MySQL locally, Postgres on Vercel)
- **Authentication**: Simple password-based admin access

## Prerequisites

- Node.js 18+ installed
- MySQL running locally (for local development)
- Git (for deployment)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
ADMIN_PASSWORD=your-secure-password-here
DATABASE_URL=mysql://root:password@localhost:3306/chachu_partners

# Email Configuration (Gmail)
# Note: You need to use a Gmail App Password, not your regular password
# See instructions below for creating an App Password
SMTP_USER=contact.infibiz@gmail.com
SMTP_PASSWORD=your_gmail_app_password_here
```

Replace:
- `your-secure-password-here` with your desired admin password
- `root:password` with your MySQL username and password
- `chachu_partners` with your database name (or create a new database)
- `your_gmail_app_password_here` with your Gmail App Password (see Email Setup below)

### 3. Create MySQL Database

```bash
mysql -u root -p
CREATE DATABASE chachu_partners;
exit
```

### 4. Initialize Database Schema

```bash
npx prisma migrate dev --name init
npx prisma generate
```

This will:
- Create the `partners` table in your MySQL database
- Generate the Prisma client for TypeScript

### 5. Set Up Gmail App Password (for Email Functionality)

Gmail requires an App Password for third-party applications. To create one:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable it if not already enabled)
3. Scroll down to **App passwords**
4. Select **Mail** and **Other (Custom name)** → enter "Infibizz"
5. Click **Generate**
6. Copy the 16-character password (no spaces)
7. Add it to your `.env.local` as `SMTP_PASSWORD`

**Important**: Use the App Password, NOT your regular Gmail password.

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

### View Data with Prisma Studio

```bash
npx prisma studio
```

Opens a GUI at [http://localhost:5555](http://localhost:5555) to view and edit database records.

### Create New Migrations

```bash
npx prisma migrate dev --name migration_name
```

### Reset Database (⚠️ Deletes all data)

```bash
npx prisma migrate reset
```

## Deployment to Vercel

### 1. Prepare for Production

Before deploying, you'll need to update the Prisma schema for Postgres:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "mysql" to "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Or create a separate schema file for production and use environment-based configuration.

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `ADMIN_PASSWORD`: Your admin password
   - `DATABASE_URL` or `AIBO_DB_PRISMA_DATABASE_URL`: Your Postgres connection string (from Vercel Postgres or Supabase)
   - `SMTP_USER`: `contact.infibiz@gmail.com` (or your Gmail address)
   - `SMTP_PASSWORD`: Your Gmail App Password (see Email Setup section below)

### 4. Set Up Production Database

**Option A: Vercel Postgres**
1. In your Vercel project, go to Storage tab
2. Create a new Postgres database
3. Copy the connection string to `DATABASE_URL` environment variable

**Option B: Supabase**
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from Settings > Database
4. Add it to Vercel environment variables as `DATABASE_URL`

### 5. Run Migrations on Vercel

After deployment, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Run migrations
npx prisma migrate deploy
```

Or add a build script that runs migrations automatically.

## Project Structure

```
chachu_site/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Home page
│   ├── register/
│   │   └── page.tsx            # Registration page
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   └── api/
│       ├── register/
│       │   └── route.ts        # POST: Register partner
│       ├── admin/
│       │   └── auth/
│       │       └── route.ts    # POST: Admin authentication
│       └── partners/
│           ├── route.ts        # GET: List all partners
│           └── [id]/
│               └── route.ts    # POST: Update admin notes
├── components/
│   ├── ThemeProvider.tsx       # Theme context provider
│   ├── ThemeToggle.tsx         # Dark/light mode toggle
│   ├── RegisterForm.tsx        # Registration form
│   ├── AdminLogin.tsx          # Admin login component
│   └── PartnerList.tsx         # Partner list table
├── lib/
│   ├── db.ts                   # Prisma client
│   └── utils.ts                # Utility functions
├── prisma/
│   └── schema.prisma           # Database schema
└── types/
    └── index.ts                # TypeScript types
```

## Environment Variables

### Local Development (.env.local)

```env
ADMIN_PASSWORD=your-secure-password-here
DATABASE_URL=mysql://user:password@localhost:3306/database_name
```

### Production (Vercel)

```env
ADMIN_PASSWORD=your-secure-production-password
DATABASE_URL=postgresql://user:password@host:5432/database
# OR use Prisma Postgres format:
AIBO_DB_PRISMA_DATABASE_URL=postgresql://user:password@host:5432/database?pgbouncer=true&connect_timeout=15

# Email Configuration
SMTP_USER=contact.infibiz@gmail.com
SMTP_PASSWORD=your_gmail_app_password_here
```

**Important**: For Gmail, you MUST use an App Password (not your regular password). See Email Setup instructions above.

## Features in Detail

### Partner Registration

- Collects: Name, Phone Number(s), City, State, Pin Code, Address, Email (required)
- Sends welcome email to partner with their unique code
- Sends notification email to admin
- Validates all required fields
- Generates unique partner code (format: `PART-XXXXXXXX`)
- Displays success message with unique code

### Admin Dashboard

- Password-protected access
- View all registered partners in a table
- Search/filter partners by name, code, email, location, or phone
- Add/edit admin notes for each partner (private, not visible to partners)
- Logout functionality

### Dark Mode

- System preference detection
- Manual toggle in navigation bar
- Smooth transitions
- Persists user preference

## Troubleshooting

### Database Connection Issues

- Verify MySQL is running: `mysql -u root -p`
- Check DATABASE_URL format: `mysql://user:password@host:port/database`
- Ensure database exists: `CREATE DATABASE chachu_partners;`

### Prisma Issues

- Regenerate client: `npx prisma generate`
- Reset database: `npx prisma migrate reset` (⚠️ deletes data)
- Check schema: `npx prisma validate`

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

## License

Private project - All rights reserved

