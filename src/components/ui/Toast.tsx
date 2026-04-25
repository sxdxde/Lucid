// HCI: S3 Informative Feedback — every major action shows a toast
// HCI: S5 Reversal — undo action available directly in toast
// HCI: N1 Visibility — toast position: bottom-left (standard location)
import React from 'react';
import { useUiStore } from '../../stores/uiStore';
import { useEmailStore } from '../../stores/emailStore';
import { IconClose, IconCheck } from './Icons';
import type { Toast as ToastType } from '../../types';

function ToastIcon({ type }: { type: string }) {
  if (type === 'success') return <IconCheck className="w-4 h-4" style={{ color: 'var(--success)' }} />;
  if (type === 'error') return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="10" cy="10" r="8" /><path d="M10 6v4M10 13h.01" />
    </svg>
  );
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="var(--brand-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="16" height="12" rx="2" /><path d="M2 7l8 5 8-5" />
    </svg>
  );
}

function Toast({ toast }: { toast: ToastType }) {
  const { dismissToast } = useUiStore();
  const { undoLastAction } = useEmailStore();

  const handleUndo = () => {
    undoLastAction();
    dismissToast(toast.id);
  };

  return (
    <div
      className={toast.exiting ? 'toast-exit' : 'toast-enter'}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px',
        background: 'var(--gray-900)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        minWidth: 260, maxWidth: 380,
        color: 'white',
      }}
      role="status"
      aria-live="polite"
    >
      <ToastIcon type={toast.type} />
      <span style={{ flex: 1, fontSize: '.875rem', fontWeight: 500 }}>{toast.message}</span>
      {toast.undoAction && (
        <button
          onClick={handleUndo}
          style={{
            fontSize: '.8125rem', fontWeight: 700, color: 'var(--brand-400)',
            background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
          }}
        >
          Undo
        </button>
      )}
      <button
        onClick={() => dismissToast(toast.id)}
        style={{
          width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 4, border: 'none', background: 'rgba(255,255,255,.1)',
          cursor: 'pointer', color: 'var(--gray-400)', flexShrink: 0,
        }}
        aria-label="Dismiss"
      >
        <IconClose className="w-3 h-3" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toastQueue } = useUiStore();
  return (
    <div
      style={{
        position: 'fixed', bottom: 24, left: 24, zIndex: 99999,
        display: 'flex', flexDirection: 'column-reverse', gap: 8,
        pointerEvents: 'none',
      }}
      aria-label="Notifications"
    >
      {toastQueue.map(t => (
        <div key={t.id} style={{ pointerEvents: 'all' }}>
          <Toast toast={t} />
        </div>
      ))}
    </div>
  );
}
