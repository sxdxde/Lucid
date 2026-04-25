// HCI: G7 Figure & Ground — modal dim + blur creates clear separation
// HCI: N3 User Control — ESC to dismiss, cancel always available
// HCI: S4 Closure — modal has a clear title and completion state
import React, { useEffect, useRef } from 'react';
import { IconClose } from './Icons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const widths: Record<string, number> = { sm: 380, md: 500, lg: 660 };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9990,
        background: 'rgba(0,0,0,.35)',
        backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="fade-up"
        style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          width: '100%', maxWidth: widths[size] || widths.md,
          maxHeight: '85vh',
          display: 'flex', flexDirection: 'column',
          outline: 'none',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px 16px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h2>
          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close dialog"
            style={{ color: 'var(--text-muted)' }}
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 22px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
