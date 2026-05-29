# Zev Felix Website — Setup & Deployment Guide

## Overview

Full personal website built with:
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling + dynamic CSS custom properties for theming
- **Supabase** for database, auth, and file storage
- **TipTap** for WYSIWYG rich text editing
- **@dnd-kit** for drag-and-drop section reordering
- **Vercel** for deployment

---

## 1. Prerequisites

- Node.js ≥ 18
- A Supabase account (free tier works for getting started)
- A Vercel account (free tier works)

---

## 2. Supabase Setup

### 2.1 Create project

1. Go to [supabase.com](https://supabase.com) → New project
2. Note your **Project URL** and **anon/public key** from Settings → API

### 2.2 Run database migrations

In the Supabase dashboard → SQL Editor, run the migrations in order:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_rls_policies.sql
supabase/migrations/003_seed_data.sql
```

Paste each file's contents and run it.

### 2.3 Create storage bucket

In Supabase dashboard → Storage → New bucket:
- Name: `media`
- Public: **Yes** (so uploaded images/files are publicly accessible)

Then go to Storage → Policies and add:
```sql
-- Allow public read
CREATE POLICY "media_public_read" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'media');

-- Allow authenticated admins to upload
CREATE POLICY "media_admin_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND (
    SELECT COUNT(*) FROM user_roles WHERE user_id = auth.uid()
  ) > 0);

-- Allow authenticated admins to delete
CREATE POLICY "media_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND (
    SELECT COUNT(*) FROM user_roles WHERE user_id = auth.uid()
  ) > 0);
```

### 2.4 Create your admin user

1. Supabase dashboard → Authentication → Users → Invite user
2. Enter your email. Supabase will send an invite link.
3. After you create your account, go to SQL Editor and run:

```sql
-- Replace the email with yours
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'your@email.com';
```

### 2.5 Enable MFA (optional but recommended)

Supabase dashboard → Authentication → Settings → Multi-Factor Authentication → Enable.
Users can then enroll MFA at the Supabase auth portal, or you can add in-app MFA enrollment later.

---

## 3. Local Development

### 3.1 Install dependencies

```bash
cd zev-website
npm install
```

### 3.2 Environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Zev Felix"
```

> **IMPORTANT**: Never commit `.env.local` to Git. It is in `.gitignore`.

### 3.3 Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

---

## 4. Content Management

### Accessing the admin

1. Go to `/admin` — you will be redirected to the login page
2. Sign in with the email you used to create your admin user in step 2.4
3. You will land on the dashboard

### Pages editor

- **Admin → Pages** lists all pages
- Click **Edit** on any page to open the page editor
- The editor shows **page metadata** (title, description) at the top
- Below are **content sections** — drag to reorder, click to expand and edit
- Click **Add section** to add new content blocks
- Click **Publish** to make the page live; **Set to Draft** to hide it

### Media library

- **Admin → Media** shows all uploaded files
- Click **Upload file** to upload images, videos, or PDFs
- Fill in alt text (important for accessibility and SEO)
- Click any file to see its details and public URL
- Use the public URL to reference files in the WYSIWYG editor

### Projects

- **Admin → Projects** lists all projects
- Click **New project** to add a project
- Fill in title, slug, description, status, and tags
- Check **Published** when ready to show on the public site
- Projects appear on the `/work` page

### CV & Publications

- **Admin → CV & Publications** has two tabs:
  - **CV Entries** — education, training, experience, leadership, awards
  - **Publications** — journal articles, chapters, presentations
- Click **Add entry** or **Add publication** to create a new record
- Click the edit icon on any row to modify it

### Theme Editor

- **Admin → Theme Editor** lets you change the site's visual design
- Choose a theme preset on the left, or adjust colors manually
- Changes appear in a live preview before you save
- Click **Save theme** to persist your color changes
- Click **Activate** to make a theme the active one across the whole site

### Site Settings

- **Admin → Settings** controls the footer (tagline, email, social links) and SEO defaults
- Changes take effect on the next page load

---

## 5. Deploying to Vercel

### 5.1 Push to GitHub

```bash
git init
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/zev-website.git
git push -u origin main
```

### 5.2 Import to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variables (Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL        = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = your-anon-key
SUPABASE_SERVICE_ROLE_KEY       = your-service-role-key
NEXT_PUBLIC_SITE_URL            = https://zevfelix.com
NEXT_PUBLIC_SITE_NAME           = Zev Felix
```

5. Click **Deploy**

### 5.3 Custom domain

In Vercel → Project → Domains:
- Add your domain (e.g. `zevfelix.com`)
- Follow Vercel's instructions to update your DNS records
- SSL is automatic

### 5.4 Update Supabase allowed URLs

In Supabase dashboard → Authentication → URL Configuration:
- Add your production URL to **Site URL**: `https://zevfelix.com`
- Add to **Redirect URLs**: `https://zevfelix.com/auth/callback`

---

## 6. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-only) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your full site URL |
| `NEXT_PUBLIC_SITE_NAME` | No | Site name (default: Zev Felix) |
| `RESEND_API_KEY` | No | For email notifications on contact form |
| `NOTIFICATION_EMAIL` | No | Email to receive contact form notifications |

---

## 7. Security Checklist

- [x] Row Level Security (RLS) enabled on all tables
- [x] Admin routes protected by middleware (server-side)
- [x] Service role key only used server-side (never in browser)
- [x] Input validation with Zod on all API routes
- [x] HTML sanitization via TipTap's built-in sanitizer
- [x] File type + size validation on upload
- [x] Honeypot field on contact form
- [x] Security headers configured in `next.config.ts`
- [x] Content Security Policy header
- [x] Audit log for all admin actions
- [x] CORS handled by Supabase
- [ ] Enable MFA for your admin account (do this in Supabase Auth settings)
- [ ] Rotate service role key if ever exposed
- [ ] Review CSP header after adding third-party scripts

---

## 8. Updating Content

### Adding a new page

1. Admin → Pages → (there is no "new page" for system pages, but non-system pages can be added via SQL or by extending the admin)
2. For a fully new route, create `app/(public)/your-slug/page.tsx` and add a nav item in Admin → Settings (or directly in the `nav_items` table)

### Rebuilding the search index

When you add projects or publish pages, the search index is automatically updated via the API routes. To manually rebuild:

```sql
-- Re-index all published pages
INSERT INTO search_index (content_type, content_id, title, excerpt, url, is_public)
SELECT 'page', id, title, description, '/' || CASE WHEN slug = 'home' THEN '' ELSE slug END, true
FROM pages
WHERE status = 'published'
ON CONFLICT (content_type, content_id) DO UPDATE
SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, updated_at = now();
```

---

## 9. File Structure Reference

```
zev-website/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── layout.tsx     # Nav + Footer wrapper
│   │   ├── page.tsx       # Home
│   │   ├── about/
│   │   ├── path/
│   │   ├── unplugged/
│   │   ├── medicine/
│   │   ├── outdoors/
│   │   ├── work/
│   │   ├── cv/
│   │   ├── contact/
│   │   └── search/
│   ├── admin/             # Admin dashboard
│   │   ├── layout.tsx     # Admin shell (auth-gated)
│   │   ├── login/
│   │   ├── pages/
│   │   ├── media/
│   │   ├── projects/
│   │   ├── cv/
│   │   ├── theme/
│   │   ├── newsletter/
│   │   ├── audit/
│   │   └── settings/
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout with ThemeProvider
├── components/
│   ├── admin/             # Admin-only components
│   ├── public/            # Public-facing components
│   ├── theme/             # ThemeProvider
│   └── ui/                # Shared UI primitives
├── lib/
│   ├── auth/              # requireAdmin, auditLog
│   ├── search/            # FTS search helpers
│   ├── supabase/          # Client/server/admin Supabase clients
│   ├── theme/             # themeToCSS, presets
│   └── utils.ts           # cn(), formatBytes(), etc.
├── supabase/
│   └── migrations/        # SQL migration files
├── types/
│   └── database.ts        # TypeScript types
├── middleware.ts           # Auth protection for /admin
├── next.config.ts
├── tailwind.config.ts
└── .env.example
```

---

## 10. Common Tasks

**Change your name / site title**
→ Admin → Settings → Default site title

**Update the home page hero text**
→ Admin → Pages → Home → Edit → Hero section

**Add a climbing photo to the outdoors page**
→ Admin → Media → Upload file → then reference the URL in the Outdoors page editor

**Add a new publication**
→ Admin → CV & Publications → Publications tab → Add publication

**Mark a project as completed**
→ Admin → Projects → Edit project → Status: Completed → Save

**Change site colors**
→ Admin → Theme Editor → adjust colors → Save theme → Activate
