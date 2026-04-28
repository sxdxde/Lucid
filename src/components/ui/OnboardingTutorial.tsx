import React, { useState } from 'react';

// ── Slide illustrations ─────────────────────────────────────────

function IllustrationWelcome() {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      {/* Gmail side */}
      <rect x="8" y="20" width="88" height="100" rx="10" fill="#fff" stroke="#EA4335" strokeWidth="1.5"/>
      <rect x="18" y="32" width="68" height="8" rx="4" fill="#EA4335" opacity="0.2"/>
      <rect x="18" y="48" width="68" height="6" rx="3" fill="#dadce0"/>
      <rect x="18" y="60" width="50" height="6" rx="3" fill="#dadce0"/>
      <rect x="18" y="72" width="60" height="6" rx="3" fill="#dadce0"/>
      <rect x="18" y="84" width="45" height="6" rx="3" fill="#dadce0"/>
      <text x="52" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="#EA4335" fontFamily="Inter, sans-serif">Gmail</text>

      {/* Arrow */}
      <path d="M106 70 L114 70" stroke="#9aa0a6" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M111 66 L115 70 L111 74" stroke="#9aa0a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Lucid side */}
      <rect x="124" y="20" width="88" height="100" rx="10" fill="#fff" stroke="#1a73e8" strokeWidth="1.5"/>
      <rect x="134" y="32" width="68" height="8" rx="4" fill="#e8f0fe"/>
      {/* Colorful LUCID letters */}
      <text x="152" y="41" fontSize="9" fontWeight="900" fill="#4285F4" fontFamily="Inter, sans-serif">L</text>
      <text x="159" y="41" fontSize="9" fontWeight="900" fill="#EA4335" fontFamily="Inter, sans-serif">U</text>
      <text x="167" y="41" fontSize="9" fontWeight="900" fill="#FBBC04" fontFamily="Inter, sans-serif">C</text>
      <text x="174" y="41" fontSize="9" fontWeight="900" fill="#34A853" fontFamily="Inter, sans-serif">I</text>
      <text x="179" y="41" fontSize="9" fontWeight="900" fill="#4285F4" fontFamily="Inter, sans-serif">D</text>
      <rect x="134" y="48" width="68" height="6" rx="3" fill="#e8f0fe"/>
      <rect x="134" y="60" width="50" height="6" rx="3" fill="#e8f0fe"/>
      <rect x="134" y="72" width="60" height="6" rx="3" fill="#e8f0fe"/>
      <rect x="134" y="84" width="45" height="6" rx="3" fill="#e8f0fe"/>
      {/* Sparkle */}
      <circle cx="196" cy="28" r="5" fill="#FBBC04" opacity="0.8"/>
      <text x="196" y="31" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">+</text>
      <text x="168" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1a73e8" fontFamily="Inter, sans-serif">Lucid</text>
    </svg>
  );
}

function IllustrationLayout() {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      {/* App frame */}
      <rect x="10" y="10" width="200" height="120" rx="8" fill="#f1f3f4" stroke="#dadce0" strokeWidth="1"/>
      {/* Topbar */}
      <rect x="10" y="10" width="200" height="22" rx="8" fill="#fff" stroke="#dadce0" strokeWidth="1"/>
      <rect x="10" y="28" width="200" height="4" fill="#fff"/>
      <rect x="18" y="17" width="24" height="8" rx="4" fill="#4285F4" opacity="0.15"/>
      <rect x="50" y="17" width="80" height="8" rx="4" fill="#f1f3f4"/>
      <circle cx="190" cy="21" r="6" fill="#e8eaed"/>
      {/* Sidebar */}
      <rect x="10" y="32" width="46" height="98" rx="0" fill="#fff" stroke="#e8eaed" strokeWidth="0.5"/>
      <rect x="10" y="116" width="46" height="14" rx="0" fill="#fff"/>
      <rect x="16" y="40" width="34" height="6" rx="3" fill="#e8f0fe"/>
      <rect x="16" y="52" width="28" height="5" rx="2.5" fill="#f1f3f4"/>
      <rect x="16" y="63" width="30" height="5" rx="2.5" fill="#f1f3f4"/>
      <rect x="16" y="74" width="24" height="5" rx="2.5" fill="#f1f3f4"/>
      <rect x="16" y="85" width="32" height="5" rx="2.5" fill="#f1f3f4"/>
      {/* Email list */}
      <rect x="56" y="32" width="80" height="98" rx="0" fill="#fafafa" stroke="#e8eaed" strokeWidth="0.5"/>
      <rect x="56" y="116" width="80" height="14" rx="0" fill="#fafafa"/>
      {[0,1,2,3,4].map(i => (
        <g key={i}>
          <rect x="62" y={40 + i * 18} width="68" height="14" rx="3" fill={i === 1 ? '#e8f0fe' : '#fff'} stroke="#e8eaed" strokeWidth="0.5"/>
          <rect x="66" y={44 + i * 18} width="20" height="4" rx="2" fill={i === 1 ? '#4285F4' : '#dadce0'} opacity={i === 1 ? 0.6 : 1}/>
          <rect x="66" y={50 + i * 18} width="40" height="3" rx="1.5" fill="#e8eaed"/>
        </g>
      ))}
      {/* Detail panel */}
      <rect x="136" y="32" width="74" height="98" rx="0" fill="#fff"/>
      <rect x="142" y="42" width="60" height="6" rx="3" fill="#202124" opacity="0.15"/>
      <rect x="142" y="54" width="40" height="4" rx="2" fill="#dadce0"/>
      <rect x="142" y="66" width="58" height="4" rx="2" fill="#e8eaed"/>
      <rect x="142" y="74" width="52" height="4" rx="2" fill="#e8eaed"/>
      <rect x="142" y="82" width="55" height="4" rx="2" fill="#e8eaed"/>
      {/* Labels */}
      <text x="29" y="136" textAnchor="middle" fontSize="7" fill="#9aa0a6" fontFamily="Inter, sans-serif">Labels</text>
      <text x="96" y="136" textAnchor="middle" fontSize="7" fill="#9aa0a6" fontFamily="Inter, sans-serif">Inbox</text>
      <text x="173" y="136" textAnchor="middle" fontSize="7" fill="#9aa0a6" fontFamily="Inter, sans-serif">Detail</text>
    </svg>
  );
}

function IllustrationShortcuts() {
  const keys = [
    { key: 'C', label: 'Compose', color: '#4285F4' },
    { key: 'E', label: 'Archive', color: '#34A853' },
    { key: 'Z', label: 'Undo',    color: '#EA4335' },
    { key: '/', label: 'Search',  color: '#FBBC04' },
  ];
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      {/* Keyboard base */}
      <rect x="10" y="50" width="200" height="70" rx="10" fill="#f8f9fa" stroke="#dadce0" strokeWidth="1.5"/>
      {/* Key rows */}
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <rect key={i} x={18 + i * 19} y="60" width="15" height="13" rx="3" fill="#fff" stroke="#e8eaed" strokeWidth="0.8"/>
      ))}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <rect key={i} x={22 + i * 19} y="78" width="15" height="13" rx="3" fill="#fff" stroke="#e8eaed" strokeWidth="0.8"/>
      ))}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x={26 + i * 19} y="96" width="15" height="13" rx="3" fill="#fff" stroke="#e8eaed" strokeWidth="0.8"/>
      ))}
      {/* Highlighted shortcut keys */}
      {keys.map((k, i) => {
        const positions = [
          {x: 18 + 2 * 19, y: 78}, // C → index 2 of row 2
          {x: 22 + 3 * 19, y: 60}, // E → index 4 of row 1
          {x: 26 + 5 * 19, y: 96}, // Z → index 5 of row 3
          {x: 18 + 8 * 19, y: 60}, // /
        ];
        const pos = positions[i];
        return (
          <g key={k.key}>
            <rect x={pos.x} y={pos.y} width="15" height="13" rx="3" fill={k.color} opacity="0.9"/>
            <text x={pos.x + 7.5} y={pos.y + 9} textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff" fontFamily="Inter, sans-serif">{k.key}</text>
          </g>
        );
      })}
      {/* Labels above */}
      {keys.map((k, i) => {
        const labelPositions = [
          {x: 48, y: 42},
          {x: 96, y: 28},
          {x: 144, y: 42},
          {x: 192, y: 28},
        ];
        const pos = labelPositions[i];
        return (
          <g key={k.key}>
            <rect x={pos.x - 20} y={pos.y - 10} width="40" height="14" rx="7" fill={k.color} opacity="0.12"/>
            <text x={pos.x} y={pos.y} textAnchor="middle" fontSize="8" fontWeight="700" fill={k.color} fontFamily="Inter, sans-serif">{k.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function IllustrationUndo() {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      {/* Toast notification */}
      <rect x="30" y="20" width="160" height="44" rx="10" fill="#202124" opacity="0.92"/>
      <text x="70" y="47" fontSize="11" fill="#fff" fontFamily="Inter, sans-serif">Email archived</text>
      <rect x="143" y="30" width="38" height="24" rx="6" fill="#4285F4"/>
      <text x="162" y="46" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">Undo</text>

      {/* Gmail comparison */}
      <rect x="20" y="82" width="80" height="42" rx="8" fill="#fff" stroke="#EA4335" strokeWidth="1"/>
      <text x="60" y="97" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#EA4335" fontFamily="Inter, sans-serif">Gmail</text>
      <text x="60" y="110" textAnchor="middle" fontSize="6.5" fill="#5f6368" fontFamily="Inter, sans-serif">30 sec only</text>
      <rect x="60" y="115" width="0" height="4" rx="2" fill="#EA4335"/>
      {/* Progress bar */}
      <rect x="26" y="115" width="68" height="4" rx="2" fill="#f1f3f4"/>
      <rect x="26" y="115" width="22" height="4" rx="2" fill="#EA4335" opacity="0.5"/>

      {/* Lucid comparison */}
      <rect x="120" y="82" width="80" height="42" rx="8" fill="#fff" stroke="#4285F4" strokeWidth="1"/>
      <text x="160" y="97" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#4285F4" fontFamily="Inter, sans-serif">Lucid</text>
      <text x="160" y="110" textAnchor="middle" fontSize="6.5" fill="#5f6368" fontFamily="Inter, sans-serif">Anytime, anywhere</text>
      {/* Infinity symbol */}
      <text x="160" y="120" textAnchor="middle" fontSize="9" fill="#34A853" fontFamily="Inter, sans-serif">∞</text>

      {/* VS divider */}
      <text x="110" y="107" textAnchor="middle" fontSize="8" fontWeight="800" fill="#9aa0a6" fontFamily="Inter, sans-serif">vs</text>
    </svg>
  );
}

function IllustrationReady() {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      {/* Big check circle */}
      <circle cx="110" cy="65" r="40" fill="#34A853" opacity="0.1"/>
      <circle cx="110" cy="65" r="32" fill="#34A853" opacity="0.15"/>
      <circle cx="110" cy="65" r="24" fill="#34A853"/>
      <path d="M98 65 L106 73 L122 57" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Sparkles */}
      <circle cx="62" cy="38" r="4" fill="#FBBC04" opacity="0.8"/>
      <circle cx="158" cy="38" r="3" fill="#4285F4" opacity="0.7"/>
      <circle cx="70" cy="95" r="3" fill="#EA4335" opacity="0.6"/>
      <circle cx="150" cy="98" r="4" fill="#34A853" opacity="0.7"/>
      <circle cx="48" cy="65" r="2.5" fill="#FBBC04" opacity="0.5"/>
      <circle cx="172" cy="65" r="2.5" fill="#4285F4" opacity="0.5"/>
      {/* Hint text */}
      <rect x="70" y="112" width="80" height="18" rx="9" fill="#f1f3f4"/>
      <text x="110" y="124" textAnchor="middle" fontSize="8" fill="#5f6368" fontFamily="Inter, sans-serif">Press ? for shortcuts</text>
    </svg>
  );
}

// ── Slide data ──────────────────────────────────────────────────

const SLIDES = [
  {
    Illustration: IllustrationWelcome,
    title: 'Welcome to Lucid',
    gmailLabel: 'What\'s the same',
    lucidLabel: 'What\'s better',
    rows: [
      { same: 'Three-column inbox layout',        better: 'Resizable panels to fit your flow'   },
      { same: 'Labels & folders',                 better: 'Drag-to-reorder, colour-coded tags'  },
      { same: 'Compose window',                   better: 'Multiple compose windows at once'    },
      { same: 'Keyboard shortcut C to compose',   better: 'Every action has a shortcut'         },
    ],
  },
  {
    Illustration: IllustrationLayout,
    title: 'Familiar layout — no learning curve',
    body: 'Labels on the left, email list in the middle, detail panel on the right. The three-column layout you already know. Start reading your inbox the moment you log in.',
  },
  {
    Illustration: IllustrationShortcuts,
    title: 'Keyboard shortcuts on steroids',
    body: 'Press C to compose, E to archive, Z to undo, and / to search — all without touching your mouse. Open the shortcuts overlay any time by pressing ? to discover more.',
  },
  {
    Illustration: IllustrationUndo,
    title: 'Undo anything, anytime',
    body: 'Gmail gives you 30 seconds to undo a send. Lucid lets you reverse archives, deletes, moves — anything — with a single keypress, long after the action happened.',
  },
  {
    Illustration: IllustrationReady,
    title: 'You\'re all set!',
    body: 'Your inbox is ready. Explore smart labels, AI-powered replies, dark mode, and more. Press ? at any time to see the full keyboard shortcut reference.',
  },
];

// ── Main component ──────────────────────────────────────────────

const ONBOARDING_KEY = 'lucid_onboarded_v1';

export function OnboardingTutorial({ onClose }: { onClose: () => void }) {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const isLast  = slide === SLIDES.length - 1;

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    onClose();
  };

  const handleNext = () => {
    if (isLast) handleClose();
    else setSlide(s => s + 1);
  };

  return (
    /* Blurred backdrop */
    <div style={{
      position: 'fixed', inset: 0, zIndex: 900,
      background: 'rgba(20, 20, 30, 0.55)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      animation: 'onboardingFadeIn .32s ease-out',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        width: '100%',
        maxWidth: 520,
        boxShadow: '0 32px 80px rgba(0,0,0,.28)',
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, sans-serif",
        animation: 'onboardingSlideUp .32s cubic-bezier(.22,1,.36,1)',
      }}>
        {/* Illustration area */}
        <div style={{
          background: 'linear-gradient(135deg, #fdfaf5 0%, #f0e8d8 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '32px 0 24px',
          position: 'relative',
        }}>
          <current.Illustration />

          {/* Skip button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute', top: 14, right: 16,
              background: 'rgba(0,0,0,0.07)', border: 'none', borderRadius: 99,
              padding: '4px 12px', fontSize: '.75rem', color: '#5f6368',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
            }}
          >Skip</button>

          {/* Slide counter */}
          <div style={{
            position: 'absolute', top: 16, left: 20,
            fontSize: '.7rem', color: '#9aa0a6', fontWeight: 600,
          }}>{slide + 1} / {SLIDES.length}</div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 32px 8px' }}>
          <h2 style={{
            margin: '0 0 12px',
            fontSize: '1.25rem', fontWeight: 800,
            color: '#202124', letterSpacing: '-.025em',
          }}>{current.title}</h2>

          {'body' in current && (
            <p style={{ margin: 0, fontSize: '.9rem', color: '#5f6368', lineHeight: 1.65 }}>
              {current.body}
            </p>
          )}

          {'rows' in current && (
            <div style={{ display: 'flex', gap: 12 }}>
              {/* Same column */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.7rem', fontWeight: 700, color: '#EA4335', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
                  {current.gmailLabel}
                </div>
                {current.rows.map((r, i) => (
                  <div key={i} style={{
                    fontSize: '.8rem', color: '#5f6368', lineHeight: 1.5,
                    padding: '5px 0', borderBottom: i < current.rows.length - 1 ? '1px solid #f1f3f4' : 'none',
                  }}>{r.same}</div>
                ))}
              </div>
              {/* Divider */}
              <div style={{ width: 1, background: '#e8eaed', flexShrink: 0 }} />
              {/* Better column */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.7rem', fontWeight: 700, color: '#34A853', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
                  {current.lucidLabel}
                </div>
                {current.rows.map((r, i) => (
                  <div key={i} style={{
                    fontSize: '.8rem', color: '#202124', lineHeight: 1.5, fontWeight: 500,
                    padding: '5px 0', borderBottom: i < current.rows.length - 1 ? '1px solid #f1f3f4' : 'none',
                  }}>{r.better}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ padding: '20px 32px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: 6 }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                style={{
                  width: i === slide ? 20 : 7,
                  height: 7, borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: i === slide ? '#1a73e8' : '#e8eaed',
                  transition: 'all 200ms ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Prev / Next buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {slide > 0 && (
              <button
                onClick={() => setSlide(s => s - 1)}
                style={{
                  padding: '10px 20px', borderRadius: 10,
                  border: '1.5px solid #e8eaed', background: 'transparent',
                  color: '#5f6368', fontSize: '.875rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Back</button>
            )}
            <button
              onClick={handleNext}
              style={{
                padding: '10px 24px', borderRadius: 10,
                border: 'none',
                background: isLast ? '#34A853' : '#1a73e8',
                color: '#fff', fontSize: '.875rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: isLast ? '0 4px 14px rgba(52,168,83,.32)' : '0 4px 14px rgba(26,115,232,.28)',
                transition: 'background 150ms',
              }}
            >{isLast ? 'Start using Lucid' : 'Next'}</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes onboardingFadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes onboardingSlideUp  { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}

export function shouldShowOnboarding(): boolean {
  return !localStorage.getItem(ONBOARDING_KEY);
}
