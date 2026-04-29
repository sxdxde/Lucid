// Persuasion framework (Cialdini): Authority, Social Proof, Liking, Reciprocity, Scarcity, Commitment
import React, { useState, useEffect, useRef } from 'react';

// ── Feature icon SVGs (no emoji) ──────────────────────────────
function IconLightning() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
function IconHexagon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconHalfMoon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function IconTag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconUndo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}
function IconSparkle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

// ── Postal Globe ──────────────────────────────────────────────
// Animated light-mode world grid: cities connected by red dashed lines
// suggesting historic post office mail routes.

interface GlobeCity  { name: string; lat: number; lon: number; }
interface GlobeRoute { fromIdx: number; toIdx: number; }
interface MailPacket { routeIdx: number; t: number; speed: number; }

const GLOBE_CITIES: GlobeCity[] = [
  { name: 'London',     lat:  51.5,  lon:  -0.1  },
  { name: 'New York',   lat:  40.7,  lon: -74.0  },
  { name: 'Paris',      lat:  48.9,  lon:   2.3  },
  { name: 'Berlin',     lat:  52.5,  lon:  13.4  },
  { name: 'Mumbai',     lat:  19.1,  lon:  72.9  },
  { name: 'Tokyo',      lat:  35.7,  lon: 139.7  },
  { name: 'Sydney',     lat: -33.9,  lon: 151.2  },
  { name: 'Sao Paulo',  lat: -23.5,  lon: -46.6  },
  { name: 'Cairo',      lat:  30.0,  lon:  31.2  },
  { name: 'Moscow',     lat:  55.8,  lon:  37.6  },
  { name: 'Singapore',  lat:   1.3,  lon: 103.8  },
  { name: 'Chicago',    lat:  41.9,  lon: -87.6  },
  { name: 'Dubai',      lat:  25.2,  lon:  55.3  },
  { name: 'Nairobi',    lat:  -1.3,  lon:  36.8  },
];

const GLOBE_ROUTES: GlobeRoute[] = [
  { fromIdx:  0, toIdx:  1 }, // London – New York
  { fromIdx:  0, toIdx:  2 }, // London – Paris
  { fromIdx:  2, toIdx:  3 }, // Paris – Berlin
  { fromIdx:  3, toIdx:  9 }, // Berlin – Moscow
  { fromIdx:  9, toIdx:  4 }, // Moscow – Mumbai
  { fromIdx:  4, toIdx:  5 }, // Mumbai – Tokyo
  { fromIdx:  5, toIdx:  6 }, // Tokyo – Sydney
  { fromIdx:  1, toIdx:  7 }, // New York – Sao Paulo
  { fromIdx:  0, toIdx:  8 }, // London – Cairo
  { fromIdx:  8, toIdx:  4 }, // Cairo – Mumbai
  { fromIdx:  4, toIdx: 10 }, // Mumbai – Singapore
  { fromIdx:  5, toIdx: 10 }, // Tokyo – Singapore
  { fromIdx:  1, toIdx: 11 }, // New York – Chicago
  { fromIdx:  7, toIdx: 13 }, // Sao Paulo – Nairobi
  { fromIdx:  8, toIdx: 12 }, // Cairo – Dubai
  { fromIdx: 12, toIdx:  4 }, // Dubai – Mumbai
  { fromIdx: 13, toIdx:  8 }, // Nairobi – Cairo
  { fromIdx: 11, toIdx:  1 }, // Chicago – New York
];

function gcPoint(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
  t: number,
): [number, number] {
  const phi1 = lat1 * Math.PI / 180, lam1 = lon1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180, lam2 = lon2 * Math.PI / 180;
  const d = Math.acos(Math.max(-1, Math.min(1,
    Math.sin(phi1)*Math.sin(phi2) + Math.cos(phi1)*Math.cos(phi2)*Math.cos(lam2-lam1),
  )));
  if (d < 1e-6) return [lat1, lon1];
  const A = Math.sin((1-t)*d)/Math.sin(d);
  const B = Math.sin(t*d)    /Math.sin(d);
  const x = A*Math.cos(phi1)*Math.cos(lam1) + B*Math.cos(phi2)*Math.cos(lam2);
  const y = A*Math.cos(phi1)*Math.sin(lam1) + B*Math.cos(phi2)*Math.sin(lam2);
  const z = A*Math.sin(phi1)                + B*Math.sin(phi2);
  return [
    Math.atan2(z, Math.sqrt(x*x+y*y)) * 180/Math.PI,
    Math.atan2(y, x) * 180/Math.PI,
  ];
}

function PostalGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let rotation  = -0.4;
    let dashOff   = 0;

    const packets: MailPacket[] = GLOBE_ROUTES.map((_, i) => ({
      routeIdx: i,
      t: Math.random(),
      speed: 0.00065 + Math.random() * 0.00055,
    }));

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Center the globe in the panel
      const cx = W / 2;
      const cy = H / 2;
      const r  = Math.min(W * 0.44, H * 0.44, 320);

      rotation += 0.00105;
      dashOff  -= 0.28;

      const to3D = (lat: number, lon: number, rad: number): [number, number, number] => {
        const phi   = (90 - lat) * Math.PI / 180;
        const theta = lon * Math.PI / 180 + rotation;
        return [
          rad * Math.sin(phi) * Math.cos(theta),
          -rad * Math.cos(phi),
          rad * Math.sin(phi) * Math.sin(theta),
        ];
      };

      const proj = (p: [number, number, number]) => ({
        x: cx + p[0], y: cy + p[1], vis: p[2] >= 0,
      });

      // Atmosphere halo
      const atm = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.18);
      atm.addColorStop(0, 'rgba(200,160,80,0.12)');
      atm.addColorStop(1, 'rgba(200,160,80,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.18, 0, Math.PI * 2);
      ctx.fillStyle = atm;
      ctx.fill();

      // Globe surface fill
      const fill = ctx.createRadialGradient(cx - r*0.22, cy - r*0.25, r*0.04, cx, cy, r);
      fill.addColorStop(0,   'rgba(255,253,248,0.98)');
      fill.addColorStop(0.65,'rgba(250,244,230,0.96)');
      fill.addColorStop(1,   'rgba(236,222,198,0.93)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();

      const LAT_LINES = [-60, -30, 0, 30, 60];
      const LON_LINES = Array.from({ length: 12 }, (_, i) => i * 30);
      const SEG = 128;

      const drawGrid = (front: boolean) => {
        ctx.strokeStyle = front
          ? 'rgba(120, 82, 42, 0.27)'
          : 'rgba(120, 82, 42, 0.09)';
        ctx.lineWidth = front ? 0.8 : 0.45;

        for (const lat of LAT_LINES) {
          ctx.beginPath();
          let pen = false;
          for (let s = 0; s <= SEG; s++) {
            const lon = (s / SEG) * 360 - 180;
            const { x, y, vis } = proj(to3D(lat, lon, r));
            if (vis !== front) { pen = false; continue; }
            pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
            pen = true;
          }
          ctx.stroke();
        }

        for (const lon of LON_LINES) {
          ctx.beginPath();
          let pen = false;
          for (let s = 0; s <= SEG; s++) {
            const lat = (s / SEG) * 180 - 90;
            const { x, y, vis } = proj(to3D(lat, lon, r));
            if (vis !== front) { pen = false; continue; }
            pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
            pen = true;
          }
          ctx.stroke();
        }
      };

      const drawRoutes = (front: boolean) => {
        ctx.setLineDash([5, 8]);
        ctx.lineDashOffset = dashOff;
        ctx.strokeStyle = front
          ? 'rgba(185, 45, 35, 0.62)'
          : 'rgba(185, 45, 35, 0.13)';
        ctx.lineWidth = front ? 1.5 : 0.7;

        for (const route of GLOBE_ROUTES) {
          const c1 = GLOBE_CITIES[route.fromIdx];
          const c2 = GLOBE_CITIES[route.toIdx];
          ctx.beginPath();
          let pen = false;
          for (let s = 0; s <= 90; s++) {
            const [lat, lon] = gcPoint(c1.lat, c1.lon, c2.lat, c2.lon, s / 90);
            const { x, y, vis } = proj(to3D(lat, lon, r * 1.009));
            if (vis !== front) { pen = false; continue; }
            pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
            pen = true;
          }
          ctx.stroke();
        }
        ctx.setLineDash([]);
      };

      drawGrid(false);
      drawRoutes(false);

      // Globe border
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(130, 88, 44, 0.28)';
      ctx.lineWidth   = 1.2;
      ctx.stroke();

      drawGrid(true);
      drawRoutes(true);

      // City markers
      for (const city of GLOBE_CITIES) {
        const { x, y, vis } = proj(to3D(city.lat, city.lon, r));
        if (!vis) continue;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, 10);
        glow.addColorStop(0, 'rgba(185,45,35,0.38)');
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 3.8, 0, Math.PI * 2);
        ctx.fillStyle   = '#b92d23';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.92)';
        ctx.lineWidth   = 1.6;
        ctx.stroke();

        ctx.font         = '500 9px Inter, system-ui, sans-serif';
        ctx.fillStyle    = 'rgba(65, 35, 12, 0.88)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(city.name, x, y - 9);
      }

      // Mail envelopes
      for (const pkt of packets) {
        const route = GLOBE_ROUTES[pkt.routeIdx];
        const c1    = GLOBE_CITIES[route.fromIdx];
        const c2    = GLOBE_CITIES[route.toIdx];

        const [lat, lon] = gcPoint(c1.lat, c1.lon, c2.lat, c2.lon, pkt.t);
        const { x, y, vis } = proj(to3D(lat, lon, r * 1.022));

        if (vis) {
          const ahead = Math.min(1, pkt.t + 0.018);
          const [la2, lo2] = gcPoint(c1.lat, c1.lon, c2.lat, c2.lon, ahead);
          const { x: x2, y: y2 } = proj(to3D(la2, lo2, r * 1.022));
          const angle = Math.atan2(y2 - y, x2 - x);

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);

          const ew = 12, eh = 8;

          ctx.shadowColor    = 'rgba(160, 35, 25, 0.45)';
          ctx.shadowBlur     = 5;
          ctx.shadowOffsetX  = 0.5;
          ctx.shadowOffsetY  = 0.5;

          ctx.fillStyle = '#b92d23';
          ctx.beginPath();
          ctx.rect(-ew/2, -eh/2, ew, eh);
          ctx.fill();

          ctx.shadowBlur    = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          ctx.strokeStyle = 'rgba(255,255,255,0.82)';
          ctx.lineWidth   = 0.95;
          ctx.beginPath();
          ctx.moveTo(-ew/2, -eh/2);
          ctx.lineTo(0, eh * 0.18);
          ctx.lineTo(ew/2, -eh/2);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(255,255,255,0.28)';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(-ew/2 + 1.5, eh/2 - 2);
          ctx.lineTo(ew/2 - 1.5, eh/2 - 2);
          ctx.stroke();

          ctx.restore();
        }

        pkt.t += pkt.speed;
        if (pkt.t > 1) pkt.t = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
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
  const [tab,      setTab]      = useState<'email'|'google'|'github'|'signup'>('email');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr,  setPassErr]  = useState('');
  const [loading,  setLoading]  = useState(false);

  // Sign-up form state
  const [signupName,    setSignupName]    = useState('');
  const [signupEmail,   setSignupEmail]   = useState('');
  const [signupPass,    setSignupPass]    = useState('');
  const [signupNameErr, setSignupNameErr] = useState('');
  const [signupEmailErr,setSignupEmailErr]= useState('');
  const [signupPassErr, setSignupPassErr] = useState('');

  const firstName   = (email.split('@')[0]?.split('.')[0] ?? '');
  const displayName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : 'User';

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let ok = true;
    if (!email.trim() || !email.includes('@')) { setEmailErr('Enter a valid email address'); ok = false; }
    if (!password.trim()) { setPassErr('Enter your password'); ok = false; }
    if (!ok) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(displayName); }, 1100);
  };

  const handleSocial = (_provider: string, accountEmail?: string) => {
    setLoading(true);
    const name = accountEmail
      ? (() => { const p = accountEmail.split('@')[0]?.split('.')[0] ?? ''; return p ? p.charAt(0).toUpperCase() + p.slice(1) : 'User'; })()
      : 'User';
    setTimeout(() => { setLoading(false); onSuccess(name); }, 1300);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    let ok = true;
    if (!signupName.trim()) { setSignupNameErr('Enter your name'); ok = false; }
    if (!signupEmail.trim() || !signupEmail.includes('@')) { setSignupEmailErr('Enter a valid email address'); ok = false; }
    if (!signupPass.trim()) { setSignupPassErr('Enter a password'); ok = false; }
    if (!ok) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(signupName.trim() || 'User'); }, 1100);
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 440, boxShadow: '0 32px 80px rgba(0,0,0,.25)', overflow: 'hidden', animation: 'loginPop .28s cubic-bezier(.22,1,.36,1)' }}>
        <div style={{ padding: '36px 44px 0', textAlign: 'center' }}>
          <LucidWordmark size="md" />
          <h2 style={{ margin: '20px 0 4px', fontSize: '1.375rem', fontWeight: 800, color: '#202124', letterSpacing: '-.025em' }}>
            {tab === 'signup' ? 'Create your account' : 'Sign in to Lucid'}
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: '.875rem', color: '#5f6368' }}>
            {tab === 'signup' ? 'Fill in your details to get started' : "Choose how you'd like to continue"}
          </p>

          {tab !== 'signup' && (
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
          )}
        </div>

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
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  style={{ fontSize: '.8125rem', color: '#1a73e8', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                >Create account</button>
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
              {['user@gmail.com','work@gmail.com'].map(acc => (
                <button key={acc} onClick={() => handleSocial('google', acc)}
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
                onClick={() => onSuccess('Guest')}
                style={{ padding: '12px', borderRadius: 10, border: '1.5px solid #dadce0', background: 'transparent', color: '#5f6368', fontSize: '.875rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 120ms' }}
                onMouseOver={e => e.currentTarget.style.background = '#f8f9fa'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                Continue as Guest (Demo)
              </button>
            </div>
          )}

          {tab === 'signup' && (
            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: 12 }}>
                <input
                  type="text" autoFocus
                  placeholder="Your name"
                  value={signupName}
                  onChange={e => { setSignupName(e.target.value); setSignupNameErr(''); }}
                  style={{ width: '100%', padding: '13px 16px', fontSize: '.9375rem', border: `1.5px solid ${signupNameErr ? '#d93025' : '#dadce0'}`, borderRadius: 10, outline: 'none', fontFamily: 'inherit', color: '#202124', boxSizing: 'border-box', background: '#fff', transition: 'border-color 120ms' }}
                  onFocus={e => !signupNameErr && (e.target.style.borderColor = '#1a73e8')}
                  onBlur={e => !signupNameErr && (e.target.style.borderColor = '#dadce0')}
                />
                {signupNameErr && <p style={{ margin: '4px 0 0', fontSize: '.75rem', color: '#d93025' }}>{signupNameErr}</p>}
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  type="email"
                  placeholder="Email address"
                  value={signupEmail}
                  onChange={e => { setSignupEmail(e.target.value); setSignupEmailErr(''); }}
                  style={{ width: '100%', padding: '13px 16px', fontSize: '.9375rem', border: `1.5px solid ${signupEmailErr ? '#d93025' : '#dadce0'}`, borderRadius: 10, outline: 'none', fontFamily: 'inherit', color: '#202124', boxSizing: 'border-box', background: '#fff', transition: 'border-color 120ms' }}
                  onFocus={e => !signupEmailErr && (e.target.style.borderColor = '#1a73e8')}
                  onBlur={e => !signupEmailErr && (e.target.style.borderColor = '#dadce0')}
                />
                {signupEmailErr && <p style={{ margin: '4px 0 0', fontSize: '.75rem', color: '#d93025' }}>{signupEmailErr}</p>}
              </div>
              <div style={{ marginBottom: 20 }}>
                <input
                  type="text"
                  placeholder="Password (visible)"
                  value={signupPass}
                  onChange={e => { setSignupPass(e.target.value); setSignupPassErr(''); }}
                  style={{ width: '100%', padding: '13px 16px', fontSize: '.9375rem', border: `1.5px solid ${signupPassErr ? '#d93025' : '#dadce0'}`, borderRadius: 10, outline: 'none', fontFamily: 'inherit', color: '#202124', boxSizing: 'border-box', background: '#fff', transition: 'border-color 120ms' }}
                  onFocus={e => !signupPassErr && (e.target.style.borderColor = '#1a73e8')}
                  onBlur={e => !signupPassErr && (e.target.style.borderColor = '#dadce0')}
                />
                {signupPassErr && <p style={{ margin: '4px 0 0', fontSize: '.75rem', color: '#d93025' }}>{signupPassErr}</p>}
              </div>
              <button
                type="submit" disabled={loading}
                style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: loading ? '#669df6' : '#1a73e8', color: 'white', fontSize: '.9375rem', fontWeight: 700, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 120ms', marginBottom: 12 }}
              >
                {loading
                  ? <><span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,.35)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />Creating account…</>
                  : 'Create account'
                }
              </button>
              <button
                type="button"
                onClick={() => setTab('email')}
                style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #dadce0', background: 'transparent', color: '#5f6368', fontSize: '.875rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 120ms' }}
                onMouseOver={e => (e.currentTarget.style.background = '#f8f9fa')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                Back to sign in
              </button>
            </form>
          )}
        </div>

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

// ── Feature cards (no emojis — SVG icons) ────────────────────
const FEATURES = [
  { Icon: IconLightning, title: 'Blazing fast',  desc: 'Keyboard shortcuts for everything. Search, compose, archive — all without touching your mouse.', badge: 'Power user'       },
  { Icon: IconHexagon,   title: 'HCI-designed',  desc: 'Every pixel informed by 40 years of usability research. Less cognitive load, more flow state.',  badge: 'Research-backed'  },
  { Icon: IconHalfMoon,  title: 'Night and day', desc: 'Beautiful dark and light themes. Your eyes will never tire, whether it is noon or midnight.',     badge: 'Eye-friendly'     },
  { Icon: IconTag,       title: 'Smart labels',  desc: 'Create custom folders, labels, and filters. Your inbox, your rules, drag to reorder.',            badge: 'Fully yours'      },
  { Icon: IconUndo,      title: 'Undo anything', desc: 'Every destructive action is reversible. Archive, delete, move — all undoable with one keystroke.', badge: 'Always safe'     },
  { Icon: IconSparkle,   title: 'Smart replies', desc: 'Context-aware one-tap responses. Respond in seconds without sacrificing your voice.',             badge: 'AI-assisted'      },
];

const TESTIMONIALS = [
  { quote: "Switched from Gmail three months ago. Keyboard shortcuts alone saved me 40 minutes a day. The remappable shortcuts were the killer feature — I kept my Superhuman muscle memory.", author: "Priya Sharma",   role: "Product Designer", company: "Figma",      avatar: "PS", color: "#7c3aed", featured: false },
  { quote: "Finally an email client built like a product, not a feature dump. The archive context banners and undo system alone removed so much anxiety from my inbox routine.",               author: "Arjun Mehta",   role: "Senior Engineer",  company: "Atlassian",  avatar: "AM", color: "#0891b2", featured: true  },
  { quote: "The HCI principles aren't just marketing — you feel them. Gestalt grouping, Fitts' Law targets, zero cognitive load. This is what email should have always looked like.",          author: "Sarah Johnson", role: "UX Researcher",    company: "Google",     avatar: "SJ", color: "#059669", featured: false },
];

// ── Landing page ──────────────────────────────────────────────
export function LandingPage({ onLogin }: { onLogin: (name: string) => void }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden', position: 'relative' }}>

      {/* ── Sticky nav (light) ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(253,250,246,.93)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(160,120,70,.16)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
      }}>
        <LucidWordmark size="sm" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setShowLogin(true)}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(90,55,20,.18)', background: 'transparent', color: '#4a3318', fontSize: '.875rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 120ms' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(90,55,20,.06)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >Sign in</button>
          <button onClick={() => setShowLogin(true)}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#1a73e8', color: 'white', fontSize: '.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 120ms', boxShadow: '0 2px 12px rgba(26,115,232,.32)' }}
            onMouseOver={e => e.currentTarget.style.background = '#1557b0'}
            onMouseOut={e => e.currentTarget.style.background = '#1a73e8'}
          >Get started free</button>
        </div>
      </nav>

      {/* ── Hero — two-column: text left, globe right ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        background: 'linear-gradient(135deg, #fdfaf5 0%, #f9f3e8 55%, #f0e6d0 100%)',
        overflow: 'hidden',
      }}>
        {/* Left column — text content */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '100px 56px 80px 72px',
          flex: '0 0 50%', maxWidth: 640,
          position: 'relative', zIndex: 2,
        }}>
          {/* Postal badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999,
            border: '1px solid rgba(185,45,35,.3)',
            background: 'rgba(185,45,35,.07)',
            fontSize: '.8rem', fontWeight: 600, color: '#b92d23',
            marginBottom: 32, alignSelf: 'flex-start',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#b92d23', animation: 'pulse 2s ease-in-out infinite', display: 'inline-block' }} />
            Connecting 50,000 inboxes worldwide
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 4.2vw, 4.5rem)',
            fontWeight: 900, letterSpacing: '-.04em',
            color: '#2a1a08', margin: '0 0 20px', lineHeight: 1.09,
          }}>
            Email,{' '}
            <span style={{ whiteSpace: 'nowrap' }}>reimagined</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #4285f4 0%, #ea4335 38%, #b92d23 62%, #d97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              for how you think
            </span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#6b4a2a', maxWidth: 460, margin: '0 0 40px', lineHeight: 1.68 }}>
            Built on 40 years of HCI research. Lucid cuts cognitive load so you can focus on what matters — not your inbox.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
            <button onClick={() => setShowLogin(true)}
              style={{ padding: '15px 36px', borderRadius: 12, border: 'none', background: '#1a73e8', color: 'white', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 140ms', boxShadow: '0 4px 20px rgba(26,115,232,.4)' }}
              onMouseOver={e => { e.currentTarget.style.background = '#1557b0'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#1a73e8'; e.currentTarget.style.transform = 'none'; }}
            >Start for free</button>
            <button onClick={() => onLogin('Demo User')}
              style={{ padding: '15px 36px', borderRadius: 12, border: '1.5px solid rgba(90,55,20,.22)', background: 'rgba(255,255,255,0.7)', color: '#4a3318', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(8px)', transition: 'all 120ms' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.92)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.7)'}
            >Try the demo</button>
          </div>

          <p style={{ fontSize: '.8rem', color: 'rgba(107,74,42,.55)', margin: '0 0 40px' }}>
            No credit card required · Free forever plan
          </p>

          {/* Route legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '.7rem', color: '#b92d23', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginRight: 4 }}>Active routes</span>
            <span style={{ width: 18, height: 0, borderTop: '1.5px dashed rgba(185,45,35,.55)', display: 'inline-block' }} />
            {['London','New York','Tokyo','Mumbai','Cairo','Sydney'].map(c => (
              <span key={c} style={{ fontSize: '.7rem', color: 'rgba(90,55,20,.7)', padding: '2px 8px', borderRadius: 999, border: '1px solid rgba(185,45,35,.2)', background: 'rgba(185,45,35,.05)' }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Right column — globe canvas */}
        <div style={{
          flex: 1,
          position: 'relative',
          minHeight: '100vh',
        }}>
          <PostalGlobe />
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ position: 'relative', zIndex: 1, background: 'white', borderTop: '1px solid #e8eaed', borderBottom: '1px solid #e8eaed' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px', display: 'flex', justifyContent: 'space-around', gap: 16, flexWrap: 'wrap' }}>
          {[['50K+','Active users'],['4.9','User rating'],['99.9%','Uptime SLA'],['< 0.3s','Load time']].map(([v, l]) => (
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
            {FEATURES.map(({ Icon, title, desc, badge }) => (
              <div key={title}
                style={{ background: 'white', border: '1.5px solid #e8eaed', borderRadius: 20, padding: '28px', transition: 'all 180ms', cursor: 'default' }}
                onMouseOver={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = '#1a73e8'; d.style.boxShadow = '0 8px 24px rgba(26,115,232,.1)'; d.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = '#e8eaed'; d.style.boxShadow = 'none'; d.style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, background: '#f0ebe3', color: '#7a5533', marginBottom: 16 }}>
                  <Icon />
                </div>
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

      {/* ── Testimonials (dark) ── */}
      <section style={{ position: 'relative', zIndex: 1, background: 'linear-gradient(160deg, #060614 0%, #0c0b24 55%, #06060f 100%)', padding: '112px 48px', borderTop: '1px solid rgba(255,255,255,.06)', overflow: 'hidden' }}>
        {/* Ambient background orbs */}
        <div style={{ position: 'absolute', top: -160, left: '8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,115,232,.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, right: '12%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 999, border: '1px solid rgba(251,188,4,.28)', background: 'rgba(251,188,4,.08)', marginBottom: 24 }}>
              <span style={{ color: '#fbbc04', fontSize: '.8125rem', fontWeight: 700 }}>{'★★★★★'}</span>
              <span style={{ color: 'rgba(251,188,4,.9)', fontSize: '.8125rem', fontWeight: 600, letterSpacing: '.02em' }}>4.9 · Trusted by 50,000+ users</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, color: 'white', margin: '0 0 16px', letterSpacing: '-.04em', lineHeight: 1.1 }}>
              Real people. Real results.
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,.45)', margin: '0 auto', maxWidth: 440, lineHeight: 1.65 }}>
              From designers to engineers — people who switched from Gmail don't look back.
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22, alignItems: 'start' }}>
            {TESTIMONIALS.map(({ quote, author, role, company, avatar, color, featured }) => (
              <div
                key={author}
                style={{
                  position: 'relative',
                  background: featured ? 'rgba(26,115,232,.07)' : 'rgba(255,255,255,.04)',
                  borderRadius: 24,
                  padding: '36px 32px 28px',
                  border: featured ? '1px solid rgba(26,115,232,.38)' : '1px solid rgba(255,255,255,.09)',
                  backdropFilter: 'blur(18px)',
                  boxShadow: featured ? '0 0 0 1px rgba(26,115,232,.12), 0 28px 72px rgba(0,0,0,.45)' : '0 8px 32px rgba(0,0,0,.28)',
                  transition: 'transform 200ms, box-shadow 200ms',
                  cursor: 'default',
                }}
                onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = featured ? '0 0 0 1px rgba(26,115,232,.2), 0 40px 80px rgba(0,0,0,.55)' : '0 20px 56px rgba(0,0,0,.45)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = featured ? '0 0 0 1px rgba(26,115,232,.12), 0 28px 72px rgba(0,0,0,.45)' : '0 8px 32px rgba(0,0,0,.28)'; }}
              >
                {/* Featured label */}
                {featured && (
                  <div style={{ position: 'absolute', top: -1, left: 28, padding: '4px 14px', borderRadius: '0 0 10px 10px', background: '#1a73e8', fontSize: '.68rem', fontWeight: 800, color: 'white', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                    Featured
                  </div>
                )}

                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 22 }}>
                  {[0,1,2,3,4].map(s => (
                    <span key={s} style={{ color: '#fbbc04', fontSize: '1rem', lineHeight: 1 }}>★</span>
                  ))}
                </div>

                {/* Large decorative quote mark */}
                <div style={{ fontSize: '4.5rem', color: featured ? 'rgba(26,115,232,.3)' : 'rgba(255,255,255,.1)', lineHeight: .7, fontFamily: 'Georgia, serif', marginBottom: 12, userSelect: 'none', marginLeft: -4 }}>"</div>

                {/* Quote body */}
                <p style={{ margin: '0 0 28px', fontSize: '.9625rem', color: 'rgba(255,255,255,.87)', lineHeight: 1.72, letterSpacing: '-.005em' }}>
                  {quote}
                </p>

                {/* Divider */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: '.75rem',
                    flexShrink: 0,
                    boxShadow: `0 0 0 2px rgba(255,255,255,.1), 0 4px 14px ${color}55`,
                  }}>{avatar}</div>

                  {/* Author info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'white', marginBottom: 3 }}>{author}</div>
                    <div style={{ fontSize: '.77rem', color: 'rgba(255,255,255,.42)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{role}</span>
                      <span style={{ color: 'rgba(255,255,255,.18)' }}>·</span>
                      <span style={{ color: featured ? 'rgba(26,115,232,.8)' : 'rgba(255,255,255,.38)', fontWeight: 600 }}>{company}</span>
                    </div>
                  </div>

                  {/* Verified badge */}
                  <div style={{ flexShrink: 0, padding: '4px 11px', borderRadius: 999, background: 'rgba(52,168,83,.1)', border: '1px solid rgba(52,168,83,.25)', fontSize: '.65rem', fontWeight: 800, color: '#34a853', letterSpacing: '.05em', textTransform: 'uppercase' }}>
                    ✓ Verified
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust platform row */}
          <div style={{ marginTop: 72, paddingTop: 52, borderTop: '1px solid rgba(255,255,255,.06)', textAlign: 'center' }}>
            <p style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.25)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 24 }}>As featured on</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
              {['Product Hunt', 'Hacker News', 'Designer News', 'Indie Hackers'].map(p => (
                <span key={p} style={{ fontSize: '.925rem', color: 'rgba(255,255,255,.2)', fontWeight: 700, letterSpacing: '-.01em', transition: 'color 140ms', cursor: 'default' }}
                  onMouseOver={e => (e.currentTarget as HTMLSpanElement).style.color = 'rgba(255,255,255,.55)'}
                  onMouseOut={e => (e.currentTarget as HTMLSpanElement).style.color = 'rgba(255,255,255,.2)'}
                >{p}</span>
              ))}
            </div>
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
        >Get started free</button>
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
        <p style={{ margin: 0, fontSize: '.8125rem', color: 'rgba(255,255,255,.25)' }}>© 2026 Lucid Mail · Built with HCI</p>
      </footer>

      {showLogin && <LoginModal onSuccess={name => { setShowLogin(false); onLogin(name); }} onClose={() => setShowLogin(false)} />}

      <style>{`
        @keyframes pulse    { 0%,100%{opacity:1}  50%{opacity:.3}  }
        @keyframes spin     { to{transform:rotate(360deg)}          }
        @keyframes loginPop { from{opacity:0;transform:scale(.96) translateY(10px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}
