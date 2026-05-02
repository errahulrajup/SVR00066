import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  schema?: object;
}

export function SEO({ title, description, ogImage, canonical, type = 'website', schema }: SEOProps) {
  useEffect(() => {
    if (title)       document.title = title;
    const setMeta = (name: string, content: string, prop = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (prop) el.setAttribute('property', name); else el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };
    if (description) { setMeta('description', description); setMeta('og:description', description, true); setMeta('twitter:description', description); }
    if (title)       { setMeta('og:title', title, true); setMeta('twitter:title', title); }
    if (ogImage)     { setMeta('og:image', ogImage, true); setMeta('twitter:image', ogImage); }
    if (canonical)   { let l = document.querySelector('link[rel="canonical"]'); if (!l) { l = document.createElement('link'); l.setAttribute('rel','canonical'); document.head.appendChild(l); } l.setAttribute('href', canonical); }
    setMeta('og:type', type, true);

    if (schema) {
      const id = 'dynamic-schema';
      let s = document.getElementById(id) as HTMLScriptElement | null;
      if (!s) { s = document.createElement('script'); s.id = id; s.type = 'application/ld+json'; document.head.appendChild(s); }
      s.textContent = JSON.stringify(schema);
    }
    return () => { document.getElementById('dynamic-schema')?.remove(); };
  }, [title, description, ogImage, canonical, type, schema]);

  return null;
}
