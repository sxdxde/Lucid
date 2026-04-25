// HCI: S3 Informative Feedback — "Saving…" / "Saved" always visible
// HCI: S5 Permit Reversal — undo send with toast countdown
// HCI: Raskin Law 1 — never lose data; autosave every 30s
// HCI: Raskin Law 2 — auto-detect recipients, smart defaults
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

const AUTOSAVE_INTERVAL = 30000;

function RecipientInput({ label, value, onChange, contacts }) {
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const handleInput = (val) => {
    onChange(val);
    const last = val.split(',').pop().trim().toLowerCase();
    if (last.length < 1) { setSuggestions([]); return; }
    setSuggestions(contacts.filter(c =>
      c.name.toLowerCase().includes(last) || c.email.toLowerCase().includes(last)
    ).slice(0, 5));
  };

  const selectSuggestion = (c) => {
    const parts = value.split(',');
    parts[parts.length - 1] = ` ${c.name} <${c.email}>`;
    onChange(parts.join(',') + ', ');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderBottom: '1px solid var(--border)' }}>
      <label style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0, width: 24 }}>{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        style={{
          flex: 1, fontSize: '.875rem', color: 'var(--text-primary)',
          background: 'transparent', border: 'none', outline: 'none',
          fontFamily: 'var(--font-sans)', padding: '4px 0',
        }}
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

function ToolbarBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-xs)', border: 'none', background: 'transparent',
        cursor: 'pointer', color: 'var(--text-secondary)', transition: 'background 120ms',
      }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--gray-100)'}
      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
      aria-label={label}
      title={label}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

export function ComposeWindow({ windowData }) {
  const { closeCompose, updateCompose, showToast } = useUiStore();
  const { sendEmail, saveDraft } = useEmailStore();

  const { id, to = '', subject = '', body = '', cc = '', bcc = '' } = windowData;
  const [minimized, setMinimized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showCc, setShowCc] = useState(!!cc);
  const [showBcc, setShowBcc] = useState(!!bcc);
  const [sending, setSending] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [subjectWarning, setSubjectWarning] = useState(false);

  const autosaveRef = useRef(null);
  const draftIdRef = useRef(`draft-${id}`);

  const doAutosave = useCallback(() => {
    setSaveStatus('saving');
    saveDraft({
      id: draftIdRef.current,
      from: { name: 'Me', email: 'me@hcimail.app', avatar: 'ME', color: '#3b72ff' },
      to: to ? [{ name: to, email: to }] : [],
      subject, body: body || '',
      preview: body?.replace(/<[^>]+>/g, '').slice(0, 100) ?? '',
      timestamp: new Date().toISOString(),
      isRead: true, labels: ['drafts'], account: 'primary', attachments: [],
      threadId: draftIdRef.current,
    });
    setTimeout(() => setSaveStatus('saved'), 500);
  }, [to, subject, body, saveDraft]);

  useEffect(() => {
    setSaveStatus('unsaved');
    clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(doAutosave, AUTOSAVE_INTERVAL);
    return () => clearTimeout(autosaveRef.current);
  }, [to, subject, body, cc, bcc]);

  const update = (field, val) => updateCompose(id, { [field]: val });

  const handleSend = (force = false) => {
    if (!subject.trim() && !force) { setSubjectWarning(true); return; }
    setSubjectWarning(false);
    setSending(true);
    setTimeout(() => {
      sendEmail({
        from: { name: 'Sudarshan Sudhakar', email: 'sudarshan@hcimail.app', avatar: 'SS', color: '#3b72ff' },
        to: to ? [{ name: to, email: to }] : [],
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
      {/* Title bar */}
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
          {/* HCI: S3 Feedback — save status visible */}
          {!minimized && (
            <span style={{ fontSize: '.6875rem', color: saveStatus === 'saved' ? 'var(--gray-400)' : 'var(--gray-300)', display: 'flex', alignItems: 'center', gap: 3, marginRight: 4 }}>
              {saveStatus === 'saved' && <><IconCheck className="w-3 h-3" style={{ color: '#4ade80' }} />Saved</>}
              {saveStatus === 'saving' && 'Saving…'}
              {saveStatus === 'unsaved' && ''}
            </span>
          )}
          {[
            { icon: IconMinimize, label: minimized ? 'Expand' : 'Minimise', onClick: (e) => { e.stopPropagation(); setMinimized(m => !m); } },
            { icon: fullscreen ? IconMinimize2 : IconMaximize, label: fullscreen ? 'Exit fullscreen' : 'Fullscreen', onClick: (e) => { e.stopPropagation(); setFullscreen(f => !f); } },
            { icon: IconClose, label: 'Close', onClick: (e) => { e.stopPropagation(); handleClose(); } },
          ].map(({ icon: Icon, label, onClick }) => (
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
          <div style={{ background: 'white', position: 'relative' }}>
            <RecipientInput label="To" value={to} onChange={v => update('to', v)} contacts={mockContacts} />
            {showCc && <RecipientInput label="Cc" value={cc} onChange={v => update('cc', v)} contacts={mockContacts} />}
            {showBcc && <RecipientInput label="Bcc" value={bcc} onChange={v => update('bcc', v)} contacts={mockContacts} />}
            <div style={{ position: 'absolute', top: 8, right: 12, display: 'flex', gap: 4 }}>
              {!showCc && (
                <button onClick={() => setShowCc(true)} style={{ fontSize: '.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>Cc</button>
              )}
              {!showBcc && (
                <button onClick={() => setShowBcc(true)} style={{ fontSize: '.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>Bcc</button>
              )}
            </div>
          </div>

          {/* Subject */}
          <div style={{
            display: 'flex', alignItems: 'center', padding: '0 16px',
            borderBottom: `1px solid ${subjectWarning ? 'var(--danger)' : 'var(--border)'}`,
            background: subjectWarning ? '#fff5f4' : 'white',
          }}>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={e => { update('subject', e.target.value); setSubjectWarning(false); }}
              style={{
                flex: 1, fontSize: '.875rem', fontWeight: 500, color: 'var(--text-primary)',
                background: 'transparent', border: 'none', outline: 'none',
                padding: '10px 0', fontFamily: 'var(--font-sans)',
              }}
              aria-label="Email subject"
            />
          </div>

          {/* Subject warning (HCI: N5 Error Prevention with escape hatch) */}
          {subjectWarning && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fff5f4', borderBottom: '1px solid #fecaca' }}>
              <IconAlertCircle className="w-3.5 h-3.5" style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <span style={{ fontSize: '.8125rem', color: '#b91c1c', flex: 1 }}>Subject is empty.</span>
              <button
                onClick={() => handleSend(true)}
                style={{ fontSize: '.8125rem', fontWeight: 600, color: '#b91c1c', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Send anyway
              </button>
            </div>
          )}

          {/* Body */}
          <textarea
            value={body}
            onChange={e => update('body', e.target.value)}
            style={{
              flex: 1, padding: '14px 16px', fontSize: '.875rem', color: 'var(--text-primary)',
              background: 'white', border: 'none', outline: 'none', resize: 'none',
              fontFamily: 'var(--font-sans)', lineHeight: 1.65,
            }}
            placeholder="Write your message…"
            aria-label="Email body"
          />

          {/* Formatting toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 2, padding: '8px 12px',
            borderTop: '1px solid var(--border)', background: 'white', flexShrink: 0,
          }}>
            <ToolbarBtn icon={IconBold} label="Bold" onClick={() => {}} />
            <ToolbarBtn icon={IconItalic} label="Italic" onClick={() => {}} />
            <ToolbarBtn icon={IconUnderline} label="Underline" onClick={() => {}} />
            <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />
            <ToolbarBtn icon={IconLink} label="Insert link" onClick={() => {}} />
            <ToolbarBtn icon={IconList} label="Bullet list" onClick={() => {}} />
            <ToolbarBtn icon={IconQuote} label="Blockquote" onClick={() => {}} />
            <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />
            <ToolbarBtn icon={IconAttachment} label="Attach file" onClick={() => {}} />

            {/* Send */}
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
