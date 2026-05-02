import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useProduct, useProducts } from '../hooks';
import { SEO } from '../components/SEO';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, loading, error } = useProduct(slug!);
  const { data: all } = useProducts();
  const go = (p: string) => { navigate(p); window.scrollTo(0, 0); };

  const related = all?.filter(p => p.id !== product?.id && p.category === product?.category).slice(0, 3) ?? [];

  if (loading) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-main)', paddingTop:'var(--hdr-h)' }}>
      <div style={{ width:40, height:40, border:'2px solid var(--gold)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error || !product) return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, background:'var(--bg-main)', paddingTop:'var(--hdr-h)', textAlign:'center', padding:'80px 24px' }}>
      <div style={{ fontSize:40 }}>🔍</div>
      <h2 className="t-h2">Product Not Found</h2>
      <p className="t-body">This product doesn't exist or has been removed.</p>
      <button className="btn btn-gold btn-lg" onClick={() => go('/products')}>← Back to Products</button>
    </div>
  );

  return (
    <>
      <SEO title={product.seo_title ?? `${product.name} — Srivriddhi Enterprise`}
        description={product.seo_desc ?? product.short_desc ?? undefined}
        ogImage={product.og_image ?? product.images?.[0]}
        schema={{ "@context":"https://schema.org","@type":"Product","name":product.name,"description":product.description,"image":product.images,"brand":{"@type":"Brand","name":"Srivriddhi Enterprise"},"offers":{"@type":"Offer","availability":product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock","priceCurrency":"INR"} }} />
      <style>{`
        .pd-root { background:var(--bg-main); padding-top:var(--hdr-h); }
        .pd-crumb { background:#080808; border-bottom:1px solid rgba(255,193,7,0.08); padding:12px 0; }
        .pd-crumb-inner { max-width:var(--max-w); margin:0 auto; padding:0 var(--pad); display:flex; align-items:center; gap:8px; }
        .pd-crumb-btn { background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:12px; color:rgba(255,255,255,0.28); padding:0; transition:color 0.2s; }
        .pd-crumb-btn:hover { color:var(--gold); }
        .pd-main { display:grid; grid-template-columns:1fr 1fr; min-height:80vh; border-bottom:1px solid var(--border); }
        .pd-img-panel { position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 48px; background:var(--bg-second); gap:20px; }
        .pd-img { width:100%; max-width:380px; aspect-ratio:1/1; object-fit:contain; filter:drop-shadow(0 24px 48px rgba(0,0,0,0.7)); }
        .pd-thumbs { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
        .pd-thumb { width:56px; height:56px; object-fit:cover; border-radius:var(--radius-sm); border:1.5px solid var(--border); cursor:pointer; transition:border-color 0.2s; }
        .pd-thumb:hover, .pd-thumb.on { border-color:var(--gold); }
        .pd-info { padding:60px 48px; display:flex; flex-direction:column; justify-content:center; }
        @media (max-width:1024px) { .pd-main{grid-template-columns:1fr;} .pd-img-panel{padding:40px 32px;} .pd-info{padding:40px 32px;} }
        @media (max-width:768px) { .pd-img-panel{padding:32px 20px;} .pd-info{padding:32px 20px;} }
      `}</style>

      <div className="pd-root">
        {/* Crumb */}
        <div className="pd-crumb">
          <div className="pd-crumb-inner">
            <button className="pd-crumb-btn" onClick={() => go('/')}>Home</button>
            <span style={{ color:'rgba(255,255,255,0.18)', fontSize:11 }}>/</span>
            <button className="pd-crumb-btn" onClick={() => go('/products')}>Products</button>
            <span style={{ color:'rgba(255,255,255,0.18)', fontSize:11 }}>/</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.5)' }}>{product.name}</span>
          </div>
        </div>

        {/* Main */}
        <div className="pd-main">
          {/* Image panel */}
          <motion.div className="pd-img-panel" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6 }}>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', opacity:0.03, pointerEvents:'none' }}>
              <img src="/images/logo.png" alt="" aria-hidden style={{ width:'70%', height:'70%', objectFit:'contain', filter:'brightness(0) invert(1)' }} />
            </div>
            <motion.img src={product.images?.[0] ?? '/images/placeholder.webp'} alt={product.name}
              className="pd-img" whileHover={{ scale:1.04, translateY:-8 }} transition={{ duration:0.4 }} />
            {product.images?.length > 1 && (
              <div className="pd-thumbs">
                {product.images.map((img, i) => (
                  <img key={i} src={img} className={`pd-thumb${i===0?' on':''}`} alt={`${product.name} ${i+1}`} loading="lazy" />
                ))}
              </div>
            )}
          </motion.div>

          {/* Info panel */}
          <motion.div className="pd-info" initial={{ opacity:0, x:32 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6, delay:0.15 }}>
            <div style={{ marginBottom:18 }}>
              <span className="badge badge-gold">{product.category}</span>
              {!product.in_stock && <span className="badge badge-red" style={{ marginLeft:8 }}>Out of Stock</span>}
            </div>
            <h1 className="t-display" style={{ marginBottom:8 }}>{product.name}</h1>
            <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(1rem,1.5vw,1.3rem)', fontStyle:'italic', color:'rgba(255,255,255,0.45)', marginBottom:20, lineHeight:1.5 }}>
              {product.tagline}
            </p>
            <div style={{ width:48,height:2,background:'linear-gradient(90deg,var(--gold),transparent)',marginBottom:20 }} />
            <p className="t-body" style={{ marginBottom:24 }}>{product.description}</p>

            {/* Benefits */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:28 }}>
              {product.benefits?.map(b => (
                <span key={b} className="badge badge-muted" style={{ padding:'5px 12px' }}>
                  <span style={{ width:4,height:4,borderRadius:'50%',background:'var(--gold)',display:'inline-block',marginRight:4 }} />{b}
                </span>
              ))}
            </div>

            {/* Usage */}
            {(product.usage_home || product.usage_pro) && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:28 }}>
                {product.usage_home && (
                  <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'16px 18px', transition:'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor='var(--border-gold)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor='var(--border)')}>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,193,7,0.6)', marginBottom:6 }}>Home Use</p>
                    <p className="t-sm">{product.usage_home}</p>
                  </div>
                )}
                {product.usage_pro && (
                  <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'16px 18px', transition:'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor='var(--border-gold)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor='var(--border)')}>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,193,7,0.6)', marginBottom:6 }}>Professional</p>
                    <p className="t-sm">{product.usage_pro}</p>
                  </div>
                )}
              </div>
            )}

            {product.pack_sizes && (
              <p className="t-sm" style={{ marginBottom:28, color:'rgba(255,255,255,0.35)' }}>
                Available in: <span style={{ color:'rgba(255,255,255,0.6)' }}>{product.pack_sizes}</span>
              </p>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:32 }}>
                {product.tags.map(tag => (
                  <span key={tag} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'rgba(255,255,255,0.25)', padding:'2px 8px', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'var(--radius-full)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <button className="btn btn-gold btn-lg" onClick={() => go('/contact')}>Request Sample →</button>
              <button className="btn btn-ghost" onClick={() => go('/products')}>← All Products</button>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="sec sec-alt">
            <div className="wrap">
              <p className="t-label" style={{ marginBottom:10 }}>Related</p>
              <h2 className="t-h2" style={{ marginBottom:0 }}>You May Also Like</h2>
              <div style={{ width:40,height:2,background:'linear-gradient(90deg,var(--gold),transparent)',margin:'12px 0 32px' }} />
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
                {related.map(r => (
                  <article key={r.id} className="prod-card" onClick={() => go(`/products/${r.slug}`)} style={{ cursor:'pointer' }}>
                    <div style={{ overflow:'hidden' }}>
                      <img src={r.images?.[0]} alt={r.name} loading="lazy" className="prod-card__img" />
                    </div>
                    <div className="prod-card__body">
                      <h3 className="t-h3" style={{ marginBottom:8 }}>{r.name}</h3>
                      <p className="t-sm">{r.tagline}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
