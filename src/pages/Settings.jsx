// HCI: N7 Flexibility — all preferences visible and reachable from one place
// HCI: S3 Feedback — changes apply instantly (no Save button)
// HCI: W6 Simplicity — tab navigation groups by goal, not technical category
// HCI: S7 Locus of Control — user controls every aspect of their experience
// HCI: G3 Proximity — related settings grouped together with whitespace
// HCI: P1 Aesthetic Usability — generous whitespace, clean typographic hierarchy
import React, { useState, useEffect, useRef } from 'react';
import {
  IconArrowLeft, IconCheck, IconLogOut, IconKeyboard, IconClose,
} from '../components/ui/Icons';
import { useUiStore } from '../stores/uiStore';
import { useEmailStore } from '../stores/emailStore';
import { useAccountStore } from '../stores/accountStore';
import { Avatar } from '../components/ui/Avatar';
import { SHORTCUT_DEFS } from '../hooks/useKeyboard';

// ── Inline SVG icons for settings tabs ──────────────────────
function IconPalette({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <circle cx="7"  cy="8"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="13" cy="8"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="10" cy="13" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconBellS({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2a6 6 0 016 6c0 2.5.5 4 2 5H2c1.5-1 2-2.5 2-5a6 6 0 016-6z" />
      <path d="M8.5 17a1.5 1.5 0 003 0" />
    </svg>
  );
}
function IconUser({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="7" r="4" />
      <path d="M2 18a8 8 0 0116 0" />
    </svg>
  );
}
function IconPen({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 3.5l3 3L7 16H4v-3L13.5 3.5z" />
    </svg>
  );
}

// ── Reusable sub-components ──────────────────────────────────
function ToggleSwitch({ value, onChange, label, id }) {
  return (
    <button
      role="switch"
      id={id}
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={`toggle-track${value ? ' toggle-track--on' : ''}`}
    >
      <span className="toggle-thumb" />
    </button>
  );
}

function SettingsRow({ label, description, children, htmlFor }) {
  return (
    <div className="settings-row">
      <label htmlFor={htmlFor} style={{ flex: 1, minWidth: 0, cursor: htmlFor ? 'pointer' : 'default' }}>
        <p style={{ margin: 0, fontSize: '.9375rem', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</p>
        {description && <p style={{ margin: '4px 0 0', fontSize: '.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{description}</p>}
      </label>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', padding: 3, gap: 2 }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '.8125rem',
            fontWeight: 500,
            transition: 'all 140ms',
            background: value === opt.value ? 'white' : 'transparent',
            color: value === opt.value ? 'var(--brand-600)' : 'var(--text-muted)',
            boxShadow: value === opt.value ? '0 1px 3px rgba(0,0,0,.12)' : 'none',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Shortcut key badge — click to remap ─────────────────────
function ShortcutBadge({ value, onRemap }) {
  const [listening, setListening] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!listening) return;
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Escape') { setListening(false); return; }
      // Accept printable single chars or # / special
      const k = e.key.length === 1 ? e.key.toLowerCase() : null;
      if (k) { onRemap(k); setListening(false); }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [listening]);

  useEffect(() => {
    if (listening) ref.current?.focus();
  }, [listening]);

  const display = value.length <= 2 ? value.toUpperCase() : value.split('').map(c => c.toUpperCase()).join(' + ');

  return (
    <button
      ref={ref}
      onClick={() => setListening(l => !l)}
      title={listening ? 'Press a new key… (Esc to cancel)' : 'Click to remap'}
      style={{
        padding: '3px 10px',
        borderRadius: 'var(--radius-xs)',
        border: `1.5px solid ${listening ? 'var(--brand-500)' : 'var(--gray-200)'}`,
        background: listening ? 'var(--brand-50)' : 'var(--gray-25)',
        color: listening ? 'var(--brand-600)' : 'var(--text-primary)',
        fontSize: '.75rem',
        fontWeight: 700,
        letterSpacing: '.06em',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        transition: 'all 120ms',
        minWidth: 32,
        textAlign: 'center',
        outline: 'none',
      }}
      aria-label={`Current shortcut: ${display}. Click to change.`}
    >
      {listening ? '…' : display}
    </button>
  );
}

function IconTag({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h6l8 8-6 6-8-8V3z" />
      <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── Tab definitions ──────────────────────────────────────────
const TABS = [
  { id: 'appearance',    label: 'Appearance',    Icon: IconPalette },
  { id: 'notifications', label: 'Notifications', Icon: IconBellS   },
  { id: 'shortcuts',     label: 'Shortcuts',     Icon: () => <IconKeyboard className="w-5 h-5" /> },
  { id: 'tags',          label: 'Tags',          Icon: IconTag     },
  { id: 'accounts',      label: 'Accounts',      Icon: IconUser    },
  { id: 'signature',     label: 'Signature',     Icon: IconPen     },
];

const SHORTCUT_CATEGORIES = [...new Set(SHORTCUT_DEFS.map(s => s.category))];

// ── Tab panels ───────────────────────────────────────────────
function OptionCard({ label, desc, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '20px 16px',
        borderRadius: 'var(--radius-lg)',
        border: `2px solid ${active ? 'var(--brand-500)' : 'var(--border)'}`,
        background: active ? 'var(--brand-50)' : 'var(--surface)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 150ms',
      }}
    >
      <p style={{ margin: '0 0 4px', fontSize: '.875rem', fontWeight: 600, color: active ? 'var(--brand-600)' : 'var(--text-primary)' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--text-muted)' }}>{desc}</p>
      {active && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--brand-600)' }}>
          <IconCheck className="w-3.5 h-3.5" />
          <span style={{ fontSize: '.75rem', fontWeight: 600 }}>Active</span>
        </div>
      )}
    </button>
  );
}

function AppearanceTab({ pref, setPreference }) {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <h3 style={sectionTitle}>Theme</h3>
        <p style={{ ...sectionDesc, marginBottom: 20 }}>Choose between light and dark appearance.</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <OptionCard label="Light" desc="White background, dark text" active={pref.theme === 'light'} onClick={() => setPreference('theme', 'light')} />
          <OptionCard label="Dark" desc="Dark background, light text" active={pref.theme === 'dark'} onClick={() => setPreference('theme', 'dark')} />
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h3 style={sectionTitle}>Display density</h3>
        <p style={{ ...sectionDesc, marginBottom: 20 }}>Controls how much vertical space each email row occupies.</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <OptionCard label="Compact" desc="More emails visible at once" active={pref.density === 'compact'} onClick={() => setPreference('density', 'compact')} />
          <OptionCard label="Default" desc="Balanced spacing" active={pref.density === 'comfortable'} onClick={() => setPreference('density', 'comfortable')} />
          <OptionCard label="Spacious" desc="Maximum breathing room" active={pref.density === 'spacious'} onClick={() => setPreference('density', 'spacious')} />
        </div>
      </div>

      <div>
        <h3 style={sectionTitle}>Interface size</h3>
        <p style={{ ...sectionDesc, marginBottom: 20 }}>Scales the entire UI — icons, text, and spacing all adjust proportionally.</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <OptionCard label="Small" desc="Compact, more content fits" active={pref.zoom === 'small'} onClick={() => setPreference('zoom', 'small')} />
          <OptionCard label="Default" desc="Standard size (recommended)" active={!pref.zoom || pref.zoom === 'default'} onClick={() => setPreference('zoom', 'default')} />
          <OptionCard label="Large" desc="Larger text and controls" active={pref.zoom === 'large'} onClick={() => setPreference('zoom', 'large')} />
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [notif, setNotif] = useState({ inbox: true, mentioned: true, quietHours: false, sounds: false });
  const toggle = (k) => setNotif(n => ({ ...n, [k]: !n[k] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <h3 style={sectionTitle}>Email notifications</h3>
      <p style={{ ...sectionDesc, marginBottom: 28 }}>Control which events trigger browser notifications.</p>

      {[
        { key: 'inbox',      label: 'New mail in Inbox',    desc: 'Show a notification for incoming emails' },
        { key: 'mentioned',  label: 'When mentioned',       desc: 'Notify when your name appears in an email' },
        { key: 'quietHours', label: 'Quiet hours',          desc: 'Silence all notifications from 10 PM – 8 AM' },
        { key: 'sounds',     label: 'Notification sounds',  desc: 'Play a sound when a new email arrives' },
      ].map(item => (
        <SettingsRow key={item.key} label={item.label} description={item.desc} htmlFor={`notif-${item.key}`}>
          <ToggleSwitch id={`notif-${item.key}`} value={notif[item.key]} onChange={() => toggle(item.key)} label={item.label} />
        </SettingsRow>
      ))}
    </div>
  );
}

function ShortcutsTab({ pref, setPreference, resetShortcuts }) {
  const sc = pref.customShortcuts ?? {};
  const { setCustomShortcut } = useUiStore();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
        <div>
          <h3 style={{ ...sectionTitle, marginBottom: 6 }}>Keyboard shortcuts</h3>
          <p style={sectionDesc}>Click any key badge to remap it. Press the new key — changes save instantly.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <SettingsRow label="Enable shortcuts" htmlFor="sc-toggle">
            <ToggleSwitch
              id="sc-toggle"
              value={pref.keyboardShortcutsEnabled}
              onChange={v => setPreference('keyboardShortcutsEnabled', v)}
              label="Enable keyboard shortcuts"
            />
          </SettingsRow>
          <button
            onClick={resetShortcuts}
            style={{ fontSize: '.75rem', color: 'var(--brand-600)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            Reset to defaults
          </button>
        </div>
      </div>

      {SHORTCUT_CATEGORIES.map(cat => (
        <div key={cat} style={{ marginBottom: 32 }}>
          <p style={{ margin: '0 0 12px', fontSize: '.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            {cat}
          </p>
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {SHORTCUT_DEFS.filter(s => s.category === cat).map((def, i, arr) => (
              <div
                key={def.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  background: i % 2 === 0 ? 'white' : 'var(--gray-25)',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--gray-100)' : 'none',
                }}
              >
                <span style={{ fontSize: '.875rem', color: 'var(--text-secondary)' }}>{def.description}</span>
                <ShortcutBadge
                  value={sc[def.id] ?? def.defaultKey}
                  onRemap={newKey => setCustomShortcut(def.id, newKey)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Tags (custom labels) tab ─────────────────────────────────
const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#0891b2', '#059669', '#d97706', '#7c3aed',
];

function TagsTab() {
  const { customLabels, createLabel, deleteLabel } = useEmailStore();
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState('#3b82f6');
  const [error, setError] = React.useState('');

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('Tag name is required.'); return; }
    if (customLabels.some(l => l.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('A tag with this name already exists.');
      return;
    }
    createLabel({ id: `tag-${Date.now()}`, name: trimmed, color, system: false });
    setName('');
    setError('');
  };

  return (
    <div>
      <h3 style={sectionTitle}>Tags</h3>
      <p style={{ ...sectionDesc, marginBottom: 28 }}>
        Tags help you organise emails by topic. They appear in the sidebar and on email rows.
        Delete removes the tag — emails keep their other labels.
      </p>

      {/* Create new tag form */}
      <div style={{
        padding: '24px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 28,
      }}>
        <p style={{ margin: '0 0 16px', fontSize: '.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Create a new tag
        </p>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <input
              type="text"
              placeholder="Tag name — e.g. Work, Finance"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
              style={{
                width: '100%', padding: '10px 14px', fontSize: '.875rem',
                border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)', outline: 'none',
                fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
                background: 'var(--surface)', transition: 'border-color 120ms',
              }}
              onFocus={e => { if (!error) e.target.style.borderColor = 'var(--brand-500)'; }}
              onBlur={e => { if (!error) e.target.style.borderColor = 'var(--border)'; }}
              aria-label="Tag name"
            />
            {error && <p style={{ margin: '6px 0 0', fontSize: '.75rem', color: 'var(--danger)' }}>{error}</p>}
          </div>

          <button
            onClick={handleCreate}
            style={{
              padding: '10px 20px', borderRadius: 'var(--radius-md)',
              background: 'var(--brand-500)', color: 'white',
              border: 'none', cursor: 'pointer', fontSize: '.875rem', fontWeight: 600,
              transition: 'background 120ms', flexShrink: 0,
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--brand-600)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--brand-500)'; }}
          >
            Create tag
          </button>
        </div>

        {/* Color picker */}
        <div style={{ marginTop: 16 }}>
          <p style={{ margin: '0 0 8px', fontSize: '.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Choose a color
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 28, height: 28, borderRadius: '50%', background: c,
                  border: color === c ? `3px solid var(--gray-800)` : '3px solid transparent',
                  cursor: 'pointer', transition: 'all 100ms', outline: 'none',
                  boxShadow: color === c ? `0 0 0 2px ${c}` : 'none',
                }}
                aria-label={`Color ${c}`}
                aria-pressed={color === c}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        {name.trim() && (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--text-muted)' }}>Preview:</p>
            <span style={{
              padding: '3px 12px', borderRadius: 'var(--radius-pill)',
              background: `${color}18`, color, border: `1px solid ${color}40`,
              fontSize: '.75rem', fontWeight: 600,
            }}>
              {name.trim()}
            </span>
          </div>
        )}
      </div>

      {/* Existing tags */}
      {customLabels.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '.875rem' }}>
          No tags yet — create your first tag above.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {customLabels.map(label => (
            <div key={label.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 20px', background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xs)',
            }}>
              <span style={{
                width: 12, height: 12, borderRadius: '50%',
                background: label.color, flexShrink: 0,
              }} />
              <span style={{
                padding: '3px 12px', borderRadius: 'var(--radius-pill)',
                background: `${label.color}18`, color: label.color,
                border: `1px solid ${label.color}40`,
                fontSize: '.8125rem', fontWeight: 600,
              }}>
                {label.name}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '.75rem', color: 'var(--text-muted)' }}>
                {label.color}
              </span>
              <button
                onClick={() => deleteLabel(label.id)}
                style={{
                  padding: '5px 12px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--danger)', fontSize: '.75rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 120ms',
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#fff5f4'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                aria-label={`Delete tag ${label.name}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountsTab({ accounts, signOutAccount }) {
  return (
    <div>
      <h3 style={sectionTitle}>Signed-in accounts</h3>
      <p style={{ ...sectionDesc, marginBottom: 28 }}>Manage the email accounts connected to Lucid.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {accounts.map(acc => (
          <div key={acc.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '20px 24px',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xs)',
          }}>
            <Avatar person={acc} size="lg" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ margin: 0, fontSize: '.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{acc.name}</p>
                {acc.isPrimary && (
                  <span style={{
                    padding: '1px 8px', borderRadius: 'var(--radius-pill)',
                    background: 'var(--brand-50)', color: 'var(--brand-600)',
                    fontSize: '.6875rem', fontWeight: 700, letterSpacing: '.04em',
                  }}>Primary</span>
                )}
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '.8125rem', color: 'var(--text-muted)' }}>{acc.email}</p>
            </div>
            <button
              onClick={() => signOutAccount(acc.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', fontSize: '.8125rem', fontWeight: 600,
                color: 'var(--danger)', background: '#fff5f4',
                border: '1.5px solid #fecaca', borderRadius: 'var(--radius-md)',
                cursor: 'pointer', transition: 'all 120ms', flexShrink: 0,
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#fde8e8'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#fff5f4'; }}
              aria-label={`Sign out of ${acc.name}`}
            >
              <IconLogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignatureTab() {
  const [signature, setSignature] = useState('');
  return (
    <div>
      <h3 style={sectionTitle}>Email signature</h3>
      <p style={{ ...sectionDesc, marginBottom: 28 }}>Automatically appended to the bottom of every email you send.</p>

      <textarea
        value={signature}
        onChange={e => setSignature(e.target.value)}
        rows={6}
        placeholder="Write your email signature here…&#10;&#10;e.g.  Sudarshan Sudhakar&#10;       sudarshan@email.com"
        style={{
          width: '100%',
          padding: '16px 18px',
          fontSize: '.9375rem',
          background: 'white',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--text-primary)',
          outline: 'none',
          fontFamily: 'var(--font-sans)',
          lineHeight: 1.7,
          resize: 'vertical',
          transition: 'border-color 120ms',
          boxShadow: 'var(--shadow-xs)',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--brand-500)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
        aria-label="Email signature"
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--text-muted)' }}>Changes are saved automatically.</p>
        {signature && (
          <button
            onClick={() => setSignature('')}
            style={{ fontSize: '.75rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <IconClose className="w-3 h-3" /> Clear signature
          </button>
        )}
      </div>
    </div>
  );
}

// ── Shared styles ────────────────────────────────────────────
const sectionTitle = {
  margin: '0 0 4px',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
};
const sectionDesc = {
  margin: 0,
  fontSize: '.875rem',
  color: 'var(--text-muted)',
  lineHeight: 1.55,
};

// ── Main Settings component ──────────────────────────────────
export function Settings({ onBack }) {
  const { userPreferences, setPreference, resetShortcuts } = useUiStore();
  const { accounts, signOutAccount } = useAccountStore();
  const [activeTab, setActiveTab] = useState('appearance');

  const pref = userPreferences;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--gray-25)' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 32px',
        background: 'white',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <button
          className="icon-btn"
          onClick={onBack}
          aria-label="Back to inbox"
          style={{ color: 'var(--text-secondary)' }}
        >
          <IconArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-.02em' }}>Settings</h1>
          <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--text-muted)' }}>Customise your Lucid experience</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>

        {/* Left tab rail */}
        <nav
          style={{
            width: 200,
            flexShrink: 0,
            padding: '24px 12px',
            borderRight: '1px solid var(--border)',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
          }}
          aria-label="Settings sections"
        >
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 100ms',
                  background: isActive ? 'var(--brand-50)' : 'transparent',
                  color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '.875rem',
                }}
                onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'var(--gray-100)'; }}
                onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Right content panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 48px', maxWidth: 760 }}>
          {activeTab === 'appearance'    && <AppearanceTab pref={pref} setPreference={setPreference} />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'shortcuts'     && <ShortcutsTab pref={pref} setPreference={setPreference} resetShortcuts={resetShortcuts} />}
          {activeTab === 'tags'          && <TagsTab />}
          {activeTab === 'accounts'      && <AccountsTab accounts={accounts} signOutAccount={signOutAccount} />}
          {activeTab === 'signature'     && <SignatureTab />}
          <div style={{ height: 60 }} />
        </div>
      </div>
    </div>
  );
}
