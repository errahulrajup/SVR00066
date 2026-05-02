// ── AboutPage ────────────────────────────────────────────────────────────────
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useAboutContent, usePageSeo } from '../hooks';
import { SEO } from '../components/SEO';

const FI = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const FC = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

export function AboutPage() {
  const navigate = useNavigate();
  const { content, loading } = useAboutContent();
  const { data: seo } = usePageSeo('about');
  const go = (p: string) => { navigate(p); window.scrollTo(0, 0); };

  const PILLARS = [
    { h: 'Built for Scale',    p: 'Distribution is the strategy, not the afterthought.' },
    { h: 'B2B & HoReCa Ready', p: 'Bulk supply, trade terms, kitchen-grade formats.' },
    { h: '100% Plant-Based',   p: 'No dairy. No compromise on taste or texture.' },
    { h: 'India-Focused',      p: 'Familiar formats, better execution, local roots.' },
  ];

  const VALUES = [
    { icon: '🏆', h: 'Taste Wins First',           p: 'If it doesn\'t taste better, it doesn\'t matter. Taste is the only entry point to repeat demand.' },
    { icon: '🇮🇳', h: 'Built for Indian Kitchens', p: 'Familiar formats. Better execution. Designed around the way India actually cooks and eats.' },
    { icon: '📈', h: 'Scale Matters',              p: 'Distribution is the strategy. A great product without reach is a missed opportunity.' },
  ];

  return (
    <>
      <SEO title={seo?.title ?? 'About — Srivriddhi Enterprise'} description={seo?.description ?? undefined} />
      <style>{`
        .ab-hero { position:relative; width:100%; height:100vh; min-height:580px; overflow:hidden; display:flex; align-items:flex-end; }
        .ab-bg { position:absolute; inset:0; background-image:url('/images/about.webp'); background-size:cover; background-position:center 20%; }
        .ab-grad { position:absolute; inset:0; background:linear-gradient(to top, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.60) 38%, rgba(5,5,5,0.20) 65%, rgba(5,5,5,0.05) 100%); }
        .ab-content { position:relative; z-index:2; width:100%; max-width:var(--max-w); margin:0 auto; padding:0 var(--pad) 88px; }
        .ab-pillars { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-top:36px; }
        .ab-values { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-top:36px; }
        .ab-timeline { display:flex; flex-direction:column; gap:0; margin-top:36px; }
        .ab-tl-row { display:grid; grid-template-columns:120px 1fr; gap:28px; padding:24px 0; border-bottom:1px solid var(--border); }
        @media (max-width:768px) { .ab-hero{height:100dvh;min-height:520px;} .ab-content{padding:0 var(--pad) 60px;} .ab-pillars{grid-template-columns:1fr 1fr;} .ab-values{grid-template-columns:1fr;} .ab-tl-row{grid-template-columns:80px 1fr; gap:16px;} }
        @media (max-width:480px) { .ab-pillars{grid-template-columns:1fr;} }
      `}</style>

      <div style={{ background: 'var(--bg-main)' }}>
        {/* Hero */}
        <section className="ab-hero">
          <div className="ab-bg" /><div className="ab-grad" />
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:200, background:'linear-gradient(to top,rgba(255,193,7,0.06),transparent)', pointerEvents:'none', zIndex:1 }} />
          <div className="ab-content">
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} className="t-label" style={{ marginBottom:18 }}>Our Story</motion.p>
            <motion.h1 initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}
              style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'var(--t-hero)', lineHeight:0.88, letterSpacing:'0.03em', color:'#fff' }}>
              SRIVRIDDHI<br /><span style={{ color:'var(--gold)', textShadow:'0 0 48px rgba(255,193,7,0.4)' }}>ENTERPRISE.</span>
            </motion.h1>
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.2 }}
              style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(1.05rem,1.6vw,1.45rem)', lineHeight:1.6, color:'rgba(255,255,255,0.62)', maxWidth:520, marginTop:18 }}>
              {loading ? 'A premium Indian plant-based food brand.' : (content.mission?.body ?? 'A premium Indian plant-based food brand built around appetite, quality, and ambition.')}
            </motion.p>
          </div>
        </section>

        {/* Mission */}
        <section className="sec sec-alt" style={{ borderBottom:'1px solid var(--border)' }}>
          <div className="wrap" style={{ maxWidth:720, margin:'0 auto', textAlign:'center' }}>
            <p className="t-label" style={{ marginBottom:14 }}>Our Mission</p>
            <h2 className="t-display" style={{ marginBottom:24 }}>Plant-Based. Premium. <span style={{ color:'var(--gold)' }}>Purposeful.</span></h2>
            <p className="t-lead" style={{ marginBottom:16 }}>{content.mission?.body ?? 'Srivriddhi Enterprise was founded with a single conviction: that plant-based food in India deserves to be built with the same rigor, quality, and ambition as the world\'s best food brands.'}</p>
            <p className="t-body" style={{ color:'rgba(255,255,255,0.35)' }}>{content.story?.body ?? 'We don\'t make compromises for plants. We build better products — and we prove it every time a chef, retailer, or customer chooses us again.'}</p>
          </div>
        </section>

        {/* Pillars */}
        <section className="sec" style={{ borderBottom:'1px solid var(--border)' }}>
          <div className="wrap">
            <p className="t-label" style={{ marginBottom:10 }}>What We Stand For</p>
            <h2 className="t-h2">Our Four Pillars</h2>
            <div style={{ width:40,height:2,background:'linear-gradient(90deg,var(--gold),transparent)',margin:'12px 0' }} />
            <motion.div className="ab-pillars" initial="hidden" whileInView="show" viewport={{ once:true }} variants={FC}>
              {PILLARS.map(p => (
                <motion.div key={p.h} variants={FI} transition={{ duration:0.45 }}
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'24px 20px', transition:'border-color 0.25s, box-shadow 0.25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor='var(--border-gold)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 0 20px rgba(255,193,7,0.07)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor='var(--border)'; (e.currentTarget as HTMLDivElement).style.boxShadow='none'; }}>
                  <div style={{ width:8,height:8,borderRadius:'50%',background:'var(--gold)',marginBottom:14,boxShadow:'0 0 8px rgba(255,193,7,0.5)' }} />
                  <h3 className="t-h3" style={{ marginBottom:8 }}>{p.h}</h3>
                  <p className="t-sm">{p.p}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="sec sec-alt" style={{ borderBottom:'1px solid var(--border)' }}>
          <div className="wrap">
            <p className="t-label" style={{ marginBottom:10 }}>Our Values</p>
            <h2 className="t-h2">How We Think.</h2>
            <div style={{ width:40,height:2,background:'linear-gradient(90deg,var(--gold),transparent)',margin:'12px 0' }} />
            <motion.div className="ab-values" initial="hidden" whileInView="show" viewport={{ once:true }} variants={FC}>
              {VALUES.map(v => (
                <motion.div key={v.h} variants={FI} transition={{ duration:0.45 }}
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'32px 24px', textAlign:'center', transition:'border-color 0.28s, transform 0.28s, box-shadow 0.28s', position:'relative', overflow:'hidden' }}
                  onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform='translateY(-6px)'; d.style.borderColor='var(--border-gold)'; d.style.boxShadow='var(--shadow-glow)'; }}
                  onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform='translateY(0)'; d.style.borderColor='var(--border)'; d.style.boxShadow='none'; }}>
                  <div style={{ width:64,height:64,borderRadius:'50%',background:'var(--gold-soft)',border:'1.5px solid var(--border-gold)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',fontSize:26,transition:'box-shadow 0.3s' }}>
                    {v.icon}
                  </div>
                  <h3 className="t-h3" style={{ marginBottom:10 }}>{v.h}</h3>
                  <p className="t-sm">{v.p}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="sec" style={{ textAlign:'center' }}>
          <div className="wrap">
            <p className="t-label" style={{ marginBottom:16 }}>Partner With Us</p>
            <h2 className="t-display" style={{ marginBottom:16 }}>Let's Build the Future<br /><span style={{ color:'var(--gold)' }}>of Food Together.</span></h2>
            <p className="t-body" style={{ maxWidth:440, margin:'0 auto 36px' }}>Whether you're a chef, retailer, or distributor — we want to work with people who believe great food can come from plants.</p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <button className="btn btn-gold btn-lg" onClick={() => go('/contact')}>Get in Touch</button>
              <button className="btn btn-ghost btn-lg" onClick={() => go('/products')}>See Our Products</button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
