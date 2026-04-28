import React, { useState, useEffect, useRef } from 'react';

const GOOGLE_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#4285F4'];

interface Props {
  onComplete: () => void;
}

export function LoginLoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2200;

    const animate = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      // ease-in-out cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(eased * 100);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 480);
        }, 380);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'linear-gradient(135deg, #fdfaf5 0%, #f9f3e8 55%, #f0e6d0 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.48s ease-out',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* LUCID wordmark with left-to-right colour fill */}
      <div style={{ position: 'relative', display: 'inline-block', userSelect: 'none' }}>

        {/* Grey base layer */}
        <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
          {'LUCID'.split('').map((ch, i) => (
            <span key={i} style={{
              color: '#d0d2d6',
              fontWeight: 900,
              fontSize: '5.5rem',
              letterSpacing: '-.025em',
              lineHeight: 1,
            }}>{ch}</span>
          ))}
        </div>

        {/* Coloured fill layer — clipped to progress% width */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          overflow: 'hidden',
          width: `${progress}%`,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
            {'LUCID'.split('').map((ch, i) => (
              <span key={i} style={{
                color: GOOGLE_COLORS[i],
                fontWeight: 900,
                fontSize: '5.5rem',
                letterSpacing: '-.025em',
                lineHeight: 1,
              }}>{ch}</span>
            ))}
          </div>
        </div>
      </div>

      <p style={{
        marginTop: 20,
        fontSize: '0.875rem',
        color: '#9aa0a6',
        letterSpacing: '0.01em',
      }}>
        Loading your inbox…
      </p>

      {/* Rainbow progress bar */}
      <div style={{
        marginTop: 28,
        width: 220,
        height: 3,
        background: '#e8eaed',
        borderRadius: 999,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #4285F4 0%, #EA4335 35%, #FBBC04 65%, #34A853 100%)',
          borderRadius: 999,
          transition: 'width 16ms linear',
        }} />
      </div>
    </div>
  );
}
