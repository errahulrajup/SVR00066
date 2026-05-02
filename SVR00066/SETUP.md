# SVR20 CMS — Complete Setup Guide

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite 6
- **Styling:** Tailwind CSS v4 + Custom Design System
- **Animations:** Framer Motion
- **Backend/CMS:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel

---

## Step 1 — Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name, database password, region (Singapore for India)
3. Wait for project to spin up (~2 min)

---

## Step 2 — Run the Database Schema

1. Supabase Dashboard → **SQL Editor** → **New Query**
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run** — this creates all tables, RLS policies, storage buckets, and seeds initial data

---

## Step 3 — Create Admin User

1. Supabase Dashboard → **Authentication** → **Users** → **Add User**
2. Enter your admin email + strong password
3. This is what you'll use to log into `/admin`

---

## Step 4 — Get API Keys

1. Supabase Dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public key** → `VITE_SUPABASE_ANON_KEY`

---

## Step 5 — Local Development

```bash
# Clone / extract project
cd svr20-cms

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Fill in your Supabase values in .env:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key

# Start dev server
npm run dev
# → http://localhost:5173
# → Admin: http://localhost:5173/admin
```

---

## Step 6 — Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
vercel --prod
```

### Option B — Vercel Dashboard
1. Push code to GitHub
2. Vercel Dashboard → **New Project** → Import repository
3. Framework: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Add Environment Variables in Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Admin Panel

| URL | Purpose |
|-----|---------|
| `/admin` | Dashboard |
| `/admin/products` | List all products |
| `/admin/products/new` | Add product |
| `/admin/products/:id` | Edit product |
| `/admin/blog` | Blog posts |
| `/admin/blog/new` | Write post |
| `/admin/inquiries` | Contact form submissions |
| `/admin/homepage` | Edit hero, teaser, CTA text |
| `/admin/about` | Edit about page content |
| `/admin/testimonials` | Manage testimonials |
| `/admin/seo` | Per-page SEO meta tags |
| `/admin/settings` | Site-wide settings (name, phone, email, etc.) |

---

## What's Fully Dynamic (from Supabase)

| Feature | Database Table |
|---------|---------------|
| Products | `products` |
| Product categories | `categories` |
| Homepage sections | `homepage_sections` |
| About page content | `about_content` |
| Testimonials | `testimonials` |
| Blog posts | `blog_posts` |
| Contact submissions | `inquiries` |
| Site settings | `site_settings` |
| SEO per page | `seo_pages` |
| Image uploads | Supabase Storage |

---

## Image Upload

- Images are uploaded directly to **Supabase Storage**
- Buckets: `product-images`, `blog-images`, `site-assets`
- All buckets are **public** (read) with **auth-only** write
- Max file size: 5MB per image
- Supported: JPEG, PNG, WebP, GIF

---

## Adding a New Admin User

```
Supabase → Authentication → Users → Invite User
```
Or via SQL:
```sql
-- Only Supabase Auth can create users safely
-- Use the Dashboard → Authentication → Users → Add User
```

---

## Folder Structure

```
svr20-cms/
├── public/
│   ├── images/          ← Static images (logo, hero, products)
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── SEO.tsx
│   │   │   └── ImageUpload.tsx
│   │   ├── hooks/
│   │   │   └── index.ts        ← All React data hooks
│   │   ├── lib/
│   │   │   └── supabase.ts     ← Client + all API functions
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── BlogPages.tsx   ← Blog + BlogPost + NotFound
│   │   │   └── admin/
│   │   │       ├── AdminLogin.tsx
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── AdminProducts.tsx
│   │   │       ├── AdminProductForm.tsx
│   │   │       └── AdminPages.tsx  ← All other admin pages
│   │   └── App.tsx
│   ├── styles/
│   │   └── index.css           ← Design system + tokens
│   └── main.tsx
├── supabase/
│   └── schema.sql              ← Full DB schema + seed data
├── .env.example
├── vercel.json
└── SETUP.md
```

---

## Common Issues

### Build fails: "Cannot resolve tw-animate-css"
Already fixed — this project does NOT import `tw-animate-css`.

### Products not showing
- Check Supabase → Table Editor → `products` — rows must have `visible = true`
- Check RLS policies are applied (schema.sql runs correctly)

### Image upload fails
- Ensure storage buckets exist in Supabase → Storage
- Check bucket policies in schema.sql were applied

### Admin login fails
- Confirm user exists in Supabase → Authentication → Users
- Supabase Auth uses email + password — not the old password system

### CORS errors
- Supabase automatically handles CORS for your Vercel domain
- Add your custom domain in Supabase → Settings → API → Allowed Origins if needed

---

## Performance Notes

- Code splitting: vendor / supabase / framer-motion chunks separated
- Images: use WebP format, lazy loaded via `loading="lazy"`
- Animations: Framer Motion `whileInView` with `once: true` prevents re-triggering
- Supabase RLS: Only `visible=true` products are returned to public users

---

## Support

- Supabase Docs: docs.supabase.com
- Framer Motion: framer.com/motion
- Vite: vitejs.dev
