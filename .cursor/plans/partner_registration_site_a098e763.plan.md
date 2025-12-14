---
name: Partner Registration Site
overview: Build a Next.js site with partner registration, admin dashboard, and light/dark mode. Use Vercel serverless functions with a database for data storage, password-protected admin access, and a modern UI.
todos: []
---

# Partner Registration Site

## Architecture Overview

A Next.js application deployable on Vercel with:

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Vercel serverless API routes
- **Database**: 
  - **Local Development**: MySQL (your local instance)
  - **Production**: Vercel Postgres (free tier) or Supabase (free tier)
  - **ORM**: Prisma or Drizzle ORM (supports both MySQL and Postgres)
- **Authentication**: Simple password-based admin access via environment variable
- **Styling**: Tailwind CSS with dark mode support

## Data Model

**Partners Table:**

- `id` (UUID, primary key)
- `name` (string)
- `phone_numbers` (array of strings)
- `city` (string)
- `state` (string)
- `pin_code` (string)
- `address` (string)
- `email` (string, nullable)
- `unique_code` (string, unique, auto-generated)
- `created_at` (timestamp)
- `admin_notes` (text, nullable) - only visible to admin

## File Structure

```
chachu_site/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                 # Home page with provided content
│   ├── register/
│   │   └── page.tsx             # Partner registration form
│   ├── admin/
│   │   └── page.tsx             # Admin dashboard (password protected)
│   └── api/
│       ├── register/
│       │   └── route.ts         # POST: Register new partner
│       ├── partners/
│       │   └── route.ts         # GET: List all partners (admin only)
│       └── partners/[id]/
│           └── route.ts         # POST: Update admin notes for partner
├── components/
│   ├── ThemeToggle.tsx          # Dark/light mode toggle
│   ├── RegisterForm.tsx         # Registration form component
│   ├── AdminLogin.tsx           # Password prompt for admin
│   └── PartnerList.tsx          # Partner list display for admin
├── lib/
│   ├── db.ts                    # Database connection/client (Prisma/Drizzle)
│   └── utils.ts                 # Utility functions (generate unique code, etc.)
├── prisma/                      # If using Prisma
│   ├── schema.prisma            # Database schema (supports MySQL & Postgres)
│   └── migrations/              # Database migrations
├── types/
│   └── index.ts                 # TypeScript types/interfaces
├── package.json
├── tailwind.config.ts
├── next.config.js
├── .env.local                   # Local environment variables (MySQL)
└── .env.example                 # Example env file template
```

## Implementation Details

### 1. Home Page (`app/page.tsx`)

- Display provided hero content
- Call-to-action button linking to registration
- Theme-aware styling

### 2. Registration Page (`app/register/page.tsx`)

- Form with fields: Name, Phone(s), City, State, Pin Code, Address, Email (optional)
- Validation for required fields
- On submit: POST to `/api/register`
- Success: Display unique code to user
- Error handling with user-friendly messages

### 3. Admin Page (`app/admin/page.tsx`)

- Password prompt (check against `ADMIN_PASSWORD` env variable)
- Session management (use cookies or localStorage)
- Partner list table with: Name, Phone, Address, Email, Unique Code, Created Date
- Editable notes field for each partner
- Search/filter functionality
- Export functionality (optional)

### 4. API Routes

**POST `/api/register`**:

- Validate input data
- Generate unique code (format: e.g., `PART-{random8chars}` or UUID-based)
- Insert into database
- Return unique code

**GET `/api/partners`**:

- Check admin password from request headers/cookies
- Query all partners from database
- Return JSON array (exclude admin_notes if not needed in response, or include it)

**POST `/api/partners/[id]`**:

- Check admin authentication
- Update `admin_notes` field for specified partner
- Return success/error

### 5. Database Setup

**Local Development (MySQL):**

- Use Prisma ORM (supports MySQL and Postgres seamlessly)
- Create `prisma/schema.prisma` with partners table schema
- Run `npx prisma migrate dev` to create database and tables locally
- Run `npx prisma generate` to generate Prisma client
- Connection string format: `mysql://user:password@localhost:3306/database_name`

**Production (Vercel):**

- Use Vercel Postgres or Supabase
- Same Prisma schema works for both MySQL and Postgres
- Set `DATABASE_URL` environment variable in Vercel dashboard
- Run migrations on Vercel (or use Prisma Migrate in production)

**Database Schema:**

- Prisma schema will define the partners table
- Supports both MySQL and Postgres with same schema definition
- Phone numbers stored as JSON array (supported by both databases)

### 6. Styling & Theme

- Tailwind CSS with `dark:` variants
- Theme toggle component in header/navbar
- Smooth transitions between themes
- Responsive design (mobile-friendly)

## Environment Variables

**Local Development (.env.local):**

```
ADMIN_PASSWORD=your-secure-password-here
DATABASE_URL=mysql://root:password@localhost:3306/chachu_partners
```

**Production (Vercel Dashboard):**

```
ADMIN_PASSWORD=your-secure-production-password
DATABASE_URL=postgresql://user:password@host:5432/database
# OR for Supabase:
# DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

**Local Development Setup:**

1. Create MySQL database: `CREATE DATABASE chachu_partners;`
2. Copy `.env.example` to `.env.local` and fill in your MySQL credentials
3. Run `npx prisma migrate dev` to create tables
4. Run `npm run dev` to start Next.js dev server
5. Access at `http://localhost:3000`

## Local Development

**Prerequisites:**

- Node.js 18+ installed
- MySQL running locally
- MySQL database created

**Setup Steps:**

1. Install dependencies: `npm install`
2. Create `.env.local` with your MySQL connection string
3. Initialize database: `npx prisma migrate dev --name init`
4. Generate Prisma client: `npx prisma generate`
5. Start dev server: `npm run dev`
6. Open `http://localhost:3000`

**Database Management:**

- View data: `npx prisma studio` (opens GUI at http://localhost:5555)
- Create migrations: `npx prisma migrate dev --name migration_name`
- Reset database: `npx prisma migrate reset` (careful: deletes all data)

## Deployment

**Vercel Deployment:**

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:

   - `ADMIN_PASSWORD`
   - `DATABASE_URL` (Postgres connection string)

4. Vercel will automatically detect Next.js and deploy
5. Run migrations on Vercel (via Vercel CLI or add migration script to build)

**Note:** The same Prisma schema works for both MySQL (local) and Postgres (Vercel) - no code changes needed!

## Unique Code Generation

Generate unique codes using:

- Format: `PART-{8 random alphanumeric characters}` or
- UUID-based: `PART-{first-8-chars-of-UUID}`
- Ensure uniqueness via database constraint