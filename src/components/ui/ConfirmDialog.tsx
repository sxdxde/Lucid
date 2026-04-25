// HCI: N5 Error Prevention — confirm before destructive actions
// HCI: L3 Fitts' Law — destructive button smaller than cancel (reversed Fitts)
// HCI: G7 Figure & Ground — overlay separates dialog from content
import React from 'react';
import { useUiStore } from '../../stores/uiStore';

export function ConfirmDialog() {
  const { confirmDialog, hideConfirmDialog } = useUiStore();
  if (!confirmDialog) return null;

  const { title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, dangerous = false } = confirmDialog;

  const handleConfirm = () => {
    onConfirm?.();
    hideConfirmDialog();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      role="presentation"
    >
      <div
        className="fade-up"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        style={{
          background: 'white', borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)', width: '100%', maxWidth: 400,
          padding: '24px', display: 'flex', flexDirection: 'column', gap: 16,
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h2>
        {message && <p style={{ margin: 0, fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{message}</p>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={hideConfirmDialog}>{cancelLabel}</button>
          <button
            className="btn"
            style={{
              background: dangerous ? 'var(--danger)' : 'var(--brand-500)',
              color: 'white',
            }}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
