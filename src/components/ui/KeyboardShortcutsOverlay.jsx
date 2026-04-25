// HCI: S2 Enable Shortcuts — all keyboard shortcuts visible and learnable
// HCI: N6 Recognition over Recall — shortcuts displayed, not memorised
// HCI: P2 Von Restorff — shortcut keys visually distinct (chip style)
import React from 'react';
import { useUiStore } from '../../stores/uiStore';
import { IconClose } from './Icons';

const SHORTCUT_GROUPS = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['G', 'I'],      desc: 'Go to Inbox' },
      { keys: ['G', 'S'],      desc: 'Go to Sent' },
      { keys: ['G', 'D'],      desc: 'Go to Drafts' },
      { keys: ['G', 'A'],      desc: 'Go to All Mail' },
      { keys: ['G', 'T'],      desc: 'Go to Trash' },
      { keys: ['/'],           desc: 'Focus search' },
      { keys: ['?'],           desc: 'Keyboard shortcuts' },
    ],
  },
  {
    title: 'Compose',
    shortcuts: [
      { keys: ['C'],           desc: 'Compose new email' },
      { keys: ['Ctrl', 'Enter'], desc: 'Send email' },
    ],
  },
  {
    title: 'Email actions',
    shortcuts: [
      { keys: ['E'],           desc: 'Archive' },
      { keys: ['#'],           desc: 'Delete' },
      { keys: ['S'],           desc: 'Star / unstar' },
      { keys: ['Shift', 'U'], desc: 'Mark as unread' },
      { keys: ['Shift', 'I'], desc: 'Mark as read' },
      { keys: ['R'],           desc: 'Reply' },
      { keys: ['A'],           desc: 'Reply all' },
      { keys: ['F'],           desc: 'Forward' },
    ],
  },
  {
    title: 'Selection',
    shortcuts: [
      { keys: ['*', 'A'],      desc: 'Select all' },
      { keys: ['*', 'N'],      desc: 'Deselect all' },
      { keys: ['*', 'U'],      desc: 'Select unread' },
      { keys: ['*', 'S'],      desc: 'Select starred' },
    ],
  },
];

export function KeyboardShortcutsOverlay() {
  const { keyboardShortcutsVisible, setKeyboardShortcutsVisible } = useUiStore();
  if (!keyboardShortcutsVisible) return null;

  return (
    <div
      className="shortcut-overlay"
      onClick={e => { if (e.target === e.currentTarget) setKeyboardShortcutsVisible(false); }}
      role="presentation"
    >
      <div className="shortcut-dialog fade-up" role="dialog" aria-label="Keyboard shortcuts" aria-modal="true">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Keyboard shortcuts
          </h2>
          <button
            className="icon-btn"
            onClick={() => setKeyboardShortcutsVisible(false)}
            aria-label="Close"
            style={{ color: 'var(--text-muted)' }}
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {SHORTCUT_GROUPS.map(group => (
            <div key={group.title}>
              <p style={{ margin: '0 0 10px', fontSize: '.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                {group.title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.shortcuts.map(sc => (
                  <div key={sc.desc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ fontSize: '.8125rem', color: 'var(--text-secondary)' }}>{sc.desc}</span>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      {sc.keys.map((k, i) => (
                        <span key={i} className="shortcut-key">{k}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Press <span className="shortcut-key">Esc</span> to close</span>
          <button className="btn btn-ghost" onClick={() => setKeyboardShortcutsVisible(false)} style={{ fontSize: '.8125rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
