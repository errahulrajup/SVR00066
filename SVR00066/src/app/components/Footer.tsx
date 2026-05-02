import { useNavigate } from 'react-router';
import { useSiteSettings } from '../hooks';

const NAV = [
  { label: 'Home', path: '/' }, { label: 'Products', path: '/products' },
  { label: 'Blog', path: '/blog' }, { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export function Footer() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const go = (p: string) => { navigate(p); window.scrollTo(0, 0); };

  return (
    <footer style={{ background: '#070707', borderTop: '1px solid rgba(255,193,7,0.10)' }}>
      <style>{`
        .ftr { max-width: var(--max-w); margin: 0 auto; padding: 64px var(--pad) 32px; }
        .ftr-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 56px; padding-bottom: 44px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .ftr-bottom { padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .ftr-nav-btn { display: block; background: none; border: none; cursor: pointer; font-family: 'DM Sans',sans-serif; font-size: 13px; color: rgba(255,255,255,0.38); padding: 4px 0; text-align: left; transition: color 0.2s; }
        .ftr-nav-btn:hover { color: var(--gold); }
        @media (max-width: 768px) { .ftr-grid { grid-template-columns: 1fr; gap: 28px; } .ftr-bottom { flex-direction: column; align-items: flex-start; } }
      `}</style>
      <div className="ftr">
        <div className="ftr-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src="/images/logo.png" width={34} height={34} alt="logo"
                style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255,193,7,0.35))' }}
                onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
              <div>
                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {settings.site_name?.split(' ')[0] ?? 'Srivriddhi'}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.28em', color: 'rgba(255,193,7,0.55)', textTransform: 'uppercase', marginTop: 3 }}>
                  {settings.site_name?.split(' ').slice(1).join(' ') ?? 'Enterprise'}
                </div>
              </div>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.9, maxWidth: 280 }}>
              {settings.footer_tagline ?? 'Premium plant-based foods from India — built around appetite, quality, and category ambition.'}
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 15, fontStyle: 'italic', color: 'rgba(255,255,255,0.28)', marginTop: 16, lineHeight: 1.4 }}>
              Plant-based products. Built to win.
            </p>
          </div>
          <div>
            <p className="t-label" style={{ marginBottom: 16 }}>Navigate</p>
            {NAV.map(n => <button key={n.path} className="ftr-nav-btn" onClick={() => go(n.path)}>{n.label}</button>)}
          </div>
          <div>
            <p className="t-label" style={{ marginBottom: 16 }}>Contact</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 2.1 }}>
              {settings.site_email ?? 'info@srivriddhi.com'}<br />
              {settings.site_phone ?? '+91 7565 000 365'}<br />
              {settings.site_address ?? 'Sagar, M.P. — India'}
            </p>
          </div>
        </div>
        <div className="ftr-bottom">
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>
            © {new Date().getFullYear()} {settings.site_name ?? 'Srivriddhi Enterprise'}. All rights reserved.
          </p>
          <button onClick={() => go('/admin')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: 'rgba(255,255,255,0.08)', fontFamily: "'DM Sans',sans-serif", padding: '2px 4px', transition: 'color 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,193,7,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.08)')}>
            ·
          </button>
        </div>
      </div>
    </footer>
  );
}
