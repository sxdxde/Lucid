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
import type { UserPreferences, Label, Account } from '../types';

function IconPalette({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <circle cx="7"  cy="8"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="13" cy="8"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="10" cy="13" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconBellS({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2a6 6 0 016 6c0 2.5.5 4 2 5H2c1.5-1 2-2.5 2-5a6 6 0 016-6z" />
      <path d="M8.5 17a1.5 1.5 0 003 0" />
    </svg>
  );
}
function IconUser({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="7" r="4" />
      <path d="M2 18a8 8 0 0116 0" />
    </svg>
  );
}
function IconPen({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 3.5l3 3L7 16H4v-3L13.5 3.5z" />
    </svg>
  );
}
function IconTagS({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h6l8 8-6 6-8-8V3z" />
      <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

interface ToggleSwitchProps {
  value: boolean;
  onChange: (val: boolean) => void;
  label: string;
  id?: string;
}

function ToggleSwitch({ value, onChange, label, id }: ToggleSwitchProps) {
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

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

function SettingsRow({ label, description, children, htmlFor }: SettingsRowProps) {
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

interface SegmentedControlOption {
  value: string;
  label: string;
}

function SegmentedControl({ options, value, onChange }: { options: SegmentedControlOption[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', padding: 3, gap: 2 }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: '6px 14px', borderRadius: 'var(--radius-xs)', border: 'none', cursor: 'pointer',
            fontSize: '.8125rem', fontWeight: 500, transition: 'all 140ms',
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

function ShortcutBadge({ value, onRemap }: { value: string; onRemap: (k: string) => void }) {
  const [listening, setListening] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!listening) return;
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Escape') { setListening(false); return; }
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
        padding: '3px 10px', borderRadius: 'var(--radius-xs)',
        border: `1.5px solid ${listening ? 'var(--brand-500)' : 'var(--gray-200)'}`,
        background: listening ? 'var(--brand-50)' : 'var(--gray-25)',
        color: listening ? 'var(--brand-600)' : 'var(--text-primary)',
        fontSize: '.75rem', fontWeight: 700, letterSpacing: '.06em',
        cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 120ms',
        minWidth: 32, textAlign: 'center', outline: 'none',
      }}
      aria-label={`Current shortcut: ${display}. Click to change.`}
    >
      {listening ? '…' : display}
    </button>
  );
}

interface TabDef {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const TABS: TabDef[] = [
  { id: 'appearance',    label: 'Appearance',    Icon: IconPalette },
  { id: 'notifications', label: 'Notifications', Icon: IconBellS   },
  { id: 'shortcuts',     label: 'Shortcuts',     Icon: ({ className }) => <IconKeyboard className={className ?? 'w-5 h-5'} /> },
  { id: 'tags',          label: 'Tags',          Icon: IconTagS    },
  { id: 'accounts',      label: 'Accounts',      Icon: IconUser    },
  { id: 'signature',     label: 'Signature',     Icon: IconPen     },
  { id: 'help',          label: 'Help & Docs',   Icon: IconHelp    },
];

const SHORTCUT_CATEGORIES = [...new Set(SHORTCUT_DEFS.map(s => s.category))];

interface OptionCardProps {
  label: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}

function OptionCard({ label, desc, active, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={active ? 'settings-option-card settings-option-card-active' : 'settings-option-card'}
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

interface AppearanceTabProps {
  pref: UserPreferences;
  setPreference: (key: keyof UserPreferences, value: UserPreferences[keyof UserPreferences]) => void;
}

function AppearanceTab({ pref, setPreference }: AppearanceTabProps) {
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
        <p style={{ ...sectionDesc, marginBottom: 20 }}>
          Scales the entire UI. You can also use the <strong>± widget</strong> in the top-right of the toolbar for fine control.
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          <OptionCard label="Small (85%)"   desc="Compact, more content fits"    active={pref.zoom === 85}  onClick={() => setPreference('zoom', 85)}  />
          <OptionCard label="Default (100%)" desc="Standard size (recommended)"  active={!pref.zoom || pref.zoom === 100} onClick={() => setPreference('zoom', 100)} />
          <OptionCard label="Large (115%)"  desc="Larger text and controls"       active={pref.zoom === 115} onClick={() => setPreference('zoom', 115)} />
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [notif, setNotif] = useState({ inbox: true, mentioned: true, quietHours: false, sounds: false });
  const toggle = (k: keyof typeof notif) => setNotif(n => ({ ...n, [k]: !n[k] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <h3 style={sectionTitle}>Email notifications</h3>
      <p style={{ ...sectionDesc, marginBottom: 28 }}>Control which events trigger browser notifications.</p>

      {([
        { key: 'inbox' as const,      label: 'New mail in Inbox',    desc: 'Show a notification for incoming emails' },
        { key: 'mentioned' as const,  label: 'When mentioned',       desc: 'Notify when your name appears in an email' },
        { key: 'quietHours' as const, label: 'Quiet hours',          desc: 'Silence all notifications from 10 PM – 8 AM' },
        { key: 'sounds' as const,     label: 'Notification sounds',  desc: 'Play a sound when a new email arrives' },
      ]).map(item => (
        <SettingsRow key={item.key} label={item.label} description={item.desc} htmlFor={`notif-${item.key}`}>
          <ToggleSwitch id={`notif-${item.key}`} value={notif[item.key]} onChange={() => toggle(item.key)} label={item.label} />
        </SettingsRow>
      ))}
    </div>
  );
}

interface ShortcutsTabProps {
  pref: UserPreferences;
  setPreference: (key: keyof UserPreferences, value: UserPreferences[keyof UserPreferences]) => void;
  resetShortcuts: () => void;
}

function ShortcutsTab({ pref, setPreference, resetShortcuts }: ShortcutsTabProps) {
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
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 20px',
                  background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-subtle)',
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
      setError('A tag with this name already exists.'); return;
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

      <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', marginBottom: 28 }}>
        <p style={{ margin: '0 0 16px', fontSize: '.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Create a new tag</p>

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

        <div style={{ marginTop: 16 }}>
          <p style={{ margin: '0 0 8px', fontSize: '.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Choose a color</p>
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

        {name.trim() && (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--text-muted)' }}>Preview:</p>
            <span style={{ padding: '3px 12px', borderRadius: 'var(--radius-pill)', background: `${color}18`, color, border: `1px solid ${color}40`, fontSize: '.75rem', fontWeight: 600 }}>
              {name.trim()}
            </span>
          </div>
        )}
      </div>

      {customLabels.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '.875rem' }}>
          No tags yet — create your first tag above.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {customLabels.map(label => (
            <div key={label.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xs)' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: label.color ?? undefined, flexShrink: 0 }} />
              <span style={{ padding: '3px 12px', borderRadius: 'var(--radius-pill)', background: `${label.color}18`, color: label.color ?? undefined, border: `1px solid ${label.color}40`, fontSize: '.8125rem', fontWeight: 600 }}>
                {label.name}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '.75rem', color: 'var(--text-muted)' }}>{label.color}</span>
              <button
                onClick={() => deleteLabel(label.id)}
                style={{ padding: '5px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'transparent', color: 'var(--danger)', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 120ms' }}
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

interface AccountsTabProps {
  accounts: Account[];
  signOutAccount: (id: string) => void;
}

function AccountsTab({ accounts, signOutAccount }: AccountsTabProps) {
  return (
    <div>
      <h3 style={sectionTitle}>Signed-in accounts</h3>
      <p style={{ ...sectionDesc, marginBottom: 28 }}>Manage the email accounts connected to Lucid.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {accounts.map(acc => (
          <div key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xs)' }}>
            <Avatar person={acc} size="lg" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ margin: 0, fontSize: '.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{acc.name}</p>
                {acc.isPrimary && (
                  <span style={{ padding: '1px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--brand-50)', color: 'var(--brand-600)', fontSize: '.6875rem', fontWeight: 700, letterSpacing: '.04em' }}>Primary</span>
                )}
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '.8125rem', color: 'var(--text-muted)' }}>{acc.email}</p>
            </div>
            <button
              onClick={() => signOutAccount(acc.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: '.8125rem', fontWeight: 600, color: 'var(--danger)', background: '#fff5f4', border: '1.5px solid #fecaca', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 120ms', flexShrink: 0 }}
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
        placeholder={"Write your email signature here…\n\ne.g.  Sudarshan Sudhakar\n       sudarshan@email.com"}
        style={{ width: '100%', padding: '16px 18px', fontSize: '.9375rem', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-sans)', lineHeight: 1.7, resize: 'vertical', transition: 'border-color 120ms', boxShadow: 'var(--shadow-xs)' }}
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

const sectionTitle: React.CSSProperties = {
  margin: '0 0 4px', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)',
};
const sectionDesc: React.CSSProperties = {
  margin: 0, fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.55,
};

// ── Help & Docs tab ─────────────────────────────────────────────

interface DocSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

function CodeKey({ k }: { k: string }) {
  return (
    <kbd style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 22, padding: '1px 6px', background: 'var(--gray-100)', border: '1px solid var(--border)', borderRadius: 4, fontSize: '.75rem', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
      {k}
    </kbd>
  );
}

function DocBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h4 style={{ margin: '0 0 12px', fontSize: '.9375rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-.01em' }}>{title}</h4>
      {children}
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '10px 14px', background: 'var(--brand-50)', border: '1px solid var(--brand-100)', borderRadius: 'var(--radius-md)', marginTop: 8 }}>
      <span style={{ fontSize: '.875rem', color: 'var(--brand-500)', flexShrink: 0 }}>✦</span>
      <p style={{ margin: 0, fontSize: '.8125rem', color: 'var(--brand-700)', lineHeight: 1.6 }}>{children}</p>
    </div>
  );
}

function ShortcutRow({ keys, desc }: { keys: string[]; desc: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '.875rem', color: 'var(--text-secondary)' }}>{desc}</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {keys.map((k, i) => <CodeKey key={i} k={k} />)}
      </div>
    </div>
  );
}

function HelpTab() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const NAV = [
    { id: 'getting-started', label: 'Getting started' },
    { id: 'navigation',      label: 'Navigation' },
    { id: 'email-actions',   label: 'Email actions' },
    { id: 'compose',         label: 'Compose & send' },
    { id: 'labels',          label: 'Labels & search' },
    { id: 'shortcuts',       label: 'Keyboard shortcuts' },
    { id: 'faq',             label: 'FAQ' },
  ];

  return (
    <div style={{ display: 'flex', gap: 0, minHeight: 0, height: '100%' }}>

      {/* Left mini-nav */}
      <nav style={{ width: 168, flexShrink: 0, paddingRight: 24, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <p style={{ margin: '0 0 10px', fontSize: '.6875rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Contents</p>
        {NAV.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            style={{
              textAlign: 'left', border: 'none', cursor: 'pointer', padding: '7px 10px',
              borderRadius: 'var(--radius-sm)', fontSize: '.8125rem',
              background: activeSection === id ? 'var(--brand-50)' : 'transparent',
              color: activeSection === id ? 'var(--brand-600)' : 'var(--text-secondary)',
              fontWeight: activeSection === id ? 600 : 400,
              transition: 'all 100ms',
            }}
            onMouseOver={e => { if (activeSection !== id) e.currentTarget.style.background = 'var(--gray-100)'; }}
            onMouseOut={e => { if (activeSection !== id) e.currentTarget.style.background = 'transparent'; }}
          >{label}</button>
        ))}
      </nav>

      {/* Main content */}
      <div style={{ flex: 1, paddingLeft: 36, overflowY: 'auto', minHeight: 0 }}>

        {activeSection === 'getting-started' && (
          <>
            <h3 style={{ ...sectionTitle, marginBottom: 6 }}>Getting started with Lucid</h3>
            <p style={{ ...sectionDesc, marginBottom: 28 }}>Lucid is designed to feel instantly familiar if you have used Gmail — and meaningfully better once you explore it.</p>

            <DocBlock title="Signing in">
              <p style={{ margin: '0 0 10px', fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Use email and password, continue with Google, or continue with GitHub from the login screen. You can also try a zero-friction <strong>Guest demo</strong> with no sign-up required.
              </p>
              <Tip>If you use the demo mode, your changes are not persisted between sessions.</Tip>
            </DocBlock>

            <DocBlock title="The layout at a glance">
              <p style={{ margin: '0 0 12px', fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Lucid uses the same three-column layout as Gmail:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Left column', 'Sidebar with labels (Inbox, Sent, Drafts, Trash, and custom tags). Drag the resize handle to make it wider or narrower.'],
                  ['Middle column', 'Email list — sorted newest-first. Click any row to preview it in the panel to the right.'],
                  ['Right panel', 'Email detail view — shows the full message, reply box, and smart replies. Click "⤡" to open in full view.'],
                ].map(([col, desc]) => (
                  <div key={col} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: 'var(--gray-25)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--brand-500)', minWidth: 100, paddingTop: 1 }}>{col}</span>
                    <span style={{ fontSize: '.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</span>
                  </div>
                ))}
              </div>
            </DocBlock>

            <DocBlock title="Your first actions">
              <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Press C', 'to open a compose window'],
                  ['Press /', 'to search your inbox'],
                  ['Press ?', 'to open this help panel at any time'],
                  ['Click an email', 'to preview it without losing your place in the list'],
                  ['Press E', 'to archive the selected email — press Z to undo'],
                ].map(([key, desc]) => (
                  <li key={key} style={{ fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <CodeKey k={key} /> {desc}
                  </li>
                ))}
              </ol>
            </DocBlock>
          </>
        )}

        {activeSection === 'navigation' && (
          <>
            <h3 style={{ ...sectionTitle, marginBottom: 6 }}>Navigation</h3>
            <p style={{ ...sectionDesc, marginBottom: 28 }}>Move around Lucid without touching the mouse using two-key navigation shortcuts.</p>

            <DocBlock title="Folder shortcuts">
              <ShortcutRow keys={['G', 'I']} desc="Go to Inbox" />
              <ShortcutRow keys={['G', 'S']} desc="Go to Sent" />
              <ShortcutRow keys={['G', 'D']} desc="Go to Drafts" />
              <ShortcutRow keys={['G', 'A']} desc="Go to All Mail" />
              <ShortcutRow keys={['G', 'T']} desc="Go to Trash" />
              <Tip>Press G then the letter key within 1 second. The G key arms navigation mode — you'll see the sidebar highlight.</Tip>
            </DocBlock>

            <DocBlock title="Search">
              <p style={{ margin: '0 0 10px', fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Press <CodeKey k="/" /> anywhere to jump to the search bar. Lucid searches subject, sender name, and email body simultaneously. Press <CodeKey k="Esc" /> to clear and return to the inbox.
              </p>
              <Tip>Prefix your query with <CodeKey k="from:" /> or <CodeKey k="to:" /> to filter by sender or recipient.</Tip>
            </DocBlock>

            <DocBlock title="Sidebar">
              <p style={{ margin: 0, fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Click any label in the sidebar to filter your email list to that folder. Drag the resize handle on the right edge of the sidebar to set your preferred width — it snaps to compact icon-only mode when collapsed below 80 px.
              </p>
            </DocBlock>
          </>
        )}

        {activeSection === 'email-actions' && (
          <>
            <h3 style={{ ...sectionTitle, marginBottom: 6 }}>Email actions</h3>
            <p style={{ ...sectionDesc, marginBottom: 28 }}>All destructive actions in Lucid are reversible. Press Z to undo any action at any time.</p>

            <DocBlock title="Single email actions">
              <ShortcutRow keys={['E']}       desc="Archive (removes from Inbox, keeps in All Mail)" />
              <ShortcutRow keys={['#']}       desc="Delete (moves to Trash)" />
              <ShortcutRow keys={['S']}       desc="Star / unstar" />
              <ShortcutRow keys={['Shift','U']} desc="Mark as unread" />
              <ShortcutRow keys={['Shift','I']} desc="Mark as read" />
              <ShortcutRow keys={['R']}       desc="Reply" />
              <ShortcutRow keys={['A']}       desc="Reply all" />
              <ShortcutRow keys={['F']}       desc="Forward" />
              <ShortcutRow keys={['Z']}       desc="Undo the last action" />
            </DocBlock>

            <DocBlock title="Bulk actions">
              <p style={{ margin: '0 0 10px', fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Tick the checkbox on any email row to enter bulk-select mode. A bulk action bar appears at the top with Archive, Delete, Mark read/unread, and Label options.
              </p>
              <ShortcutRow keys={['*','A']} desc="Select all visible emails" />
              <ShortcutRow keys={['*','N']} desc="Deselect all" />
              <ShortcutRow keys={['*','U']} desc="Select all unread" />
              <ShortcutRow keys={['*','S']} desc="Select all starred" />
              <Tip>Clicking the checkbox in the column header also selects all. Press Esc to exit bulk-select mode.</Tip>
            </DocBlock>

            <DocBlock title="Archive vs Delete">
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { label: 'Archive (E)', color: 'var(--brand-500)', points: ['Moves out of Inbox', 'Always in All Mail', 'Fully searchable', 'Recoverable any time'] },
                  { label: 'Delete (#)', color: 'var(--danger)', points: ['Moves to Trash', 'Permanently removed after 30 days', 'Searchable while in Trash', 'Recover before 30 days'] },
                ].map(col => (
                  <div key={col.label} style={{ flex: 1, padding: '12px 14px', border: `1.5px solid ${col.color}22`, borderRadius: 'var(--radius-md)', background: `${col.color}08` }}>
                    <p style={{ margin: '0 0 8px', fontSize: '.8125rem', fontWeight: 700, color: col.color }}>{col.label}</p>
                    {col.points.map(p => <p key={p} style={{ margin: '0 0 4px', fontSize: '.8rem', color: 'var(--text-secondary)' }}>· {p}</p>)}
                  </div>
                ))}
              </div>
            </DocBlock>
          </>
        )}

        {activeSection === 'compose' && (
          <>
            <h3 style={{ ...sectionTitle, marginBottom: 6 }}>Compose & send</h3>
            <p style={{ ...sectionDesc, marginBottom: 28 }}>Lucid supports multiple compose windows open at the same time, with autosave every 30 seconds.</p>

            <DocBlock title="Opening a compose window">
              <ShortcutRow keys={['C']} desc="Open a new compose window" />
              <ShortcutRow keys={['R']} desc="Reply to the currently selected email" />
              <ShortcutRow keys={['A']} desc="Reply all" />
              <ShortcutRow keys={['F']} desc="Forward" />
              <p style={{ margin: '12px 0 0', fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                You can open up to 3 compose windows at once. They stack horizontally from the bottom-right corner. Click the title bar to minimise any window.
              </p>
            </DocBlock>

            <DocBlock title="Sending">
              <ShortcutRow keys={['Ctrl','Enter']} desc="Send email" />
              <Tip>If the Subject field is empty when you press Send, Lucid will warn you before sending — unlike Gmail, which lets you send with no subject silently.</Tip>
            </DocBlock>

            <DocBlock title="Drafts & autosave">
              <p style={{ margin: 0, fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Every compose window autosaves to your Drafts folder every 30 seconds. Closing a compose window without sending also saves the draft. Access drafts from the sidebar or press <CodeKey k="G" /> <CodeKey k="D" />.
              </p>
            </DocBlock>

            <DocBlock title="CC & BCC">
              <p style={{ margin: 0, fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Click the <strong>CC</strong> or <strong>BCC</strong> button in the compose window header to reveal the extra recipient fields. Both fields support autocomplete from your contacts.
              </p>
            </DocBlock>
          </>
        )}

        {activeSection === 'labels' && (
          <>
            <h3 style={{ ...sectionTitle, marginBottom: 6 }}>Labels & search</h3>
            <p style={{ ...sectionDesc, marginBottom: 28 }}>Labels are Lucid's primary organisation tool — more flexible than folders because one email can have multiple labels.</p>

            <DocBlock title="Creating labels">
              <p style={{ margin: '0 0 10px', fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Go to <strong>Settings → Tags</strong> to create a new label. Give it a name and choose a colour. The label appears immediately in the sidebar.
              </p>
              <Tip>Drag labels in the sidebar to reorder them. Labels you use most often should go at the top — within Fitts' Law reach.</Tip>
            </DocBlock>

            <DocBlock title="Applying labels">
              <p style={{ margin: 0, fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Select one or more emails, then click the Label button in the bulk action bar. A label pill appears on the email row for quick visual identification. An email can carry multiple labels.
              </p>
            </DocBlock>

            <DocBlock title="Searching">
              <p style={{ margin: '0 0 10px', fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Press <CodeKey k="/" /> to open search. Results match subject, sender, recipient, and body. The search bar stays visible at the top while you browse results.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[['from:priya', 'Emails from Priya'], ['to:me', 'Emails addressed to you'], ['subject:invoice', 'Emails with "invoice" in the subject'], ['is:unread', 'All unread emails']].map(([ex, desc]) => (
                  <div key={ex} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
                    <code style={{ fontSize: '.8rem', color: 'var(--brand-600)', fontFamily: 'monospace', minWidth: 120 }}>{ex}</code>
                    <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{desc}</span>
                  </div>
                ))}
              </div>
            </DocBlock>
          </>
        )}

        {activeSection === 'shortcuts' && (
          <>
            <h3 style={{ ...sectionTitle, marginBottom: 6 }}>Keyboard shortcuts</h3>
            <p style={{ ...sectionDesc, marginBottom: 28 }}>Every action in Lucid has a keyboard shortcut. All shortcuts can be remapped in Settings → Shortcuts.</p>

            {[
              { group: 'Navigation', rows: [['G I','Go to Inbox'],['G S','Go to Sent'],['G D','Go to Drafts'],['G A','Go to All Mail'],['G T','Go to Trash'],['/','Focus search'],['?','Open this help panel']] },
              { group: 'Compose',    rows: [['C','New compose window'],['Ctrl Enter','Send'],['R','Reply'],['A','Reply all'],['F','Forward']] },
              { group: 'Email actions', rows: [['E','Archive'],['#','Delete'],['S','Star/unstar'],['Shift U','Mark unread'],['Shift I','Mark read'],['Z','Undo']] },
              { group: 'Selection',  rows: [['* A','Select all'],['* N','Deselect all'],['* U','Select unread'],['* S','Select starred']] },
            ].map(({ group, rows }) => (
              <DocBlock key={group} title={group}>
                {rows.map(([keys, desc]) => (
                  <ShortcutRow key={desc} keys={keys.split(' ')} desc={desc} />
                ))}
              </DocBlock>
            ))}

            <Tip>Shortcuts are disabled when focus is inside a text field (compose, search, reply). Press Esc to leave a text field and re-enable shortcuts.</Tip>
          </>
        )}

        {activeSection === 'faq' && (
          <>
            <h3 style={{ ...sectionTitle, marginBottom: 6 }}>Frequently asked questions</h3>
            <p style={{ ...sectionDesc, marginBottom: 28 }}>Answers to the most common questions about Lucid Mail.</p>

            {[
              ['How is Lucid different from Gmail?', 'Lucid uses the same three-column layout and familiar keyboard shortcuts as Gmail, but every feature is grounded in 40 years of HCI research. Resizable panels, undo for every destructive action, skeleton loading instead of blank spinners, an onboarding tutorial that reduces cognitive load for new users — these are deliberate choices, not coincidences. Complexity is moved from your mental model to our implementation.'],
              ['Is my real Gmail connected?', 'No. Lucid Mail is a research prototype demonstrating applied HCI principles. All email data shown is simulated — no real emails are sent or received, and no Google account data is accessed.'],
              ['How do I switch between light and dark mode?', 'Go to Settings → Appearance and toggle the Theme option. The change applies instantly — no page reload. Your preference is saved locally and restored on your next visit.'],
              ['Can I remap keyboard shortcuts?', 'Yes — open Settings → Shortcuts. Click the key badge next to any action and press the new key. Changes apply immediately. Press Reset to restore all defaults.'],
              ['Why does the app show a loading animation when I sign in?', 'The login loading screen (the LUCID wordmark filling with colour) and the skeleton layout are deliberate HCI design patterns. They give proportional, informative feedback during loading rather than showing a static spinner, which reduces perceived wait time by 20–30% according to usability research.'],
              ['What happens if I accidentally delete an email?', 'Press Z immediately after any action to undo it. Unlike Gmail\'s 30-second undo-send limit, Lucid lets you reverse any action — archive, delete, label, mark-read — at any time during your session.'],
              ['How do I give feedback or report a bug?', 'Open the GitHub repository for Lucid Mail and create an issue. Include steps to reproduce, your browser, and a screenshot if possible.'],
              ['Are there mobile or desktop app versions?', 'Lucid Mail is currently a web application. Native iOS, Android, and desktop (Electron) apps are on the roadmap for the next milestone.'],
            ].map(([q, a]) => (
              <div key={q as string} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                <p style={{ margin: '0 0 8px', fontSize: '.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{q}</p>
                <p style={{ margin: 0, fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </>
        )}

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

function IconHelp({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M7.5 7.5a2.5 2.5 0 014.5 1.5c0 1.5-2 2-2 3" />
      <circle cx="10" cy="14.5" r=".75" fill="currentColor" stroke="none" />
    </svg>
  );
}

interface SettingsProps {
  onBack: () => void;
  initialTab?: string;
}

export function Settings({ onBack, initialTab }: SettingsProps) {
  const { userPreferences, setPreference, resetShortcuts } = useUiStore();
  const { accounts, signOutAccount } = useAccountStore();
  const [activeTab, setActiveTab] = useState(initialTab ?? 'appearance');

  const pref = userPreferences;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--gray-25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 32px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button className="icon-btn" onClick={onBack} aria-label="Back to inbox" style={{ color: 'var(--text-secondary)' }}>
          <IconArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-.02em' }}>Settings</h1>
          <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--text-muted)' }}>Customise your Lucid experience</p>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <nav
          style={{ width: 200, flexShrink: 0, padding: '24px 12px', borderRight: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}
          aria-label="Settings sections"
        >
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-current={isActive ? 'page' : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 100ms', background: isActive ? 'var(--brand-50)' : 'transparent', color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)', fontWeight: isActive ? 600 : 400, fontSize: '.875rem' }}
                onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'var(--gray-100)'; }}
                onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: activeTab === 'help' ? '32px 40px' : '40px 48px', maxWidth: activeTab === 'help' ? 'none' : 760 }}>
          {activeTab === 'appearance'    && <AppearanceTab pref={pref} setPreference={setPreference} />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'shortcuts'     && <ShortcutsTab pref={pref} setPreference={setPreference} resetShortcuts={resetShortcuts} />}
          {activeTab === 'tags'          && <TagsTab />}
          {activeTab === 'accounts'      && <AccountsTab accounts={accounts} signOutAccount={signOutAccount} />}
          {activeTab === 'signature'     && <SignatureTab />}
          {activeTab === 'help'          && <HelpTab />}
          <div style={{ height: 60 }} />
        </div>
      </div>
    </div>
  );
}
