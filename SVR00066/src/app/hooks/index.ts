import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  auth, productsApi, testimonialsApi, blogApi,
  inquiriesApi, settingsApi, seoApi, aboutApi, homepageApi,
  type Product, type Testimonial, type BlogPost, type Inquiry,
  type HomepageSection, type SeoPage,
} from './supabase';

// ── Auth ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: { subscription } } = auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const signIn  = useCallback((email: string, pw: string) => auth.signIn(email, pw),  []);
  const signOut = useCallback(() => auth.signOut(), []);
  const isAdmin = !!session;

  return { session, loading, isAdmin, signIn, signOut };
}

// ── Generic data hook ─────────────────────────────────────────────────────────

function useData<T>(
  fetcher: () => Promise<{ data: T | null; error: unknown }>,
  deps: unknown[] = [],
) {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const { data: d, error: e } = await fetcher();
    if (e) setError((e as Error).message ?? 'Error loading data');
    else   setData(d);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}

// ── Products ──────────────────────────────────────────────────────────────────

export function useProducts(opts?: { category?: string; featured?: boolean }) {
  return useData<Product[]>(
    () => productsApi.list(opts) as Promise<{ data: Product[] | null; error: unknown }>,
    [opts?.category, opts?.featured],
  );
}

export function useAllProducts() {
  return useData<Product[]>(
    () => productsApi.listAll() as Promise<{ data: Product[] | null; error: unknown }>,
    [],
  );
}

export function useProduct(slug: string) {
  return useData<Product>(
    () => productsApi.bySlug(slug) as Promise<{ data: Product | null; error: unknown }>,
    [slug],
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────

export function useTestimonials(admin = false) {
  return useData<Testimonial[]>(
    () => (admin ? testimonialsApi.listAll() : testimonialsApi.list()) as Promise<{ data: Testimonial[] | null; error: unknown }>,
    [admin],
  );
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export function useBlogPosts(admin = false) {
  return useData<BlogPost[]>(
    () => (admin ? blogApi.listAll() : blogApi.list()) as Promise<{ data: BlogPost[] | null; error: unknown }>,
    [admin],
  );
}

export function useBlogPost(slug: string) {
  return useData<BlogPost>(
    () => blogApi.bySlug(slug) as Promise<{ data: BlogPost | null; error: unknown }>,
    [slug],
  );
}

// ── Inquiries ─────────────────────────────────────────────────────────────────

export function useInquiries(filter?: 'unread' | 'all') {
  return useData<Inquiry[]>(
    () => inquiriesApi.list(filter) as Promise<{ data: Inquiry[] | null; error: unknown }>,
    [filter],
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const map = await settingsApi.getMap();
    setSettings(map);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  return { settings, loading, reload: load };
}

// ── SEO ───────────────────────────────────────────────────────────────────────

export function usePageSeo(page: string) {
  return useData<SeoPage>(
    () => seoApi.byPage(page) as Promise<{ data: SeoPage | null; error: unknown }>,
    [page],
  );
}

// ── Homepage ──────────────────────────────────────────────────────────────────

export function useHomepageSections(admin = false) {
  return useData<HomepageSection[]>(
    () => (admin ? homepageApi.listAll() : homepageApi.list()) as Promise<{ data: HomepageSection[] | null; error: unknown }>,
    [admin],
  );
}

// ── About ─────────────────────────────────────────────────────────────────────

export function useAboutContent() {
  const [content, setContent] = useState<Record<string, { title: string; body: string; image_url?: string }>>({});
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    const map = await aboutApi.getMap();
    setContent(map);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  return { content, loading, reload: load };
}

// ── Unread count ───────────────────────────────────────────────────────────────

export function useUnreadCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    inquiriesApi.countUnread().then(setCount);
  }, []);
  return count;
}
