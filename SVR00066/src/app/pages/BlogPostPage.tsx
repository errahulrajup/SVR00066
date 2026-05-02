import { useParams, useNavigate } from 'react-router';
import { useBlogPost } from '../hooks';
import { SEO } from '../components/SEO';

export function BlogPostPage() {
  const { slug }  = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const { data: post, loading, error } = useBlogPost(slug!);
  const go = (p: string) => { navigate(p); window.scrollTo(0, 0); };

  if (loading) return (
    <div style={{ minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-main)',paddingTop:'var(--hdr-h)' }}>
      <div style={{ width:40,height:40,border:'2px solid var(--gold)',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error || !post) return (
    <div style={{ minHeight:'80vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20,background:'var(--bg-main)',paddingTop:'var(--hdr-h)',textAlign:'center',padding:'80px 24px' }}>
      <div style={{ fontSize:40 }}>📄</div>
      <h2 className="t-h2">Post Not Found</h2>
      <p className="t-body">This article doesn't exist or has been removed.</p>
      <button className="btn btn-gold btn-lg" onClick={()=>go('/blog')}>← Back to Blog</button>
    </div>
  );

  return (
    <>
      <SEO title={post.seo_title ?? `${post.title} — Srivriddhi Enterprise`}
        description={post.seo_desc ?? post.excerpt ?? undefined}
        ogImage={post.cover_image ?? undefined} type="article"
        schema={{"@context":"https://schema.org","@type":"Article","headline":post.title,"description":post.excerpt,"image":post.cover_image,"datePublished":post.created_at,"dateModified":post.updated_at,"author":{"@type":"Organization","name":"Srivriddhi Enterprise"}}} />
      <div style={{ background:'var(--bg-main)',paddingTop:'var(--hdr-h)' }}>
        {post.cover_image && (
          <div style={{ width:'100%',maxHeight:480,overflow:'hidden' }}>
            <img src={post.cover_image} alt={post.title} style={{ width:'100%',height:480,objectFit:'cover',display:'block' }} />
          </div>
        )}
        <article style={{ maxWidth:760,margin:'0 auto',padding:'64px var(--pad) 96px' }}>
          <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:36 }}>
            <button onClick={()=>go('/blog')} style={{ background:'none',border:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'rgba(255,255,255,0.3)',padding:0,transition:'color 0.2s' }}
              onMouseEnter={e=>(e.currentTarget.style.color='var(--gold)')}
              onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.3)')}>← Blog</button>
            <span style={{ color:'rgba(255,255,255,0.18)',fontSize:11 }}>/</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'rgba(255,255,255,0.45)' }}>{post.title}</span>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:20,flexWrap:'wrap' }}>
            <span className="badge badge-gold">{post.category}</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'rgba(255,255,255,0.3)' }}>
              {new Date(post.created_at).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}
            </span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif",fontSize:'clamp(28px,5vw,52px)',fontWeight:700,lineHeight:1.15,color:'#fff',marginBottom:20 }}>{post.title}</h1>
          {post.excerpt && (
            <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'clamp(1.1rem,2vw,1.45rem)',lineHeight:1.65,color:'rgba(255,255,255,0.55)',marginBottom:32,borderLeft:'3px solid var(--gold)',paddingLeft:20 }}>
              {post.excerpt}
            </p>
          )}
          <div style={{ width:40,height:2,background:'linear-gradient(90deg,var(--gold),transparent)',marginBottom:40 }} />
          <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:15,lineHeight:1.9,color:'rgba(255,255,255,0.65)',whiteSpace:'pre-wrap' }}>
            {post.content}
          </div>
          {(post.tags?.length??0)>0 && (
            <div style={{ display:'flex',flexWrap:'wrap',gap:8,marginTop:40,paddingTop:32,borderTop:'1px solid var(--border)' }}>
              {post.tags.map(tag=>(
                <span key={tag} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,color:'rgba(255,255,255,0.3)',padding:'3px 10px',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--radius-full)' }}>#{tag}</span>
              ))}
            </div>
          )}
          <div style={{ marginTop:48 }}>
            <button className="btn btn-ghost" onClick={()=>go('/blog')}>← Back to Blog</button>
          </div>
        </article>
      </div>
    </>
  );
}
