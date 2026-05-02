import { useState, useEffect, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { blogApi, inquiriesApi, homepageApi, aboutApi, testimonialsApi, settingsApi, seoApi, type BlogPost, type Testimonial } from '../../lib/supabase';
import { useBlogPosts, useInquiries, useHomepageSections, useAboutContent, useTestimonials } from '../../hooks';
import { ImageUpload } from '../../components/ImageUpload';

// ── AdminBlog ─────────────────────────────────────────────────────────────────
export function AdminBlog() {
  const navigate = useNavigate();
  const { data: posts, loading, reload } = useBlogPosts(true);
  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await blogApi.remove(id); reload();
  };
  const toggle = async (id: string, published: boolean) => {
    await blogApi.update(id, { published }); reload();
  };
  return (
    <div style={{ padding:'40px 32px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:14 }}>
        <div>
          <p className="t-label" style={{ marginBottom:6 }}>Content</p>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:700, color:'#fff' }}>Blog Posts</h1>
        </div>
        <button className="btn btn-gold" onClick={() => navigate('/admin/blog/new')}>+ New Post</button>
      </div>
      {loading ? [1,2,3].map(i => <div key={i} className="shimmer" style={{ height:64, borderRadius:'var(--radius-md)', marginBottom:8 }} />) : !posts?.length ? (
        <div style={{ textAlign:'center', padding:'64px 24px', background:'var(--bg-card)', border:'1px dashed rgba(255,255,255,0.08)', borderRadius:'var(--radius-xl)' }}>
          <div style={{ fontSize:40, marginBottom:14 }}>✍️</div>
          <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:20, color:'#fff', marginBottom:8 }}>No posts yet</p>
          <button className="btn btn-gold" onClick={() => navigate('/admin/blog/new')}>+ Write First Post</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {posts.map(p => (
            <div key={p.id} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:16, alignItems:'center', padding:'16px 20px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', transition:'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor='var(--border-gold)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor='var(--border)')}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:15, fontWeight:700, color:'#fff' }}>{p.title}</span>
                  <span className={`badge ${p.published ? 'badge-green' : 'badge-muted'}`}>{p.published ? 'Published' : 'Draft'}</span>
                  <span className="badge badge-gold">{p.category}</span>
                </div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,0.28)' }}>{new Date(p.created_at).toLocaleDateString('en-IN')}</p>
              </div>
              <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                <button className={`btn ${p.published ? 'btn-ghost' : 'btn-success'} btn-sm`} onClick={() => toggle(p.id, !p.published)}>
                  {p.published ? 'Unpublish' : 'Publish'}
                </button>
                <button className="btn btn-dark btn-sm" onClick={() => navigate(`/admin/blog/${p.id}`)}>Edit</button>
                <button className="btn-danger" onClick={() => remove(p.id, p.title)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AdminBlogForm ─────────────────────────────────────────────────────────────
export function AdminBlogForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const [form, setForm] = useState<Omit<BlogPost,'id'|'created_at'|'updated_at'>>({
    title:'', slug:'', excerpt:'', content:'', cover_image:'', category:'General',
    tags:[], published:false, seo_title:'', seo_desc:'',
  });
  const [tagsStr, setTagsStr] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!isEdit) return;
    blogApi.byId(id).then(({ data }) => {
      if (!data) return;
      const { id:_, created_at, updated_at, ...rest } = data;
      setForm(rest); setTagsStr((rest.tags??[]).join(', '));
    });
  }, [id, isEdit]);

  const upd = (k: string) => (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const titleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setForm(f => ({ ...f, title:v, slug: isEdit ? f.slug : v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''), seo_title: isEdit ? f.seo_title : `${v} — Srivriddhi Enterprise` }));
  };

  const save = async () => {
    if (!form.title.trim()) return setError('Title required.');
    if (!form.slug.trim())  return setError('Slug required.');
    setSaving(true); setError('');
    const payload = { ...form, tags: tagsStr.split(',').map(s=>s.trim()).filter(Boolean) };
    const { error: err } = isEdit ? await blogApi.update(id!, payload) : await blogApi.create(payload);
    setSaving(false);
    if (err) setError((err as Error).message);
    else navigate('/admin/blog');
  };

  return (
    <div style={{ padding:'40px 32px', maxWidth:860 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div>
          <p className="t-label" style={{ marginBottom:6 }}>{isEdit ? 'Edit Post' : 'New Post'}</p>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(20px,3vw,28px)', fontWeight:700, color:'#fff' }}>{isEdit ? (form.title || 'Edit Post') : 'Write New Post'}</h1>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/blog')}>Cancel</button>
          <button className="btn btn-gold" onClick={save} disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save' : 'Create'}</button>
        </div>
      </div>
      {error && <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:'var(--radius-sm)', padding:'10px 14px', marginBottom:16 }}><p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#F87171' }}>{error}</p></div>}
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:32, display:'grid', gap:18 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div><label className="field-label">Title *</label><input className="field" placeholder="Post title" value={form.title} onChange={titleChange} /></div>
          <div><label className="field-label">Slug *</label><input className="field" placeholder="post-url-slug" value={form.slug} onChange={upd('slug')} /></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div><label className="field-label">Category</label><input className="field" placeholder="General, HoReCa, Recipes…" value={form.category} onChange={upd('category')} /></div>
          <div><label className="field-label">Tags (comma-separated)</label><input className="field" placeholder="vegan, plant-based, butter" value={tagsStr} onChange={e => setTagsStr(e.target.value)} /></div>
        </div>
        <div><label className="field-label">Excerpt / Summary</label><textarea className="field" rows={3} placeholder="Brief summary shown in listing cards…" value={form.excerpt??''} onChange={upd('excerpt')} style={{ resize:'vertical' }} /></div>
        <div><label className="field-label">Full Content</label><textarea className="field" rows={12} placeholder="Full article content. Markdown-like formatting supported (plain text for now)…" value={form.content??''} onChange={upd('content')} style={{ resize:'vertical', fontFamily:'monospace', lineHeight:1.7 }} /></div>
        <ImageUpload bucket="blog-images" label="Cover Image" current={form.cover_image??''} onUploaded={url => setForm(f => ({ ...f, cover_image: url }))} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div><label className="field-label">SEO Title</label><input className="field" placeholder="SEO title…" value={form.seo_title??''} onChange={upd('seo_title')} /></div>
          <div><label className="field-label">SEO Description</label><input className="field" placeholder="Meta description…" value={form.seo_desc??''} onChange={upd('seo_desc')} /></div>
        </div>
        <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
          <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} style={{ accentColor:'var(--gold)', width:16, height:16 }} />
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:500 }}>Published (visible on site)</span>
        </label>
      </div>
    </div>
  );
}

// ── AdminInquiries ────────────────────────────────────────────────────────────
export function AdminInquiries() {
  const { data: inquiries, loading, reload } = useInquiries();
  const [filter, setFilter] = useState<'all'|'unread'|'unreplied'>('all');
  const [selected, setSelected] = useState<string|null>(null);

  const visible = (inquiries ?? []).filter(i =>
    filter === 'unread'   ? !i.read :
    filter === 'unreplied'? !i.replied : true
  );

  const sel = inquiries?.find(i => i.id === selected);

  const markRead    = async (id: string) => { await inquiriesApi.markRead(id);    reload(); };
  const markReplied = async (id: string) => { await inquiriesApi.markReplied(id); reload(); };
  const remove      = async (id: string) => { if (!confirm('Delete inquiry?')) return; await inquiriesApi.remove(id); setSelected(null); reload(); };

  return (
    <div style={{ padding:'40px 32px' }}>
      <div style={{ marginBottom:28 }}>
        <p className="t-label" style={{ marginBottom:6 }}>Operations</p>
        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:700, color:'#fff' }}>
          Inquiries <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.6em', fontFamily:"'DM Sans',sans-serif", fontWeight:400 }}>({visible.length})</span>
        </h1>
      </div>
      <div style={{ display:'flex', gap:4, marginBottom:20, borderBottom:'1px solid var(--border)', paddingBottom:0 }}>
        {[['all','All'],['unread','Unread'],['unreplied','Unreplied']].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k as 'all'|'unread'|'unreplied')}
            style={{ background:'none', border:'none', cursor:'pointer', padding:'8px 16px', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color: filter===k ? 'var(--gold)' : 'rgba(255,255,255,0.3)', borderBottom: filter===k ? '2px solid var(--gold)' : '2px solid transparent', transition:'color 0.2s', marginBottom:-1 }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns: sel ? '1fr 1fr' : '1fr', gap:20 }}>
        {/* List */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {loading ? [1,2,3].map(i => <div key={i} className="shimmer" style={{ height:72, borderRadius:'var(--radius-md)' }} />) :
           !visible.length ? (
            <div style={{ textAlign:'center', padding:'48px 24px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)' }}>
              <div style={{ fontSize:36, marginBottom:12 }}>📬</div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'rgba(255,255,255,0.4)' }}>No inquiries to show</p>
            </div>
           ) : visible.map(i => (
            <div key={i.id} onClick={() => { setSelected(i.id); if (!i.read) markRead(i.id); }}
              style={{ padding:'16px 18px', background: selected===i.id ? 'var(--bg-card2)' : 'var(--bg-card)', border:`1px solid ${selected===i.id ? 'var(--border-gold)' : 'var(--border)'}`, borderRadius:'var(--radius-md)', cursor:'pointer', transition:'border-color 0.2s, background 0.2s', position:'relative' }}>
              {!i.read && <span style={{ position:'absolute', top:16, right:16, width:8, height:8, borderRadius:'50%', background:'var(--gold)', boxShadow:'0 0 8px rgba(255,193,7,0.5)' }} />}
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:14, fontWeight:700, color:'#fff' }}>{i.name}</span>
                {i.replied && <span className="badge badge-green">Replied</span>}
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:4 }}>{i.email} {i.phone ? `· ${i.phone}` : ''}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.5)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{i.subject ?? 'No subject'}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:4 }}>{new Date(i.created_at).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
        {/* Detail */}
        {sel && (
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-gold)', borderRadius:'var(--radius-xl)', padding:28, position:'sticky', top:20, alignSelf:'flex-start' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:8 }}>
              <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:18, fontWeight:700, color:'#fff' }}>{sel.name}</h3>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', fontSize:18 }}>✕</button>
            </div>
            <div style={{ display:'grid', gap:8, marginBottom:20 }}>
              {[['Email',   sel.email], ['Phone',   sel.phone??'—'], ['Subject', sel.subject??'—'],
                ['Date',    new Date(sel.created_at).toLocaleString('en-IN')]].map(([l,v]) => (
                <div key={l} style={{ display:'flex', gap:12 }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.28)', minWidth:60, letterSpacing:'0.06em', textTransform:'uppercase' }}>{l}</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,0.65)' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'var(--bg-second)', borderRadius:'var(--radius-md)', padding:'16px', marginBottom:20 }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.75 }}>{sel.message}</p>
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <a href={`mailto:${sel.email}?subject=Re: ${sel.subject??'Your Inquiry'}`} className="btn btn-gold btn-sm">Reply via Email</a>
              {!sel.replied && <button className="btn-success" onClick={() => markReplied(sel.id)}>Mark Replied</button>}
              {!sel.read    && <button className="btn btn-dark btn-sm" onClick={() => markRead(sel.id)}>Mark Read</button>}
              <button className="btn-danger" onClick={() => remove(sel.id)}>Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── AdminHomepage ─────────────────────────────────────────────────────────────
export function AdminHomepage() {
  const { data: sections, loading, reload } = useHomepageSections(true);
  const [saving, setSaving] = useState<string|null>(null);
  const [local, setLocal]   = useState<Record<string, { title:string; subtitle:string; body:string; cta_label:string; cta_link:string; visible:boolean }>>({});

  useEffect(() => {
    if (!sections) return;
    const m: typeof local = {};
    sections.forEach(s => { m[s.id] = { title:s.title??'', subtitle:s.subtitle??'', body:s.body??'', cta_label:s.cta_label??'', cta_link:s.cta_link??'', visible:s.visible }; });
    setLocal(m);
  }, [sections]);

  const save = async (id: string) => {
    setSaving(id);
    await homepageApi.update(id, local[id]);
    setSaving(null); reload();
  };

  return (
    <div style={{ padding:'40px 32px', maxWidth:760 }}>
      <p className="t-label" style={{ marginBottom:6 }}>Content</p>
      <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:700, color:'#fff', marginBottom:28 }}>Homepage Sections</h1>
      {loading ? [1,2,3].map(i => <div key={i} className="shimmer" style={{ height:200, borderRadius:'var(--radius-xl)', marginBottom:16 }} />) :
       sections?.map(s => {
         const loc = local[s.id];
         if (!loc) return null;
         const upd = (k: string) => (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
           setLocal(l => ({ ...l, [s.id]: { ...l[s.id], [k]: e.target.value } }));
         return (
           <div key={s.id} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:28, marginBottom:16 }}>
             <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
               <div>
                 <span className="badge badge-gold" style={{ marginBottom:6 }}>{s.key}</span>
                 <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:700, color:'#fff' }}>{s.key === 'hero' ? 'Hero Section' : s.key === 'about_teaser' ? 'About Teaser' : 'CTA Band'}</h3>
               </div>
               <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                 <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
                   <input type="checkbox" checked={loc.visible} onChange={e => setLocal(l => ({ ...l, [s.id]: { ...l[s.id], visible: e.target.checked } }))} style={{ accentColor:'var(--gold)', width:14, height:14 }} />
                   <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.5)' }}>Visible</span>
                 </label>
                 <button className="btn btn-gold btn-sm" onClick={() => save(s.id)} disabled={saving===s.id}>{saving===s.id ? 'Saving…' : 'Save'}</button>
               </div>
             </div>
             <div style={{ display:'grid', gap:12 }}>
               <div><label className="field-label">Title / Headline</label><textarea className="field" rows={2} value={loc.title} onChange={upd('title')} style={{ resize:'vertical' }} /></div>
               <div><label className="field-label">Subtitle</label><textarea className="field" rows={2} value={loc.subtitle} onChange={upd('subtitle')} style={{ resize:'vertical' }} /></div>
               <div><label className="field-label">Body Text</label><textarea className="field" rows={3} value={loc.body} onChange={upd('body')} style={{ resize:'vertical' }} /></div>
               <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                 <div><label className="field-label">CTA Button Label</label><input className="field" value={loc.cta_label} onChange={upd('cta_label')} /></div>
                 <div><label className="field-label">CTA Link</label><input className="field" placeholder="/contact" value={loc.cta_link} onChange={upd('cta_link')} /></div>
               </div>
             </div>
           </div>
         );
       })}
    </div>
  );
}

// ── AdminAbout ────────────────────────────────────────────────────────────────
export function AdminAbout() {
  const { content, loading, reload } = useAboutContent();
  const [local, setLocal]   = useState<Record<string, { title:string; body:string }>>({});
  const [saving, setSaving] = useState<string|null>(null);

  useEffect(() => {
    if (!content) return;
    const m: typeof local = {};
    Object.entries(content).forEach(([k,v]) => { m[k] = { title: v.title, body: v.body }; });
    setLocal(m);
  }, [content]);

  const save = async (key: string) => {
    setSaving(key);
    await aboutApi.update(key, local[key]);
    setSaving(null); reload();
  };

  const KEYS_LABELS: Record<string, string> = { mission:'Mission Statement', vision:'Vision', story:'Our Story', founded:'Founded Year', location:'Location', team_desc:'Team Description' };

  return (
    <div style={{ padding:'40px 32px', maxWidth:760 }}>
      <p className="t-label" style={{ marginBottom:6 }}>Content</p>
      <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:700, color:'#fff', marginBottom:28 }}>About Page Content</h1>
      {loading ? [1,2,3].map(i => <div key={i} className="shimmer" style={{ height:140, borderRadius:'var(--radius-xl)', marginBottom:14 }} />) :
       Object.keys(local).map(key => {
         const loc = local[key];
         return (
           <div key={key} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:24, marginBottom:14 }}>
             <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:8 }}>
               <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:700, color:'#fff' }}>{KEYS_LABELS[key] ?? key}</h3>
               <button className="btn btn-gold btn-sm" onClick={() => save(key)} disabled={saving===key}>{saving===key?'Saving…':'Save'}</button>
             </div>
             <div style={{ display:'grid', gap:10 }}>
               <div><label className="field-label">Title</label><input className="field" value={loc.title} onChange={e => setLocal(l => ({ ...l, [key]: { ...l[key], title: e.target.value } }))} /></div>
               <div><label className="field-label">Body / Content</label><textarea className="field" rows={3} value={loc.body} onChange={e => setLocal(l => ({ ...l, [key]: { ...l[key], body: e.target.value } }))} style={{ resize:'vertical' }} /></div>
             </div>
           </div>
         );
       })}
    </div>
  );
}

// ── AdminTestimonials ─────────────────────────────────────────────────────────
export function AdminTestimonials() {
  const { data: testimonials, loading, reload } = useTestimonials(true);
  const [adding, setAdding]   = useState(false);
  const [editing, setEditing] = useState<Testimonial|null>(null);
  const [saving,  setSaving]  = useState(false);
  const EMPTY = { name:'', role:'', company:'', quote:'', rating:5, visible:true, sort_order:0, avatar_url:'' };
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);

  const startEdit = (t: Testimonial) => { setEditing(t); setForm({ name:t.name, role:t.role??'', company:t.company??'', quote:t.quote, rating:t.rating, visible:t.visible, sort_order:t.sort_order, avatar_url:t.avatar_url??'' }); setAdding(false); };
  const startAdd  = () => { setAdding(true); setEditing(null); setForm(EMPTY); };
  const upd = (k: string) => (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.name.trim() || !form.quote.trim()) return alert('Name and quote required.');
    setSaving(true);
    if (editing) await testimonialsApi.update(editing.id, form);
    else         await testimonialsApi.create({ ...form, created_at: new Date().toISOString() } as Omit<Testimonial,'id'|'created_at'> & { created_at: string });
    setSaving(false); setAdding(false); setEditing(null); reload();
  };
  const remove = async (id: string) => { if (!confirm('Delete?')) return; await testimonialsApi.remove(id); reload(); };
  const toggle = async (id: string, visible: boolean) => { await testimonialsApi.update(id, { visible }); reload(); };

  return (
    <div style={{ padding:'40px 32px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:14 }}>
        <div><p className="t-label" style={{ marginBottom:6 }}>Content</p><h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:700, color:'#fff' }}>Testimonials</h1></div>
        {!adding && !editing && <button className="btn btn-gold" onClick={startAdd}>+ Add Testimonial</button>}
      </div>
      {/* Form */}
      {(adding || editing) && (
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-gold)', borderRadius:'var(--radius-xl)', padding:28, marginBottom:20 }}>
          <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:18, fontWeight:700, color:'#fff', marginBottom:20 }}>{editing ? 'Edit' : 'Add'} Testimonial</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            <div><label className="field-label">Name *</label><input className="field" value={form.name} onChange={upd('name')} /></div>
            <div><label className="field-label">Role / Title</label><input className="field" placeholder="Executive Chef" value={form.role} onChange={upd('role')} /></div>
          </div>
          <div style={{ marginBottom:14 }}><label className="field-label">Company</label><input className="field" placeholder="The Leela Hotels" value={form.company} onChange={upd('company')} /></div>
          <div style={{ marginBottom:20 }}><label className="field-label">Quote *</label><textarea className="field" rows={4} value={form.quote} onChange={upd('quote')} style={{ resize:'vertical' }} /></div>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            <button className="btn btn-gold" onClick={save} disabled={saving}>{saving?'Saving…':editing?'Save Changes':'Add Testimonial'}</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setAdding(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      )}
      {/* List */}
      {loading ? [1,2,3].map(i => <div key={i} className="shimmer" style={{ height:80, borderRadius:'var(--radius-md)', marginBottom:8 }} />) :
       (testimonials??[]).map(t => (
        <div key={t.id} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:14, alignItems:'center', padding:'16px 20px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', marginBottom:8, transition:'border-color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor='var(--border-gold)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor='var(--border)')}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
              <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:14, fontWeight:700, color:'#fff' }}>{t.name}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.3)' }}>{t.role}{t.company ? `, ${t.company}` : ''}</span>
              {!t.visible && <span className="badge badge-muted">Hidden</span>}
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:13, fontStyle:'italic', color:'rgba(255,255,255,0.45)', display:'-webkit-box', WebkitLineClamp:1, WebkitBoxOrient:'vertical', overflow:'hidden' }}>"{t.quote}"</p>
          </div>
          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
            <button className="btn btn-dark btn-sm" onClick={() => startEdit(t)}>Edit</button>
            <button className={`btn ${t.visible?'btn-ghost':'btn-success'} btn-sm`} onClick={() => toggle(t.id, !t.visible)}>{t.visible?'Hide':'Show'}</button>
            <button className="btn-danger" onClick={() => remove(t.id)}>Delete</button>
          </div>
        </div>
       ))}
    </div>
  );
}

// ── AdminSEO ──────────────────────────────────────────────────────────────────
export function AdminSEO() {
  const [pages, setPages]   = useState<Array<{ page:string; title:string; description:string; og_image:string }>>([]);
  const [saving, setSaving] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seoApi.getAll().then(({ data }) => {
      setPages((data??[]).map(p => ({ page:p.page, title:p.title??'', description:p.description??'', og_image:p.og_image??'' })));
      setLoading(false);
    });
  }, []);

  const upd = (page: string, k: string, v: string) =>
    setPages(ps => ps.map(p => p.page===page ? { ...p, [k]:v } : p));
  const save = async (page: string) => {
    setSaving(page);
    const pg = pages.find(p => p.page===page);
    if (pg) await seoApi.update(page, { title:pg.title, description:pg.description, og_image:pg.og_image });
    setSaving(null);
  };
  const PAGE_LABELS: Record<string,string> = { home:'Home Page', products:'Products Page', about:'About Page', contact:'Contact Page', blog:'Blog / Insights' };

  return (
    <div style={{ padding:'40px 32px', maxWidth:760 }}>
      <p className="t-label" style={{ marginBottom:6 }}>Configuration</p>
      <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:700, color:'#fff', marginBottom:8 }}>SEO Settings</h1>
      <p className="t-sm" style={{ marginBottom:28 }}>Manage meta titles, descriptions, and OG images for each page. Changes reflect immediately on the live site.</p>
      {loading ? [1,2,3,4,5].map(i => <div key={i} className="shimmer" style={{ height:160, borderRadius:'var(--radius-xl)', marginBottom:14 }} />) :
       pages.map(pg => (
        <div key={pg.page} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:24, marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:8 }}>
            <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:700, color:'#fff' }}>{PAGE_LABELS[pg.page] ?? pg.page}</h3>
            <button className="btn btn-gold btn-sm" onClick={() => save(pg.page)} disabled={saving===pg.page}>{saving===pg.page?'Saving…':'Save'}</button>
          </div>
          <div style={{ display:'grid', gap:12 }}>
            <div>
              <label className="field-label">Title <span style={{ color:'rgba(255,255,255,0.2)', letterSpacing:0, textTransform:'none', fontWeight:400 }}>({pg.title.length}/60)</span></label>
              <input className="field" value={pg.title} onChange={e => upd(pg.page,'title',e.target.value)} placeholder="Page title for search engines" />
            </div>
            <div>
              <label className="field-label">Description <span style={{ color:'rgba(255,255,255,0.2)', letterSpacing:0, textTransform:'none', fontWeight:400 }}>({pg.description.length}/160)</span></label>
              <textarea className="field" rows={2} value={pg.description} onChange={e => upd(pg.page,'description',e.target.value)} placeholder="Meta description for search results" style={{ resize:'vertical' }} />
            </div>
            <div><label className="field-label">OG Image URL</label><input className="field" value={pg.og_image} onChange={e => upd(pg.page,'og_image',e.target.value)} placeholder="/images/og-image.webp" /></div>
          </div>
        </div>
       ))}
    </div>
  );
}

// ── AdminSettings ─────────────────────────────────────────────────────────────
export function AdminSettings() {
  const [settings, setSettings] = useState<Record<string,{ label:string; value:string; group:string }>>({});
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    settingsApi.getAll().then(({ data }) => {
      const m: typeof settings = {};
      (data??[]).forEach(s => { m[s.key] = { label:s.label??s.key, value:s.value??'', group:s.group_name }; });
      setSettings(m);
      setLoading(false);
    });
  }, []);

  const saveAll = async () => {
    setSaving(true);
    await Promise.all(Object.entries(settings).map(([k, v]) => settingsApi.set(k, v.value)));
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const groups = Array.from(new Set(Object.values(settings).map(s => s.group)));
  const GROUP_LABELS: Record<string,string> = { general:'General', contact:'Contact Info', branding:'Branding', hero:'Hero Section', seo:'SEO Defaults', analytics:'Analytics' };

  return (
    <div style={{ padding:'40px 32px', maxWidth:760 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:14 }}>
        <div>
          <p className="t-label" style={{ marginBottom:6 }}>Configuration</p>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:700, color:'#fff' }}>Site Settings</h1>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {saved && <span className="badge badge-green" style={{ padding:'6px 14px' }}>✓ Saved</span>}
          <button className="btn btn-gold btn-lg" onClick={saveAll} disabled={saving}>{saving?'Saving…':'Save All Changes'}</button>
        </div>
      </div>
      {loading ? [1,2,3].map(i => <div key={i} className="shimmer" style={{ height:180, borderRadius:'var(--radius-xl)', marginBottom:14 }} />) :
       groups.map(group => {
         const keys = Object.entries(settings).filter(([,v]) => v.group===group);
         if (!keys.length) return null;
         return (
           <div key={group} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:28, marginBottom:14 }}>
             <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:700, color:'#fff', marginBottom:20 }}>{GROUP_LABELS[group]??group}</h3>
             <div style={{ display:'grid', gap:14 }}>
               {keys.map(([k, s]) => (
                 <div key={k}>
                   <label className="field-label">{s.label}</label>
                   <input className="field" value={s.value} onChange={e => setSettings(prev => ({ ...prev, [k]: { ...prev[k], value:e.target.value } }))} placeholder={s.label} />
                 </div>
               ))}
             </div>
           </div>
         );
       })}
    </div>
  );
}
