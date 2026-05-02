import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth, useUnreadCount } from '../hooks';

const NAV_SECTIONS = [
  {
    label: 'Content',
    items: [
      { icon: '📦', label: 'Products',     path: '/admin/products' },
      { icon: '📝', label: 'Blog',          path: '/admin/blog' },
      { icon: '🏠', label: 'Homepage',      path: '/admin/homepage' },
      { icon: 'ℹ️',  label: 'About Page',   path: '/admin/about' },
      { icon: '⭐', label: 'Testimonials',  path: '/admin/testimonials' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { icon: '📬', label: 'Inquiries',     path: '/admin/inquiries', badge: true },
      { icon: '🔍', label: 'SEO',           path: '/admin/seo' },
      { icon: '⚙️', label: 'Settings',      path: '/admin/settings' },
    ],
  },
];

function LogoMark() {
  return (
    <img src="/images/logo.png" width={28} height={28} alt="logo"
      style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(255,193,7,0.5))' }}
      onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
  );
}

export function AdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { signOut } = useAuth();
  const unread = useUnreadCount();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (p: string) => location.pathname.startsWith(p);
  const go = (p: string) => { navigate(p); setMobileOpen(false); };

  const sidebar = (
    <aside className={`adm-sidebar${mobileOpen ? ' open' : ''}`}>
      {/* Header */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <LogoMark />
          <div>
            <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1 }}>SVR20</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(255,193,7,0.5)', textTransform: 'uppercase', marginTop: 2 }}>ADMIN</div>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div style={{ padding: '12px 8px 4px', flexShrink: 0 }}>
        <button className={`adm-nav-link${location.pathname === '/admin' ? ' active' : ''}`} onClick={() => go('/admin')}>
          <span>📊</span> Dashboard
        </button>
      </div>

      {/* Nav sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {NAV_SECTIONS.map(section => (
          <div key={section.label} style={{ marginTop: 16 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', padding: '0 12px', marginBottom: 4 }}>
              {section.label}
            </p>
            {section.items.map(item => (
              <button key={item.path}
                className={`adm-nav-link${isActive(item.path) ? ' active' : ''}`}
                onClick={() => go(item.path)}>
                <span>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && unread > 0 && (
                  <span style={{ background: 'var(--gold)', color: '#0B0B0B', borderRadius: 'var(--radius-full)', fontSize: 9, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>
                    {unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <button className="adm-nav-link" onClick={() => navigate('/')} >
          <span>🌐</span> View Site
        </button>
        <button className="adm-nav-link" onClick={() => signOut().then(() => navigate('/admin/login'))}>
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <style>{`
        @media (max-width: 768px) {
          .adm-mob-bar { display: flex !important; }
          .adm-mob-overlay { display: ${mobileOpen ? 'block' : 'none'} !important; }
        }
      `}</style>

      {sidebar}

      {/* Mobile overlay */}
      <div className="adm-mob-overlay" onClick={() => setMobileOpen(false)}
        style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 199 }} />

      {/* Mobile top bar */}
      <div className="adm-mob-bar" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: 52, background: '#080808', borderBottom: '1px solid var(--border)', zIndex: 198, alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <button onClick={() => setMobileOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 20 }}>☰</button>
        <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 15, fontWeight: 700, color: '#fff' }}>Admin</span>
        <div style={{ width: 24 }} />
      </div>

      <main className="adm-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}
