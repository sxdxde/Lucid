// HCI: S3 Informative Feedback — "Saving…" / "Saved" always visible
// HCI: S5 Permit Reversal — undo send with toast countdown
// HCI: Raskin Law 1 — never lose data; autosave every 30s
// HCI: N5 Error Prevention — warn before send if subject empty
// HCI: D6 Affordance — compose looks like a distinct modal dialog
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  IconClose, IconMinimize, IconMaximize, IconMinimize2, IconSend,
  IconAttachment, IconBold, IconItalic, IconUnderline, IconLink,
  IconList, IconQuote, IconAlertCircle, IconCheck,
} from '../ui/Icons';
import { useUiStore } from '../../stores/uiStore';
import { useEmailStore } from '../../stores/emailStore';
import { mockContacts } from '../../data/mockEmails';
import type { ComposeWindowData, Person } from '../../types';

const AUTOSAVE_INTERVAL = 30000;

interface RecipientInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  contacts: Person[];
}

function RecipientInput({ label, value, onChange, contacts }: RecipientInputProps) {
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (val: string) => {
    onChange(val);
    const last = val.split(',').pop()?.trim().toLowerCase() ?? '';
    if (last.length < 1) { setSuggestions([]); return; }
    setSuggestions(contacts.filter(c =>
      c.name.toLowerCase().includes(last) || c.email.toLowerCase().includes(last)
    ).slice(0, 5));
  };

  const selectSuggestion = (c: Person) => {
    const parts = value.split(',');
    parts[parts.length - 1] = ` ${c.name} <${c.email}>`;
    onChange(parts.join(',') + ', ');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="compose-recipient-row">
      <label style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0, width: 24 }}>{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        className="compose-recipient-input"
        placeholder={label === 'To' ? 'Recipients' : ''}
        aria-label={`${label} field`}
      />
      {focused && suggestions.length > 0 && (
        <div className="dropdown" style={{ position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 999 }}>
          {suggestions.map(c => (
            <button key={c.email} className="dropdown-item" onMouseDown={() => selectSuggestion(c)}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%', background: c.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.6875rem', color: 'white', fontWeight: 600, flexShrink: 0,
              }}>
                {c.name.charAt(0)}
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</p>
                <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--text-muted)' }}>{c.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ToolbarBtnProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}

function ToolbarBtn({ icon: Icon, label, onClick }: ToolbarBtnProps) {
  return (
    <button
      onClick={onClick}
      className="compose-toolbar-btn"
      aria-label={label}
      title={label}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

interface ComposeWindowProps {
  windowData: ComposeWindowData;
}

export function ComposeWindow({ windowData }: ComposeWindowProps) {
  const { closeCompose, updateCompose, showToast } = useUiStore();
  const { sendEmail, saveDraft } = useEmailStore();

  const { id, to = '', subject = '', body = '', cc = '', bcc = '' } = windowData;
  const [minimized, setMinimized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showCc, setShowCc] = useState(!!cc);
  const [showBcc, setShowBcc] = useState(!!bcc);
  const [sending, setSending] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [subjectWarning, setSubjectWarning] = useState(false);

  const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftIdRef = useRef(`draft-${id}`);

  const doAutosave = useCallback(() => {
    setSaveStatus('saving');
    saveDraft({
      id: draftIdRef.current,
      from: { name: 'Me', email: 'me@hcimail.app', avatar: 'ME', color: '#3b72ff' },
      to: to ? [{ name: to, email: to, avatar: to.charAt(0), color: '#6366f1' }] : [],
      subject, body: body || '',
      preview: body?.replace(/<[^>]+>/g, '').slice(0, 100) ?? '',
      timestamp: new Date().toISOString(),
      isRead: true, labels: ['drafts'], account: 'primary', attachments: [],
      threadId: draftIdRef.current,
      isStarred: false,
    });
    setTimeout(() => setSaveStatus('saved'), 500);
  }, [to, subject, body, saveDraft]);

  useEffect(() => {
    setSaveStatus('unsaved');
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(doAutosave, AUTOSAVE_INTERVAL);
    return () => { if (autosaveRef.current) clearTimeout(autosaveRef.current); };
  }, [to, subject, body, cc, bcc]);

  const update = (field: string, val: string) => updateCompose(id, { [field]: val });

  const handleSend = (force = false) => {
    if (!subject.trim() && !force) { setSubjectWarning(true); return; }
    setSubjectWarning(false);
    setSending(true);
    setTimeout(() => {
      sendEmail({
        from: { name: 'Sudarshan Sudhakar', email: 'sudarshan@hcimail.app', avatar: 'SS', color: '#3b72ff' },
        to: to ? [{ name: to, email: to, avatar: to.charAt(0), color: '#6366f1' }] : [],
        subject, body: body || '',
        preview: (body?.replace(/<[^>]+>/g, '') ?? '').slice(0, 100),
        account: 'primary', attachments: [],
      });
      setSending(false);
      closeCompose(id);
      showToast({ message: 'Message sent', type: 'success', duration: 6000, undoAction: 'send' });
    }, 800);
  };

  const handleClose = () => {
    if (saveStatus !== 'saved') doAutosave();
    closeCompose(id);
  };

  const titleBarBtns = [
    { icon: IconMinimize, label: minimized ? 'Expand' : 'Minimise', onClick: (e: React.MouseEvent) => { e.stopPropagation(); setMinimized(m => !m); } },
    { icon: fullscreen ? IconMinimize2 : IconMaximize, label: fullscreen ? 'Exit fullscreen' : 'Fullscreen', onClick: (e: React.MouseEvent) => { e.stopPropagation(); setFullscreen(f => !f); } },
    { icon: IconClose, label: 'Close', onClick: (e: React.MouseEvent) => { e.stopPropagation(); handleClose(); } },
  ];

  return (
    <div
      className="compose-window"
      style={{
        position: fullscreen ? 'fixed' : 'relative',
        ...(fullscreen ? { inset: 16, width: 'auto', borderRadius: 'var(--radius-lg)' } : {}),
        height: minimized ? 48 : fullscreen ? undefined : 500,
      }}
      role="dialog"
      aria-label="Compose email"
      aria-modal="false"
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'var(--gray-800)', flexShrink: 0,
          borderRadius: minimized ? 'var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) 0 0',
          cursor: minimized ? 'pointer' : 'default',
        }}
        onClick={() => minimized && setMinimized(false)}
      >
        <span style={{ fontSize: '.8125rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}>
          {subject || 'New message'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {!minimized && (
            <span style={{ fontSize: '.6875rem', color: saveStatus === 'saved' ? 'var(--gray-400)' : 'var(--gray-300)', display: 'flex', alignItems: 'center', gap: 3, marginRight: 4 }}>
              {saveStatus === 'saved' && <><IconCheck className="w-3 h-3" style={{ color: '#4ade80' }} />Saved</>}
              {saveStatus === 'saving' && 'Saving…'}
            </span>
          )}
          {titleBarBtns.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              style={{
                width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-xs)', border: 'none', background: 'transparent',
                cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 120ms',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; e.currentTarget.style.color = 'white'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}
              aria-label={label}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {!minimized && (
        <>
          {/* Recipients */}
          <div className="compose-fields-area" style={{ position: 'relative' }}>
            <RecipientInput label="To" value={to} onChange={v => update('to', v)} contacts={mockContacts} />
            {showCc && <RecipientInput label="Cc" value={cc} onChange={v => update('cc', v)} contacts={mockContacts} />}
            {showBcc && <RecipientInput label="Bcc" value={bcc} onChange={v => update('bcc', v)} contacts={mockContacts} />}
            <div style={{ position: 'absolute', top: 8, right: 12, display: 'flex', gap: 4 }}>
              {!showCc && (
                <button onClick={() => setShowCc(true)} className="compose-cc-btn">Cc</button>
              )}
              {!showBcc && (
                <button onClick={() => setShowBcc(true)} className="compose-cc-btn">Bcc</button>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="compose-subject-row" style={{
            borderBottomColor: subjectWarning ? 'var(--danger)' : 'var(--border)',
            background: subjectWarning ? 'rgba(234,67,53,.08)' : undefined,
          }}>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={e => { update('subject', e.target.value); setSubjectWarning(false); }}
              className="compose-subject-input"
              aria-label="Email subject"
            />
          </div>

          {subjectWarning && (
            <div className="compose-warning-bar">
              <IconAlertCircle className="w-3.5 h-3.5" style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <span style={{ fontSize: '.8125rem', color: 'var(--danger)', flex: 1 }}>Subject is empty.</span>
              <button
                onClick={() => handleSend(true)}
                style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Send anyway
              </button>
            </div>
          )}

          {/* Body */}
          <textarea
            value={body}
            onChange={e => update('body', e.target.value)}
            className="compose-body"
            placeholder="Write your message…"
            aria-label="Email body"
          />

          {/* Toolbar */}
          <div className="compose-toolbar">
            <ToolbarBtn icon={IconBold} label="Bold" onClick={() => {}} />
            <ToolbarBtn icon={IconItalic} label="Italic" onClick={() => {}} />
            <ToolbarBtn icon={IconUnderline} label="Underline" onClick={() => {}} />
            <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />
            <ToolbarBtn icon={IconLink} label="Insert link" onClick={() => {}} />
            <ToolbarBtn icon={IconList} label="Bullet list" onClick={() => {}} />
            <ToolbarBtn icon={IconQuote} label="Blockquote" onClick={() => {}} />
            <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />
            <ToolbarBtn icon={IconAttachment} label="Attach file" onClick={() => {}} />

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => handleSend()}
                disabled={sending || !to.trim()}
                className="btn btn-primary"
                style={{ gap: 6, padding: '7px 18px' }}
                aria-label="Send email"
              >
                {sending ? (
                  <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} /> Sending…</>
                ) : (
                  <><IconSend className="w-3.5 h-3.5" />Send</>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
