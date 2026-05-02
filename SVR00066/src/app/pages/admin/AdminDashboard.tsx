import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';

interface Stats { products: number; posts: number; inquiries: number; unread: number; }

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats,   setStats]   = useState<Stats>({ products:0, posts:0, inquiries:0, unread:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [p, b, i, u] = await Promise.all([
        supabase.from('products').select('*', { count:'exact', head:true }),
        supabase.from('blog_posts').select('*', { count:'exact', head:true }),
        supabase.from('inquiries').select('*', { count:'exact', head:true }),
        supabase.from('inquiries').select('*', { count:'exact', head:true }).eq('read', false),
      ]);
      setStats({ products: p.count??0, posts: b.count??0, inquiries: i.count??0, unread: u.count??0 });
      setLoading(false);
    };
    load();
  }, []);

  const CARDS = [
    { icon:'📦', label:'Total Products',    value: stats.products,  path:'/admin/products',  color:'var(--gold)' },
    { icon:'📝', label:'Blog Posts',         value: stats.posts,     path:'/admin/blog',      color:'#60A5FA' },
    { icon:'📬', label:'Total Inquiries',    value: stats.inquiries, path:'/admin/inquiries', color:'#4ADE80' },
    { icon:'🔔', label:'Unread Inquiries',   value: stats.unread,    path:'/admin/inquiries', color:'#F87171' },
  ];

  const QUICK = [
    { icon:'📦', label:'Add Product',      path:'/admin/products/new' },
    { icon:'📝', label:'Write Blog Post',  path:'/admin/blog/new' },
    { icon:'🏠', label:'Edit Homepage',    path:'/admin/homepage' },
    { icon:'⭐', label:'Testimonials',     path:'/admin/testimonials' },
    { icon:'🔍', label:'Manage SEO',       path:'/admin/seo' },
    { icon:'⚙️', label:'Site Settings',    path:'/admin/settings' },
  ];

  return (
    <div style={{ padding:'40px 32px' }}>
      <style>{`@media(max-width:768px){.adm-dash-content{padding:24px 20px!important;}}`}</style>
      <div style={{ marginBottom:32 }}>
        <p className="t-label" style={{ marginBottom:6 }}>Overview</p>
        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(24px,3vw,34px)', fontWeight:700, color:'#fff' }}>Dashboard</h1>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:40 }}>
        {CARDS.map(c => (
          <div key={c.label} onClick={() => navigate(c.path)}
            style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'24px 20px', cursor:'pointer', transition:'border-color 0.25s, transform 0.25s, box-shadow 0.25s' }}
            onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor='var(--border-gold)'; d.style.transform='translateY(-3px)'; d.style.boxShadow='0 8px 24px rgba(0,0,0,0.4)'; }}
            onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor='var(--border)'; d.style.transform='translateY(0)'; d.style.boxShadow='none'; }}>
            <div style={{ fontSize:28, marginBottom:12 }}>{c.icon}</div>
            {loading
              ? <div className="shimmer" style={{ height:36, borderRadius:6, marginBottom:8 }} />
              : <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:44, lineHeight:1, color:c.color, letterSpacing:'0.02em', marginBottom:6 }}>{c.value}</div>
            }
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.38)', fontWeight:600, letterSpacing:'0.04em' }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom:16 }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:16 }}>Quick Actions</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {QUICK.map(q => (
            <button key={q.label} onClick={() => navigate(q.path)}
              style={{ display:'flex', alignItems:'center', gap:12, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'16px 18px', cursor:'pointer', width:'100%', textAlign:'left', transition:'border-color 0.2s, background 0.2s, transform 0.2s' }}
              onMouseEnter={e => { const d = e.currentTarget as HTMLButtonElement; d.style.borderColor='var(--border-gold)'; d.style.background='var(--bg-card2)'; d.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { const d = e.currentTarget as HTMLButtonElement; d.style.borderColor='var(--border)'; d.style.background='var(--bg-card)'; d.style.transform='translateY(0)'; }}>
              <span style={{ fontSize:20 }}>{q.icon}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)' }}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ marginTop:40, padding:'20px 24px', background:'var(--gold-dim)', border:'1px solid var(--border-gold)', borderRadius:'var(--radius-md)' }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,193,7,0.7)', lineHeight:1.8 }}>
          <strong style={{ color:'var(--gold)' }}>ℹ️ Supabase Backend Connected.</strong> All data is stored in your Supabase project. Changes here reflect instantly on the live website. Images are stored in Supabase Storage buckets.
        </p>
      </div>
    </div>
  );
}
