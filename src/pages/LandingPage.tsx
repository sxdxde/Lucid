// Persuasion framework (Cialdini): Authority, Social Proof, Liking, Reciprocity, Scarcity, Commitment
import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── Night sky canvas ─────────────────────────────────────────
interface Star {
  x: number; y: number;
  r: number; baseAlpha: number;
  speed: number; offset: number;
}

function NightSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const starsRef  = useRef<Star[]>([]);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      // Regenerate stars to fill new size
      starsRef.current = Array.from({ length: 280 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        baseAlpha: Math.random() * 0.55 + 0.15,
        speed: Math.random() * 0.6 + 0.15,
        offset: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.012;

      const { x: mx, y: my } = mouseRef.current;

      for (const star of starsRef.current) {
        const twinkle = star.baseAlpha + Math.sin(t * star.speed + star.offset) * 0.18;
        const dx = star.x - mx;
        const dy = star.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 130);
        const alpha  = Math.min(1, twinkle + proximity * 0.85);
        const radius = star.r + proximity * 3.5;

        // Soft glow halo near cursor
        if (proximity > 0.05) {
          const g = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, radius * 5);
          g.addColorStop(0, `rgba(160,200,255,${proximity * 0.45})`);
          g.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(star.x, star.y, radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        // Star dot
        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,235,255,${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}

// ── LUCID wordmark ────────────────────────────────────────────
const GOOGLE_COLORS = ['#4285F4','#EA4335','#FBBC04','#34A853','#4285F4'];

function LucidWordmark({ size = 'md', dark = false }: { size?: 'sm'|'md'|'lg'; dark?: boolean }) {
  const sizes = { sm: '1.3rem', md: '2rem', lg: '3.75rem' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', userSelect: 'none' }}>
      {'LUCID'.split('').map((ch, i) => (
        <span key={i} style={{
          color: dark ? '#fff' : GOOGLE_COLORS[i],
          fontWeight: 900, fontSize: sizes[size], letterSpacing: '-.025em', lineHeight: 1,
          textShadow: dark ? `0 0 20px ${GOOGLE_COLORS[i]}99` : 'none',
          transition: 'text-shadow .2s',
        }}>{ch}</span>
      ))}
    </span>
  );
}

// ── Google SVG icon ───────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.448 17.64 12.04 17.64 9.205z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.447-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.547 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.337-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  );
}

// ── Login modal ───────────────────────────────────────────────
interface LoginFlowProps {
  onSuccess: (name: string) => void;
  onClose: () => void;
}

function LoginModal({ onSuccess, onClose }: LoginFlowProps) {
  const [tab,      setTab]      = useState<'email'|'google'|'github'>('email');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr,  setPassErr]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const firstName = (email.split('@')[0]?.split('.')[0] ?? 'User');
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let ok = true;
    if (!email.trim() || !email.includes('@')) { setEmailErr('Enter a valid email address'); ok = false; }
    if (!password.trim()) { setPassErr('Enter your password'); ok = false; }
    if (!ok) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(displayName); }, 1100);
  };

  const handleSocial = (provider: string) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess('Sudarshan'); }, 1300);
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 440, boxShadow: '0 32px 80px rgba(0,0,0,.25)', overflow: 'hidden', animation: 'loginPop .28s cubic-bezier(.22,1,.36,1)' }}>
        {/* Top */}
        <div style={{ padding: '36px 44px 0', textAlign: 'center' }}>
          <LucidWordmark size="md" />
          <h2 style={{ margin: '20px 0 4px', fontSize: '1.375rem', fontWeight: 800, color: '#202124', letterSpacing: '-.025em' }}>Sign in to Lucid</h2>
          <p style={{ margin: '0 0 24px', fontSize: '.875rem', color: '#5f6368' }}>Choose how you'd like to continue</p>

          {/* 3-tab method selector */}
          <div style={{ display: 'flex', background: '#f1f3f4', borderRadius: 12, padding: 4, gap: 2, marginBottom: 24 }}>
            {([['email','Email & Password'],['google','Google'],['github','GitHub']] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '.8125rem', fontWeight: tab === id ? 700 : 400,
                  background: tab === id ? 'white' : 'transparent',
                  color: tab === id ? '#1a73e8' : '#5f6368',
                  boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,.12)' : 'none',
                  transition: 'all 150ms',
                }}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Form body */}
        <div style={{ padding: '0 44px 36px' }}>
          {tab === 'email' && (
            <form onSubmit={handleEmailLogin}>
              <div style={{ marginBottom: 12 }}>
                <input
                  type="email" autoFocus
                  placeholder="Email address"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
                  style={{ width: '100%', padding: '13px 16px', fontSize: '.9375rem', border: `1.5px solid ${emailErr ? '#d93025' : '#dadce0'}`, borderRadius: 10, outline: 'none', fontFamily: 'inherit', color: '#202124', boxSizing: 'border-box', background: '#fff', transition: 'border-color 120ms' }}
                  onFocus={e => !emailErr && (e.target.style.borderColor = '#1a73e8')}
                  onBlur={e => !emailErr && (e.target.style.borderColor = '#dadce0')}
                />
                {emailErr && <p style={{ margin: '4px 0 0', fontSize: '.75rem', color: '#d93025' }}>{emailErr}</p>}
              </div>
              <div style={{ marginBottom: 20 }}>
                {/* Password visible by default — no masking as requested */}
                <input
                  type="text"
                  placeholder="Password (visible)"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPassErr(''); }}
                  style={{ width: '100%', padding: '13px 16px', fontSize: '.9375rem', border: `1.5px solid ${passErr ? '#d93025' : '#dadce0'}`, borderRadius: 10, outline: 'none', fontFamily: 'inherit', color: '#202124', boxSizing: 'border-box', background: '#fff', transition: 'border-color 120ms', letterSpacing: '.05em' }}
                  onFocus={e => !passErr && (e.target.style.borderColor = '#1a73e8')}
                  onBlur={e => !passErr && (e.target.style.borderColor = '#dadce0')}
                />
                {passErr && <p style={{ margin: '4px 0 0', fontSize: '.75rem', color: '#d93025' }}>{passErr}</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <a href="#" style={{ fontSize: '.8125rem', color: '#1a73e8', textDecoration: 'none' }}>Forgot password?</a>
                <a href="#" style={{ fontSize: '.8125rem', color: '#1a73e8', textDecoration: 'none' }}>Create account</a>
              </div>
              <button
                type="submit" disabled={loading}
                style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: loading ? '#669df6' : '#1a73e8', color: 'white', fontSize: '.9375rem', fontWeight: 700, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 120ms' }}
              >
                {loading
                  ? <><span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,.35)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />Signing in…</>
                  : 'Sign in'
                }
              </button>
            </form>
          )}

          {tab === 'google' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ margin: '0 0 16px', fontSize: '.875rem', color: '#5f6368', textAlign: 'center' }}>
                Continue with your Google account. We'll never post without your permission.
              </p>
              {['sudarshan@gmail.com','work@gmail.com'].map(acc => (
                <button key={acc} onClick={() => handleSocial('google')}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #dadce0', background: 'white', cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 100ms', width: '100%', textAlign: 'left' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#f8f9fa')}
                  onMouseOut={e => (e.currentTarget.style.background = 'white')}
                >
                  <GoogleIcon />
                  <div>
                    <div style={{ fontSize: '.875rem', fontWeight: 600, color: '#202124' }}>Continue as {acc.split('@')[0]}</div>
                    <div style={{ fontSize: '.75rem', color: '#5f6368' }}>{acc}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '.75rem', color: '#9aa0a6' }}>›</span>
                </button>
              ))}
              {loading && (
                <div style={{ textAlign: 'center', color: '#5f6368', fontSize: '.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid #dadce0', borderTopColor: '#1a73e8', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
                  Connecting to Google…
                </div>
              )}
            </div>
          )}

          {tab === 'github' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ margin: '0 0 16px', fontSize: '.875rem', color: '#5f6368', textAlign: 'center' }}>
                Sign in with your GitHub account. Lucid will only request your email address.
              </p>
              <button
                onClick={() => handleSocial('github')} disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px', borderRadius: 10, border: 'none', background: loading ? '#444' : '#24292e', color: 'white', fontSize: '.9375rem', fontWeight: 600, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'background 120ms' }}
                onMouseOver={e => !loading && (e.currentTarget.style.background = '#1b1f23')}
                onMouseOut={e => !loading && (e.currentTarget.style.background = '#24292e')}
              >
                {loading
                  ? <><span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,.35)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />Connecting…</>
                  : <><GitHubIcon />Continue with GitHub</>
                }
              </button>
              <button
                onClick={() => onSuccess('Sudarshan')}
                style={{ padding: '12px', borderRadius: 10, border: '1.5px solid #dadce0', background: 'transparent', color: '#5f6368', fontSize: '.875rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 120ms' }}
                onMouseOver={e => e.currentTarget.style.background = '#f8f9fa'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                Continue as Guest (Demo)
              </button>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div style={{ padding: '12px 44px 28px', borderTop: '1px solid #f1f3f4', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '.75rem', color: '#9aa0a6' }}>
            By continuing you agree to Lucid's{' '}
            <a href="#" style={{ color: '#1a73e8', textDecoration: 'none' }}>Terms</a> and{' '}
            <a href="#" style={{ color: '#1a73e8', textDecoration: 'none' }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Feature cards ─────────────────────────────────────────────
const FEATURES = [
  { icon: '⚡', title: 'Blazing fast', desc: 'Keyboard shortcuts for everything. Search, compose, archive — all without touching your mouse.', badge: 'Power user' },
  { icon: '🎨', title: 'HCI-designed', desc: 'Every pixel informed by 40 years of usability research. Less cognitive load, more flow state.', badge: 'Research-backed' },
  { icon: '🌙', title: 'Night & day', desc: 'Beautiful dark and light themes. Your eyes will never tire, whether it is noon or midnight.', badge: 'Eye-friendly' },
  { icon: '🏷️', title: 'Smart labels', desc: 'Create custom folders, labels, and filters. Your inbox, your rules, drag to reorder.', badge: 'Fully yours' },
  { icon: '↩️', title: 'Undo anything', desc: 'Every destructive action is reversible. Archive, delete, move — all undoable with one keystroke.', badge: 'Always safe' },
  { icon: '✨', title: 'Smart replies', desc: 'Context-aware one-tap responses. Respond in seconds without sacrificing your voice.', badge: 'AI-assisted' },
];

const TESTIMONIALS = [
  { quote: "Switched from Gmail three months ago. Keyboard shortcuts alone saved me 40 minutes a day.", author: "Priya Sharma", role: "Product Designer · Figma", avatar: "PS", color: "#7c3aed" },
  { quote: "The dark mode is the most beautiful I've seen in any email client. Zero eye strain.", author: "Arjun Mehta", role: "Senior Engineer · Atlassian", avatar: "AM", color: "#0891b2" },
  { quote: "Finally an email app that respects my workflow. Labels, shortcuts, undo — it just works.", author: "Sarah Johnson", role: "UX Researcher · Google", avatar: "SJ", color: "#059669" },
];

// ── Landing page ──────────────────────────────────────────────
export function LandingPage({ onLogin }: { onLogin: (name: string) => void }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden', position: 'relative' }}>
      {/* Night sky canvas — visible in hero section */}
      <NightSky />

      {/* ── Sticky nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,5,16,.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64 }}>
        <LucidWordmark size="sm" dark />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setShowLogin(true)}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,.2)', background: 'transparent', color: 'rgba(255,255,255,.85)', fontSize: '.875rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 120ms' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >Sign in</button>
          <button onClick={() => setShowLogin(true)}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#1a73e8', color: 'white', fontSize: '.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 120ms', boxShadow: '0 2px 12px rgba(26,115,232,.5)' }}
            onMouseOver={e => e.currentTarget.style.background = '#1557b0'}
            onMouseOut={e => e.currentTarget.style.background = '#1a73e8'}
          >Get started free</button>
        </div>
      </nav>

      {/* ── Hero (dark — stars visible here) ── */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 48px 100px', textAlign: 'center', background: 'linear-gradient(180deg, #050510 0%, #0a0a20 60%, #12091e 100%)' }}>
        {/* Early access badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 999, border: '1px solid rgba(66,133,244,.4)', background: 'rgba(26,115,232,.12)', fontSize: '.8125rem', fontWeight: 600, color: '#669df6', marginBottom: 40 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4285f4', animation: 'pulse 2s ease-in-out infinite', display: 'inline-block' }} />
          Early access — join 50,000+ users already on Lucid
        </div>

        <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-.04em', color: 'white', margin: '0 0 24px', lineHeight: 1.08, maxWidth: 800 }}>
          Email, reimagined{' '}<br />
          <span style={{ background: 'linear-gradient(135deg, #4285f4 0%, #ea4335 35%, #fbbc04 65%, #34a853 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            for how you think
          </span>
        </h1>

        <p style={{ fontSize: '1.1875rem', color: 'rgba(255,255,255,.65)', maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.65 }}>
          Built on 40 years of HCI research. Lucid cuts cognitive load so you can focus on what matters — not your inbox.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <button onClick={() => setShowLogin(true)}
            style={{ padding: '16px 40px', borderRadius: 14, border: 'none', background: '#1a73e8', color: 'white', fontSize: '1.0625rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 140ms', boxShadow: '0 4px 24px rgba(26,115,232,.55)' }}
            onMouseOver={e => { e.currentTarget.style.background = '#1557b0'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#1a73e8'; e.currentTarget.style.transform = 'none'; }}
          >Start for free →</button>
          <button onClick={() => onLogin('Demo User')}
            style={{ padding: '16px 40px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.9)', fontSize: '1.0625rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(8px)', transition: 'all 120ms' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,.06)'}
          >Try the demo</button>
        </div>
        <p style={{ fontSize: '.8125rem', color: 'rgba(255,255,255,.35)' }}>No credit card required · Free forever plan</p>

        {/* Browser mockup */}
        <div style={{ margin: '72px auto 0', maxWidth: 860, borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,.1)', boxShadow: '0 40px 100px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.05)', background: '#0d0d20' }}>
          {/* Browser chrome */}
          <div style={{ background: '#1a1a2e', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,.08)' }}>
            {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
            <div style={{ flex: 1, background: 'rgba(255,255,255,.07)', borderRadius: 8, padding: '5px 12px', fontSize: '.75rem', color: 'rgba(255,255,255,.4)', textAlign: 'center' }}>app.lucidmail.io</div>
          </div>
          {/* App mockup */}
          <div style={{ display: 'flex', height: 380 }}>
            <div style={{ width: 68, background: '#0d0d20', borderRight: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 6 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: 'rgba(255,255,255,.5)', marginBottom: 8 }}>+</div>
              {['#ea4335','rgba(255,255,255,.2)','rgba(255,255,255,.2)','rgba(255,255,255,.2)'].map((c, i) => (
                <div key={i} style={{ width: 42, height: 28, borderRadius: 999, background: i === 0 ? 'rgba(26,115,232,.25)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, background: c }} />
                </div>
              ))}
            </div>
            <div style={{ flex: 1, background: '#111122', overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '.6875rem' }}>SS</div>
                <div style={{ width: 100, height: 9, borderRadius: 4, background: 'rgba(255,255,255,.12)' }} />
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
                  {[12, 4, 2].map((n, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '.9375rem', fontWeight: 700, color: i === 0 ? '#4285f4' : 'rgba(255,255,255,.6)' }}>{n}</div>
                      <div style={{ width: 30, height: 5, borderRadius: 3, background: 'rgba(255,255,255,.08)', margin: '4px auto 0' }} />
                    </div>
                  ))}
                </div>
              </div>
              {[1,0,1,0,0,1].map((unread, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,.04)', background: i === 1 ? 'rgba(26,115,232,.12)' : 'transparent' }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, border: '1.5px solid rgba(255,255,255,.15)' }} />
                  <div style={{ width: 14, height: 14, color: unread ? '#f59e0b' : 'rgba(255,255,255,.15)', fontSize: 12 }}>★</div>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: ['#7c3aed','#1a73e8','#059669','#d97706','#0891b2','#ef4444'][i] }} />
                  <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ width: 80, height: 8, borderRadius: 3, background: unread ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.2)' }} />
                    <div style={{ flex: 1, height: 8, borderRadius: 3, background: 'rgba(255,255,255,.08)' }} />
                  </div>
                  <div style={{ width: 22, height: 7, borderRadius: 3, background: 'rgba(255,255,255,.12)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats (light section — covers canvas) ── */}
      <section style={{ position: 'relative', zIndex: 1, background: 'white', borderTop: '1px solid #e8eaed', borderBottom: '1px solid #e8eaed' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px', display: 'flex', justifyContent: 'space-around', gap: 16, flexWrap: 'wrap' }}>
          {[['50K+','Active users'],['4.9★','User rating'],['99.9%','Uptime SLA'],['< 0.3s','Load time']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#202124', letterSpacing: '-.02em' }}>{v}</div>
              <div style={{ fontSize: '.875rem', color: '#5f6368', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ position: 'relative', zIndex: 1, background: '#fafafa', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#202124', margin: '0 0 14px', letterSpacing: '-.03em' }}>Every feature has a reason</h2>
            <p style={{ fontSize: '1rem', color: '#5f6368', maxWidth: 420, margin: '0 auto' }}>Nothing ships without a usability justification. That's the Lucid promise.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 20 }}>
            {FEATURES.map(({ icon, title, desc, badge }) => (
              <div key={title}
                style={{ background: 'white', border: '1.5px solid #e8eaed', borderRadius: 20, padding: '28px', transition: 'all 180ms', cursor: 'default' }}
                onMouseOver={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = '#1a73e8'; d.style.boxShadow = '0 8px 24px rgba(26,115,232,.1)'; d.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = '#e8eaed'; d.style.boxShadow = 'none'; d.style.transform = 'none'; }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: 14 }}>{icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#202124' }}>{title}</h3>
                  <span style={{ padding: '2px 8px', borderRadius: 999, background: '#e8f0fe', color: '#1a73e8', fontSize: '.6875rem', fontWeight: 700 }}>{badge}</span>
                </div>
                <p style={{ margin: 0, fontSize: '.9rem', color: '#5f6368', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials (dark — stars visible) ── */}
      <section style={{ position: 'relative', zIndex: 1, background: 'linear-gradient(135deg, #050510 0%, #0a0820 100%)', padding: '96px 48px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, color: 'white', margin: '0 0 60px', letterSpacing: '-.03em' }}>
            Loved by people who live in their inbox
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map(({ quote, author, role, avatar, color }) => (
              <div key={author} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 20, padding: '28px', border: '1px solid rgba(255,255,255,.08)', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,.25)', marginBottom: 12 }}>"</div>
                <p style={{ margin: '0 0 22px', fontSize: '.9375rem', color: 'rgba(255,255,255,.82)', lineHeight: 1.65 }}>{quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '.6875rem', flexShrink: 0 }}>{avatar}</div>
                  <div>
                    <div style={{ fontSize: '.875rem', fontWeight: 600, color: 'white' }}>{author}</div>
                    <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.45)' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, background: 'white', textAlign: 'center', padding: '96px 48px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#202124', margin: '0 0 16px', letterSpacing: '-.03em' }}>Your inbox deserves better.</h2>
        <p style={{ fontSize: '1.0625rem', color: '#5f6368', margin: '0 0 40px' }}>Join 50,000+ people who made the switch. Takes 30 seconds.</p>
        <button onClick={() => setShowLogin(true)}
          style={{ padding: '18px 52px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #1e2d70, #6b21a8)', color: 'white', fontSize: '1.0625rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 28px rgba(30,45,112,.35)', transition: 'all 160ms' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(30,45,112,.4)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(30,45,112,.35)'; }}
        >Get started free →</button>
        <p style={{ fontSize: '.8125rem', color: '#9aa0a6', marginTop: 16 }}>Free forever · No credit card · Cancel anytime</p>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: 'relative', zIndex: 1, background: '#050510', borderTop: '1px solid rgba(255,255,255,.06)', padding: '28px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <LucidWordmark size="sm" dark />
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy','Terms','Security','Help'].map(l => (
            <a key={l} href="#" style={{ fontSize: '.8125rem', color: 'rgba(255,255,255,.4)', textDecoration: 'none', transition: 'color 120ms' }}
              onMouseOver={e => (e.currentTarget.style.color = '#1a73e8')}
              onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,.4)')}
            >{l}</a>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: '.8125rem', color: 'rgba(255,255,255,.25)' }}>© 2026 Lucid Mail · Built with HCI ♡</p>
      </footer>

      {showLogin && <LoginModal onSuccess={name => { setShowLogin(false); onLogin(name); }} onClose={() => setShowLogin(false)} />}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        @keyframes loginPop { from{opacity:0;transform:scale(.96) translateY(10px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}
