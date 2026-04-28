// HCI: S2 Enable Shortcuts — all shortcuts visible and learnable
// HCI: N6 Recognition over Recall — shortcuts displayed, not memorised
// HCI: N9 Help & Documentation — FAQ and guide always one keystroke away
import React, { useState } from 'react';
import { useUiStore } from '../../stores/uiStore';
import { IconClose } from './Icons';

// ── Shortcut data ───────────────────────────────────────────────

interface ShortcutGroup {
  title: string;
  shortcuts: { keys: string[]; desc: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['G', 'I'],        desc: 'Go to Inbox' },
      { keys: ['G', 'S'],        desc: 'Go to Sent' },
      { keys: ['G', 'D'],        desc: 'Go to Drafts' },
      { keys: ['G', 'A'],        desc: 'Go to All Mail' },
      { keys: ['G', 'T'],        desc: 'Go to Trash' },
      { keys: ['/'],             desc: 'Focus search' },
      { keys: ['?'],             desc: 'Keyboard shortcuts' },
    ],
  },
  {
    title: 'Compose',
    shortcuts: [
      { keys: ['C'],             desc: 'Compose new email' },
      { keys: ['Ctrl', 'Enter'], desc: 'Send email' },
    ],
  },
  {
    title: 'Email actions',
    shortcuts: [
      { keys: ['E'],             desc: 'Archive' },
      { keys: ['#'],             desc: 'Delete' },
      { keys: ['S'],             desc: 'Star / unstar' },
      { keys: ['Shift', 'U'],    desc: 'Mark as unread' },
      { keys: ['Shift', 'I'],    desc: 'Mark as read' },
      { keys: ['R'],             desc: 'Reply' },
      { keys: ['A'],             desc: 'Reply all' },
      { keys: ['F'],             desc: 'Forward' },
    ],
  },
  {
    title: 'Selection',
    shortcuts: [
      { keys: ['*', 'A'],        desc: 'Select all' },
      { keys: ['*', 'N'],        desc: 'Deselect all' },
      { keys: ['*', 'U'],        desc: 'Select unread' },
      { keys: ['*', 'S'],        desc: 'Select starred' },
    ],
  },
];

// ── FAQ / Help data ─────────────────────────────────────────────

interface HelpSection {
  title: string;
  icon: string;
  items: { q: string; a: string }[];
}

const HELP_SECTIONS: HelpSection[] = [
  {
    title: 'Getting started',
    icon: '→',
    items: [
      { q: 'How do I compose a new email?', a: 'Press C anywhere in the app, or click the Compose button at the top of the sidebar. Multiple compose windows can be open side by side.' },
      { q: 'How do I search my emails?', a: 'Press / to jump straight to the search bar, or click it at the top of the screen. Search works across subject, sender, and body text.' },
      { q: 'How do I switch accounts?', a: 'Click your avatar in the top-right corner to see all connected accounts and switch between them instantly.' },
    ],
  },
  {
    title: 'Navigation',
    icon: '⇄',
    items: [
      { q: 'How do I get to different folders?', a: 'Use the sidebar on the left: Inbox, Starred, Sent, Drafts, Spam, and Trash are always listed. Or use keyboard shortcuts — G then I for Inbox, G then S for Sent, etc.' },
      { q: 'Can I collapse the sidebar?', a: 'Yes. Click the hamburger icon (≡) in the top-left, or use the drag handle on the sidebar edge to resize it to any width you like.' },
      { q: 'How do I preview an email without opening it?', a: 'Click any email row to open the preview panel on the right. Double-click or press Enter to open it in full detail view.' },
    ],
  },
  {
    title: 'Labels & organisation',
    icon: '⊞',
    items: [
      { q: 'How do I create a custom label?', a: 'Go to Settings → Tags and click "New label". Labels can have a custom colour and be drag-reordered in the sidebar.' },
      { q: 'Can an email have multiple labels?', a: 'Yes — apply as many labels as you like. The email appears in each label\'s filtered view without duplication.' },
      { q: 'What is the difference between archive and delete?', a: 'Archive removes an email from your inbox but keeps it in All Mail — it\'s searchable and recoverable. Delete moves it to Trash, where it is permanently removed after 30 days.' },
    ],
  },
  {
    title: 'Compose & sending',
    icon: '✉',
    items: [
      { q: 'Does Lucid autosave my drafts?', a: 'Yes — every 30 seconds automatically. If you close the compose window without sending, your draft is saved in the Drafts folder.' },
      { q: 'Can I undo sending an email?', a: 'Lucid\'s undo system goes further than Gmail\'s 30-second limit. Press Z at any time to undo the last action — including archives, deletes, and moves.' },
      { q: 'How do I add CC or BCC?', a: 'In the compose window, click "CC" or "BCC" next to the To field to reveal those fields.' },
    ],
  },
  {
    title: 'FAQ',
    icon: '?',
    items: [
      { q: 'How is Lucid different from Gmail?', a: 'Lucid uses the same three-column layout and keyboard shortcuts you know from Gmail, but every feature is grounded in HCI research — resizable panels, undo for every action, keyboard-first navigation, and a design system built for cognitive clarity.' },
      { q: 'Are my emails synced with my real Gmail account?', a: 'Lucid Mail is a research prototype demonstrating applied HCI principles. All data shown is simulated — no real email is sent or received.' },
      { q: 'How do I change the app theme or font size?', a: 'Open Settings → Appearance. You can switch between light and dark mode, choose display density (compact / comfortable / spacious), and adjust the zoom level.' },
      { q: 'Can I remap keyboard shortcuts?', a: 'Yes. Open Settings → Shortcuts to remap any action to a key of your choice. Press Reset to restore all defaults.' },
      { q: 'How do I report a bug or give feedback?', a: 'Use the Help & Docs panel (press ?) or visit the GitHub repository for Lucid Mail to open an issue.' },
    ],
  },
];

// ── Subcomponents ───────────────────────────────────────────────

function KeyChip({ k }: { k: string }) {
  return (
    <span className="shortcut-key">{k}</span>
  );
}

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: '1px solid var(--border)',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: '11px 0', cursor: 'pointer', display: 'flex',
          justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
        }}
      >
        <span style={{ fontSize: '.8375rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>{q}</span>
        <span style={{
          fontSize: '.75rem', color: 'var(--text-muted)', flexShrink: 0,
          transform: open ? 'rotate(90deg)' : 'none',
          transition: 'transform 160ms',
          display: 'inline-block',
          marginTop: 2,
        }}>›</span>
      </button>
      {open && (
        <p style={{
          margin: '0 0 12px',
          fontSize: '.8125rem', color: 'var(--text-secondary)', lineHeight: 1.65,
          animation: 'faqExpand .15s ease-out',
        }}>{a}</p>
      )}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────

interface KeyboardShortcutsOverlayProps {
  onEditShortcuts?: () => void;
  onOpenHelp?: () => void;
}

export function KeyboardShortcutsOverlay({ onEditShortcuts, onOpenHelp }: KeyboardShortcutsOverlayProps) {
  const { keyboardShortcutsVisible, setKeyboardShortcutsVisible } = useUiStore();
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'help'>('shortcuts');

  if (!keyboardShortcutsVisible) return null;

  const close = () => setKeyboardShortcutsVisible(false);

  return (
    <div
      className="shortcut-overlay"
      onClick={e => { if (e.target === e.currentTarget) close(); }}
      role="presentation"
    >
      <div
        className="shortcut-dialog fade-up"
        role="dialog"
        aria-label="Help and keyboard shortcuts"
        aria-modal="true"
        style={{ width: 640, maxWidth: '96vw', maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: '0 0 2px', fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Help &amp; Shortcuts
            </h2>
            <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--text-muted)' }}>
              Press <KeyChip k="Esc" /> to close
            </p>
          </div>
          <button className="icon-btn" onClick={close} aria-label="Close" style={{ color: 'var(--text-muted)', marginTop: -2 }}>
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        {/* ── Tab bar ── */}
        <div style={{
          display: 'flex',
          background: 'var(--gray-100)',
          borderRadius: 'var(--radius-md)',
          padding: 3,
          gap: 2,
          marginBottom: 20,
          flexShrink: 0,
        }}>
          {([['shortcuts', 'Keyboard Shortcuts'], ['help', 'Help & FAQ']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '.875rem',
                fontWeight: activeTab === id ? 600 : 400,
                background: activeTab === id ? 'white' : 'transparent',
                color: activeTab === id ? 'var(--brand-600)' : 'var(--text-muted)',
                boxShadow: activeTab === id ? '0 1px 3px rgba(0,0,0,.12)' : 'none',
                transition: 'all 150ms',
              }}
            >{label}</button>
          ))}
        </div>

        {/* ── Tab content (scrollable) ── */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>

          {activeTab === 'shortcuts' && (
            <>
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
                            {sc.keys.map((k, i) => <KeyChip key={i} k={k} />)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {onEditShortcuts && (
                    <button
                      onClick={() => { close(); onEditShortcuts(); }}
                      style={{
                        fontSize: '.8125rem', fontWeight: 600,
                        color: 'var(--brand-500)', background: 'none', border: 'none',
                        cursor: 'pointer', padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                        transition: 'background 120ms', display: 'flex', alignItems: 'center', gap: 5,
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--brand-50)'}
                      onMouseOut={e => e.currentTarget.style.background = 'none'}
                    >
                      <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13.5 3.5l3 3L7 16H4v-3L13.5 3.5z" />
                      </svg>
                      Edit shortcuts
                    </button>
                  )}
                </div>
                <button className="btn btn-ghost" onClick={close} style={{ fontSize: '.8125rem' }}>
                  Close
                </button>
              </div>
            </>
          )}

          {activeTab === 'help' && (
            <>
              {HELP_SECTIONS.map((section) => (
                <div key={section.title} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '.875rem', lineHeight: 1, color: 'var(--brand-500)', fontWeight: 700 }}>{section.icon}</span>
                    <p style={{ margin: 0, fontSize: '.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      {section.title}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    {section.items.map(item => (
                      <AccordionItem key={item.q} q={item.q} a={item.a} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Open full docs CTA */}
              <div style={{
                marginTop: 8,
                padding: '14px 18px',
                background: 'var(--brand-50)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '.875rem', fontWeight: 600, color: 'var(--brand-700)' }}>
                    Full documentation
                  </p>
                  <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--brand-600)', opacity: 0.8 }}>
                    In-depth guides, tips, and feature reference
                  </p>
                </div>
                {onOpenHelp && (
                  <button
                    onClick={() => { close(); onOpenHelp(); }}
                    style={{
                      padding: '9px 18px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: 'var(--brand-500)',
                      color: 'white',
                      fontSize: '.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'background 120ms',
                      flexShrink: 0,
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--brand-600)'}
                    onMouseOut={e => e.currentTarget.style.background = 'var(--brand-500)'}
                  >
                    Open full docs
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 10h10M12 6l4 4-4 4" />
                    </svg>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes faqExpand { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
