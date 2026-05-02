-- ============================================================
--  SVR20 CMS — Complete Supabase Schema
--  Run this in Supabase → SQL Editor → New Query
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ============================================================
--  PRODUCTS
-- ============================================================
create table if not exists products (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        not null unique,
  tagline     text,
  description text,
  short_desc  text,
  category    text        not null default 'General',
  images      text[]      not null default '{}',
  tags        text[]      not null default '{}',
  benefits    text[]      not null default '{}',
  usage_home  text,
  usage_pro   text,
  pack_sizes  text,
  in_stock    boolean     not null default true,
  featured    boolean     not null default false,
  visible     boolean     not null default true,
  sort_order  int         not null default 0,
  seo_title   text,
  seo_desc    text,
  og_image    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Auto-update timestamp ──
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger products_touch_updated_at
  before update on products
  for each row execute procedure touch_updated_at();

-- ── RLS ──
alter table products enable row level security;
create policy "Public read visible products"  on products for select using (visible = true);
create policy "Admin full access products"    on products for all    using (auth.role() = 'authenticated');

-- ── Seed defaults ──
insert into products (name, slug, tagline, description, short_desc, category, images, tags, benefits, usage_home, usage_pro, pack_sizes, featured, visible, sort_order, seo_title, seo_desc)
values
  ('PlantSmör Butter', 'plant-based-butter',
   'Rich taste. Stable melt. Everyday performance.',
   'A premium plant-based butter crafted for smooth spreading and high heat stability. Consistent results every time — for toast, cooking, and professional bakery use. No dairy, no cholesterol, full flavour.',
   'High heat stability. Smooth spread. Consistent results.',
   'Spreads',
   ARRAY['/images/product-plant-based-margarine.webp'],
   ARRAY['vegan','dairy-free','butter','plant-based'],
   ARRAY['100% Dairy Free','Zero Cholesterol','High Heat Stable','Rich & Creamy'],
   'Toast, paratha, baking, sandwich spreads.',
   'Professional baking, sauté cooking, pastry production.',
   '200g, 500g, 1kg, 5kg',
   true, true, 1,
   'PlantSmör Butter — Premium Plant-Based Butter | Srivriddhi Enterprise',
   'Premium plant-based butter with rich taste and high heat stability. 100% dairy free. For home, HoReCa and professional kitchens.'
  ),
  ('PlantSmör Cooking Cream', 'vegan-cooking-cream',
   'Smooth texture. Heat stable. Professional finish.',
   'A plant-based cooking cream engineered to perform under professional kitchen conditions. No curdling, consistent reduction, reliable in service. Designed for gravies, sauces, and finishing.',
   'No curdling. Consistent reduction. Reliable in service.',
   'Cooking Essentials',
   ARRAY['/images/product-vegan-cooking-cream.webp'],
   ARRAY['vegan','cream','cooking','plant-based'],
   ARRAY['Heat Stable','No Curdling','Cholesterol Free','Smooth Texture'],
   'Pasta, curries, soups, desserts.',
   'Gravies, gourmet sauces, professional kitchen finishing.',
   '200ml, 500ml, 1L',
   true, true, 2,
   'PlantSmör Cooking Cream — Vegan Cooking Cream | Srivriddhi Enterprise',
   'Plant-based cooking cream that stays smooth under heat. No curdling. For home cooks and professional kitchens.'
  ),
  ('PlantSmör Mayonnaise', 'vegan-mayonnaise',
   'Thick texture. Stable emulsion. Kitchen-ready.',
   'A thick, glossy plant-based mayonnaise with a stable emulsion. No splitting, consistent batches, smooth finish. Built for sandwiches, dips, and quick service operations at any scale.',
   'No splitting. Consistent batches. Smooth finish.',
   'Condiments',
   ARRAY['/images/product-vegan-mayonnaise.webp'],
   ARRAY['vegan','mayo','condiment','egg-free'],
   ARRAY['Egg Free','100% Vegan','Creamy Texture','Stable Emulsion'],
   'Sandwiches, burgers, wraps, dips.',
   'Deli counters, QSR, gourmet dressings.',
   '200g, 500g, 1kg, 5kg',
   true, true, 3,
   'PlantSmör Mayonnaise — Vegan Mayo | Srivriddhi Enterprise',
   'Thick, stable plant-based mayonnaise. Egg free. 100% vegan. For home and professional kitchen use.'
  )
on conflict (slug) do nothing;

-- ============================================================
--  CATEGORIES
-- ============================================================
create table if not exists categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  slug       text not null unique,
  visible    boolean not null default true,
  sort_order int     not null default 0
);
alter table categories enable row level security;
create policy "Public read categories" on categories for select using (true);
create policy "Admin full access categories" on categories for all using (auth.role() = 'authenticated');

insert into categories (name, slug, sort_order) values
  ('Spreads',            'spreads',            1),
  ('Cooking Essentials', 'cooking-essentials', 2),
  ('Condiments',         'condiments',         3),
  ('Plant Protein',      'plant-protein',      4),
  ('Frozen Vegetables',  'frozen-vegetables',  5),
  ('Wellness Drinks',    'wellness-drinks',    6)
on conflict (slug) do nothing;

-- ============================================================
--  TESTIMONIALS
-- ============================================================
create table if not exists testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  company    text,
  quote      text not null,
  avatar_url text,
  rating     int  not null default 5,
  visible    boolean not null default true,
  sort_order int     not null default 0,
  created_at timestamptz not null default now()
);
alter table testimonials enable row level security;
create policy "Public read testimonials"  on testimonials for select using (visible = true);
create policy "Admin full access testimonials" on testimonials for all using (auth.role() = 'authenticated');

insert into testimonials (name, role, company, quote, rating, visible, sort_order) values
  ('Chef Aditya Sharma', 'Executive Chef',     'The Leela Hotels',
   'Srivriddhi''s cooking cream is the only plant-based cream that holds up in our high-heat kitchen. Absolutely incredible performance.', 5, true, 1),
  ('Priya Menon',         'F&B Manager',        'Taj Hotels',
   'We switched our entire butter line to PlantSmör. The taste difference is negligible but the demand from vegan guests has doubled.', 5, true, 2),
  ('Rajan Kapoor',        'Retail Director',    'Nature''s Basket',
   'Finally, a plant-based mayo that our team cannot tell apart from the original. We''ve been using it for 8 months.', 5, true, 3)
on conflict do nothing;

-- ============================================================
--  HOMEPAGE SECTIONS
-- ============================================================
create table if not exists homepage_sections (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  title      text,
  subtitle   text,
  body       text,
  image_url  text,
  cta_label  text,
  cta_link   text,
  visible    boolean not null default true,
  sort_order int     not null default 0,
  updated_at timestamptz not null default now()
);
alter table homepage_sections enable row level security;
create policy "Public read homepage sections"  on homepage_sections for select using (visible = true);
create policy "Admin full access homepage"     on homepage_sections for all    using (auth.role() = 'authenticated');

insert into homepage_sections (key, title, subtitle, body, cta_label, cta_link, visible, sort_order) values
  ('hero',
   'BUILT FOR KITCHENS. DRIVEN BY TASTE. MADE FOR INDIA.',
   'Premium plant-based foods engineered for chefs, HoReCa operators, and premium retail — where performance is non-negotiable.',
   '', 'Get Samples', '/contact', true, 1),
  ('about_teaser',
   'Plant-Based. Premium. Purposeful.',
   'Srivriddhi Enterprise was founded with a single conviction: plant-based food in India deserves the same rigor and quality as the world''s best food brands.',
   'We don''t make compromises for plants. We build better products — and prove it every time a chef or retailer chooses us again.',
   'Our Story', '/about', true, 2),
  ('cta_band',
   'Ready to Go Plant-Based?',
   'Talk to our team about bulk supply, samples, or trade terms. We respond within 24 hours.',
   '', 'Request Samples', '/contact', true, 3)
on conflict (key) do nothing;

-- ============================================================
--  ABOUT CONTENT
-- ============================================================
create table if not exists about_content (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  title      text,
  body       text,
  image_url  text,
  updated_at timestamptz not null default now()
);
alter table about_content enable row level security;
create policy "Public read about" on about_content for select using (true);
create policy "Admin full access about" on about_content for all using (auth.role() = 'authenticated');

insert into about_content (key, title, body) values
  ('mission',    'Our Mission',   'Srivriddhi Enterprise was founded with a single conviction: that plant-based food in India deserves to be built with the same rigor, quality, and ambition as the world''s best food brands.'),
  ('vision',     'Our Vision',    'To become India''s most trusted plant-based food enterprise — distributing premium products to every kitchen, hotel, and retail shelf in the country.'),
  ('story',      'Our Story',     'We don''t make compromises for plants. We build better products — and we prove it every time a chef, retailer, or customer chooses us again.'),
  ('founded',    'Founded',       '2021'),
  ('location',   'Location',     'Sagar, Madhya Pradesh, India'),
  ('team_desc',  'Our Team',      'A passionate group of food technologists, distribution experts, and brand builders united by one goal: making plant-based the obvious choice.')
on conflict (key) do nothing;

-- ============================================================
--  BLOG POSTS
-- ============================================================
create table if not exists blog_posts (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  slug        text        not null unique,
  excerpt     text,
  content     text,
  cover_image text,
  category    text        not null default 'General',
  tags        text[]      not null default '{}',
  published   boolean     not null default false,
  seo_title   text,
  seo_desc    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger blog_touch_updated_at
  before update on blog_posts
  for each row execute procedure touch_updated_at();
alter table blog_posts enable row level security;
create policy "Public read published posts" on blog_posts for select using (published = true);
create policy "Admin full access blog"      on blog_posts for all    using (auth.role() = 'authenticated');

-- ============================================================
--  INQUIRIES (Contact form submissions)
-- ============================================================
create table if not exists inquiries (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  email      text        not null,
  phone      text,
  subject    text,
  message    text        not null,
  read       boolean     not null default false,
  replied    boolean     not null default false,
  created_at timestamptz not null default now()
);
alter table inquiries enable row level security;
-- Public INSERT only (anyone can submit contact form)
create policy "Public insert inquiries" on inquiries for insert with check (true);
-- Admin read/update
create policy "Admin read inquiries"   on inquiries for select using (auth.role() = 'authenticated');
create policy "Admin update inquiries" on inquiries for update using (auth.role() = 'authenticated');
create policy "Admin delete inquiries" on inquiries for delete using (auth.role() = 'authenticated');

-- ============================================================
--  SITE SETTINGS (Key-Value)
-- ============================================================
create table if not exists site_settings (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  value      text,
  label      text,
  group_name text not null default 'general',
  updated_at timestamptz not null default now()
);
alter table site_settings enable row level security;
create policy "Public read settings"  on site_settings for select using (true);
create policy "Admin full settings"   on site_settings for all    using (auth.role() = 'authenticated');

insert into site_settings (key, value, label, group_name) values
  ('site_name',        'Srivriddhi Enterprise',     'Site Name',        'general'),
  ('site_tagline',     'Premium Plant-Based Foods', 'Site Tagline',     'general'),
  ('site_email',       'info@srivriddhi.com',       'Contact Email',    'contact'),
  ('site_phone',       '+91 7565 000 365',          'Phone Number',     'contact'),
  ('site_whatsapp',    '917565000365',              'WhatsApp Number',  'contact'),
  ('site_address',     'Sagar, M.P. — India',       'Address',          'contact'),
  ('footer_tagline',   'Plant-based products. Built to win.', 'Footer Tagline', 'branding'),
  ('hero_badge',       'Premium Plant-Based Foods', 'Hero Badge Text',  'hero'),
  ('og_default_image', '/images/hero.webp',         'Default OG Image', 'seo'),
  ('ga_id',            '',                          'Google Analytics ID', 'analytics'),
  ('fb_pixel',         '',                          'Facebook Pixel ID',   'analytics')
on conflict (key) do nothing;

-- ============================================================
--  SEO PAGES
-- ============================================================
create table if not exists seo_pages (
  id          uuid primary key default gen_random_uuid(),
  page        text not null unique,
  title       text,
  description text,
  og_image    text,
  updated_at  timestamptz not null default now()
);
alter table seo_pages enable row level security;
create policy "Public read seo"  on seo_pages for select using (true);
create policy "Admin full seo"   on seo_pages for all    using (auth.role() = 'authenticated');

insert into seo_pages (page, title, description) values
  ('home',    'Srivriddhi Enterprise — Premium Plant-Based Foods',
              'Premium plant-based butter, cooking cream and mayo built for Indian kitchens, HoReCa, and premium retail.'),
  ('products','Products — Srivriddhi Enterprise',
              'Explore our premium plant-based food range: butter, cooking cream, and mayonnaise.'),
  ('about',   'About — Srivriddhi Enterprise',
              'Srivriddhi Enterprise is a premium plant-based food brand built for Indian kitchens and global ambition.'),
  ('contact', 'Contact — Srivriddhi Enterprise',
              'Get in touch for retail, HoReCa, bulk supply enquiries, or product samples.'),
  ('blog',    'Insights — Srivriddhi Enterprise',
              'Articles, news, and insights about plant-based food, the HoReCa industry, and food innovation in India.')
on conflict (page) do nothing;

-- ============================================================
--  STORAGE BUCKETS (run after enabling Storage in Supabase)
-- ============================================================
-- Insert into storage.buckets manually from the Supabase dashboard, OR run:
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 5242880,
   ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('blog-images',    'blog-images',    true, 5242880,
   ARRAY['image/jpeg','image/png','image/webp']),
  ('site-assets',    'site-assets',    true, 10485760,
   ARRAY['image/jpeg','image/png','image/webp','image/svg+xml'])
on conflict (id) do nothing;

-- Storage policies
create policy "Public read product images"
  on storage.objects for select using (bucket_id = 'product-images');
create policy "Auth upload product images"
  on storage.objects for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "Auth update product images"
  on storage.objects for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "Auth delete product images"
  on storage.objects for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Public read blog images"
  on storage.objects for select using (bucket_id = 'blog-images');
create policy "Auth upload blog images"
  on storage.objects for insert with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');
create policy "Auth update blog images"
  on storage.objects for update using (bucket_id = 'blog-images' and auth.role() = 'authenticated');
create policy "Auth delete blog images"
  on storage.objects for delete using (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "Public read site assets"
  on storage.objects for select using (bucket_id = 'site-assets');
create policy "Auth manage site assets"
  on storage.objects for all using (bucket_id = 'site-assets' and auth.role() = 'authenticated');
