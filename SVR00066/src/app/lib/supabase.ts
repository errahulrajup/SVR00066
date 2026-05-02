import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.warn('[Supabase] Missing env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(
  SUPABASE_URL  || 'https://placeholder.supabase.co',
  SUPABASE_ANON || 'placeholder-anon-key',
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  short_desc: string | null;
  category: string;
  images: string[];
  tags: string[];
  benefits: string[];
  usage_home: string | null;
  usage_pro: string | null;
  pack_sizes: string | null;
  in_stock: boolean;
  featured: boolean;
  visible: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_desc: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  rating: number;
  visible: boolean;
  sort_order: number;
  created_at: string;
}

export interface HomepageSection {
  id: string;
  key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_link: string | null;
  visible: boolean;
  sort_order: number;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string;
  tags: string[];
  published: boolean;
  seo_title: string | null;
  seo_desc: string | null;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  replied: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  label: string | null;
  group_name: string;
  updated_at: string;
}

export interface SeoPage {
  id: string;
  page: string;
  title: string | null;
  description: string | null;
  og_image: string | null;
  updated_at: string;
}

export interface AboutContent {
  id: string;
  key: string;
  title: string | null;
  body: string | null;
  image_url: string | null;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  visible: boolean;
  sort_order: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const auth = {
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signOut: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  onAuthStateChange: (cb: Parameters<typeof supabase.auth.onAuthStateChange>[0]) =>
    supabase.auth.onAuthStateChange(cb),
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  list: async (opts?: { category?: string; featured?: boolean }) => {
    let q = supabase
      .from('products')
      .select('*')
      .eq('visible', true)
      .order('sort_order', { ascending: true });
    if (opts?.category) q = q.eq('category', opts.category);
    if (opts?.featured !== undefined) q = q.eq('featured', opts.featured);
    return q;
  },

  listAll: () =>
    supabase.from('products').select('*').order('sort_order', { ascending: true }),

  bySlug: (slug: string) =>
    supabase.from('products').select('*').eq('slug', slug).eq('visible', true).single(),

  byId: (id: string) =>
    supabase.from('products').select('*').eq('id', id).single(),

  create: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('products').insert(data).select().single(),

  update: (id: string, data: Partial<Product>) =>
    supabase.from('products').update(data).eq('id', id).select().single(),

  remove: (id: string) =>
    supabase.from('products').delete().eq('id', id),

  toggleVisible: (id: string, visible: boolean) =>
    supabase.from('products').update({ visible }).eq('id', id),

  toggleFeatured: (id: string, featured: boolean) =>
    supabase.from('products').update({ featured }).eq('id', id),
};

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonialsApi = {
  list: () =>
    supabase.from('testimonials').select('*').eq('visible', true).order('sort_order'),
  listAll: () =>
    supabase.from('testimonials').select('*').order('sort_order'),
  create: (data: Omit<Testimonial, 'id' | 'created_at'>) =>
    supabase.from('testimonials').insert(data).select().single(),
  update: (id: string, data: Partial<Testimonial>) =>
    supabase.from('testimonials').update(data).eq('id', id).select().single(),
  remove: (id: string) =>
    supabase.from('testimonials').delete().eq('id', id),
};

// ─── Homepage Sections ────────────────────────────────────────────────────────

export const homepageApi = {
  list: () =>
    supabase.from('homepage_sections').select('*').eq('visible', true).order('sort_order'),
  listAll: () =>
    supabase.from('homepage_sections').select('*').order('sort_order'),
  byKey: (key: string) =>
    supabase.from('homepage_sections').select('*').eq('key', key).single(),
  update: (id: string, data: Partial<HomepageSection>) =>
    supabase.from('homepage_sections').update(data).eq('id', id).select().single(),
  upsertByKey: (key: string, data: Partial<HomepageSection>) =>
    supabase.from('homepage_sections').upsert({ key, ...data }, { onConflict: 'key' }).select().single(),
};

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const blogApi = {
  list: (limit = 20) =>
    supabase.from('blog_posts').select('*').eq('published', true)
      .order('created_at', { ascending: false }).limit(limit),
  listAll: () =>
    supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
  bySlug: (slug: string) =>
    supabase.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single(),
  byId: (id: string) =>
    supabase.from('blog_posts').select('*').eq('id', id).single(),
  create: (data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('blog_posts').insert(data).select().single(),
  update: (id: string, data: Partial<BlogPost>) =>
    supabase.from('blog_posts').update(data).eq('id', id).select().single(),
  remove: (id: string) =>
    supabase.from('blog_posts').delete().eq('id', id),
};

// ─── Inquiries ────────────────────────────────────────────────────────────────

export const inquiriesApi = {
  list: (filter?: 'unread' | 'all') => {
    let q = supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (filter === 'unread') q = q.eq('read', false);
    return q;
  },
  submit: (data: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
    supabase.from('inquiries').insert(data),
  markRead: (id: string) =>
    supabase.from('inquiries').update({ read: true }).eq('id', id),
  markReplied: (id: string) =>
    supabase.from('inquiries').update({ replied: true, read: true }).eq('id', id),
  remove: (id: string) =>
    supabase.from('inquiries').delete().eq('id', id),
  countUnread: async () => {
    const { count } = await supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('read', false);
    return count ?? 0;
  },
};

// ─── Site Settings ────────────────────────────────────────────────────────────

export const settingsApi = {
  getAll: () =>
    supabase.from('site_settings').select('*').order('group_name'),
  get: (key: string) =>
    supabase.from('site_settings').select('*').eq('key', key).single(),
  set: (key: string, value: string) =>
    supabase.from('site_settings').update({ value }).eq('key', key),
  getMap: async (): Promise<Record<string, string>> => {
    const { data } = await supabase.from('site_settings').select('key,value');
    return Object.fromEntries((data ?? []).map(r => [r.key, r.value ?? '']));
  },
};

// ─── SEO Pages ────────────────────────────────────────────────────────────────

export const seoApi = {
  getAll: () => supabase.from('seo_pages').select('*'),
  byPage: (page: string) => supabase.from('seo_pages').select('*').eq('page', page).single(),
  update: (page: string, data: Partial<SeoPage>) =>
    supabase.from('seo_pages').update(data).eq('page', page).select().single(),
};

// ─── About Content ────────────────────────────────────────────────────────────

export const aboutApi = {
  getAll: () => supabase.from('about_content').select('*'),
  getMap: async (): Promise<Record<string, { title: string; body: string; image_url?: string }>> => {
    const { data } = await supabase.from('about_content').select('*');
    return Object.fromEntries((data ?? []).map(r => [r.key, { title: r.title ?? '', body: r.body ?? '', image_url: r.image_url ?? undefined }]));
  },
  update: (key: string, data: { title?: string; body?: string; image_url?: string }) =>
    supabase.from('about_content').update(data).eq('key', key),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
  list: () => supabase.from('categories').select('*').eq('visible', true).order('sort_order'),
  listAll: () => supabase.from('categories').select('*').order('sort_order'),
  create: (data: Omit<Category, 'id'>) => supabase.from('categories').insert(data).select().single(),
  update: (id: string, data: Partial<Category>) => supabase.from('categories').update(data).eq('id', id),
  remove: (id: string) => supabase.from('categories').delete().eq('id', id),
};

// ─── Storage / Image Upload ───────────────────────────────────────────────────

export const storageApi = {
  upload: async (bucket: 'product-images' | 'blog-images' | 'site-assets', file: File): Promise<string | null> => {
    const ext  = file.name.split('.').pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(name, file, {
      cacheControl: '31536000', upsert: false,
    });
    if (error) { console.error('[Storage upload]', error); return null; }
    const { data } = supabase.storage.from(bucket).getPublicUrl(name);
    return data.publicUrl;
  },

  remove: async (bucket: string, url: string): Promise<void> => {
    const path = url.split(`/${bucket}/`)[1];
    if (!path) return;
    await supabase.storage.from(bucket).remove([path]);
  },
};
