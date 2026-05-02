import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks';

export function AdminLogin() {
  const navigate = useNavigate();
  const { signIn, isAdmin, loading } = useAuth();
  const [email, setEmail]   = useState('');
  const [pw,    setPw]      = useState('');
  const [error, setError]   = useState('');
  const [busy,  setBusy]    = useState(false);
  const [shake, setShake]   = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && isAdmin) navigate('/admin', { replace: true });
  }, [isAdmin, loading, navigate]);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const attempt = async () => {
    if (!email.trim() || !pw) return setError('Email and password are required.');
    setBusy(true); setError('');
    const { error: err } = await signIn(email.trim(), pw);
    setBusy(false);
    if (err) {
      setError('Invalid credentials. Check email and password.');
      setShake(true); setTimeout(() => setShake(false), 600);
    } else {
      navigate('/admin', { replace: true });
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-main)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-9px)}40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
      <div style={{ width:'100%', maxWidth:400 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-block', marginBottom:16, animation:'logoPulse 3s ease infinite alternate' }}>
            <style>{`@keyframes logoPulse{from{filter:drop-shadow(0 0 8px rgba(255,193,7,0.3))}to{filter:drop-shadow(0 0 24px rgba(255,193,7,0.65))}}`}</style>
            <img src="/images/logo.png" width={56} height={56} alt="logo"
              style={{ objectFit:'contain', display:'block', margin:'0 auto' }}
              onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:26, fontWeight:700, color:'#fff', marginBottom:4 }}>Admin Panel</h1>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,0.3)' }}>Srivriddhi Enterprise CMS</p>
        </div>

        {/* Card */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'36px 32px', animation: shake ? 'shake 0.5s ease' : undefined }}>
          <div style={{ marginBottom:16 }}>
            <label className="field-label">Email</label>
            <input ref={emailRef} type="email" className="field" placeholder="admin@srivriddhi.com"
              value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('pw-input')?.focus()} />
          </div>
          <div style={{ marginBottom: error ? 10 : 24 }}>
            <label className="field-label">Password</label>
            <input id="pw-input" type="password" className="field" placeholder="••••••••"
              value={pw} onChange={e => { setPw(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && attempt()} />
          </div>
          {error && (
            <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.22)', borderRadius:'var(--radius-sm)', padding:'9px 12px', marginBottom:16 }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#F87171' }}>{error}</p>
            </div>
          )}
          <button className="btn btn-gold" style={{ width:'100%', padding:13 }} onClick={attempt} disabled={busy || loading}>
            {busy ? 'Signing in…' : 'Sign In →'}
          </button>
        </div>

        <p style={{ textAlign:'center', marginTop:20, fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,0.18)', lineHeight:1.8 }}>
          Use your Supabase Auth credentials.<br />
          Create admin user via Supabase → Authentication → Users.
        </p>
      </div>
    </div>
  );
}
