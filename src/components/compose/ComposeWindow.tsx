// HCI: S3 Informative Feedback — "Saving…" / "Saved" always visible
// HCI: S5 Permit Reversal — undo send with toast countdown
// HCI: Raskin Law 1 — never lose data; autosave every 30s
// HCI: N5 Error Prevention — warn before send if subject empty
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

// ── Recipient input ───────────────────────────────────────────
interface RecipientInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  contacts: Person[];
}

function RecipientInput({ label, value, onChange, contacts }: RecipientInputProps) {
  const [focused,     setFocused]     = useState(false);
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
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6875rem', color: 'white', fontWeight: 600, flexShrink: 0 }}>
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

// ── Toolbar button ────────────────────────────────────────────
interface ToolbarBtnProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
}

function ToolbarBtn({ icon: Icon, label, onClick, active }: ToolbarBtnProps) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }} // preventDefault keeps focus in editor
      className="compose-toolbar-btn"
      style={active ? { background: 'var(--brand-100)', color: 'var(--brand-600)' } : {}}
      aria-label={label}
      title={label}
      type="button"
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

// ── Main compose window ───────────────────────────────────────
interface ComposeWindowProps {
  windowData: ComposeWindowData;
}

export function ComposeWindow({ windowData }: ComposeWindowProps) {
  const { closeCompose, updateCompose, showToast } = useUiStore();
  const { sendEmail, saveDraft } = useEmailStore();

  const { id, to = '', subject = '', body = '', cc = '', bcc = '' } = windowData;

  const [minimized,       setMinimized]       = useState(false);
  const [fullscreen,      setFullscreen]       = useState(false);
  const [showCc,          setShowCc]           = useState(!!cc);
  const [showBcc,         setShowBcc]          = useState(!!bcc);
  const [sending,         setSending]          = useState(false);
  const [saveStatus,      setSaveStatus]       = useState<'saved'|'saving'|'unsaved'>('saved');
  const [subjectWarning,  setSubjectWarning]   = useState(false);
  const [attachedFiles,   setAttachedFiles]    = useState<File[]>([]);

  // Rich text editor ref
  const bodyRef    = useRef<HTMLDivElement>(null);
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const autosaveRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftIdRef    = useRef(`draft-${id}`);

  // Initialise editor content once on mount
  useEffect(() => {
    if (bodyRef.current && body) {
      bodyRef.current.innerHTML = body;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field: string, val: string) => updateCompose(id, { [field]: val });

  const syncBody = () => {
    if (bodyRef.current) update('body', bodyRef.current.innerHTML);
  };

  // Schedule autosave whenever fields change
  const scheduleAutosave = () => {
    setSaveStatus('unsaved');
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(doAutosave, AUTOSAVE_INTERVAL);
  };

  const doAutosave = useCallback(() => {
    setSaveStatus('saving');
    const currentBody = bodyRef.current?.innerHTML ?? body;
    saveDraft({
      id: draftIdRef.current,
      from: { name: 'Me', email: 'me@hcimail.app', avatar: 'ME', color: '#3b72ff' },
      to: to ? [{ name: to, email: to, avatar: to.charAt(0), color: '#6366f1' }] : [],
      subject, body: currentBody,
      preview: currentBody.replace(/<[^>]+>/g, '').slice(0, 100),
      timestamp: new Date().toISOString(),
      isRead: true, labels: ['drafts'], account: 'primary',
      attachments: attachedFiles.map(f => ({ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB` })),
      threadId: draftIdRef.current, isStarred: false,
    });
    setTimeout(() => setSaveStatus('saved'), 500);
  }, [to, subject, body, saveDraft, attachedFiles]);

  useEffect(() => () => { if (autosaveRef.current) clearTimeout(autosaveRef.current); }, []);

  // ── Formatting commands ───────────────────────────────────
  const execFmt = (cmd: string, val?: string) => {
    bodyRef.current?.focus();
    document.execCommand(cmd, false, val ?? undefined);
    syncBody();
  };

  const handleBold        = () => execFmt('bold');
  const handleItalic      = () => execFmt('italic');
  const handleUnderline   = () => execFmt('underline');
  const handleBulletList  = () => execFmt('insertUnorderedList');
  const handleBlockquote  = () => execFmt('formatBlock', 'blockquote');
  const handleLink        = () => {
    bodyRef.current?.focus();
    const url = window.prompt('Enter URL:', 'https://');
    if (url) { execFmt('createLink', url); }
  };
  const handleFileInsert  = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setAttachedFiles(prev => [...prev, ...files]);
    scheduleAutosave();
    e.target.value = ''; // reset so same file can be re-selected
  };

  const removeFile = (idx: number) =>
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));

  // ── Send ─────────────────────────────────────────────────
  const handleSend = (force = false) => {
    if (!subject.trim() && !force) { setSubjectWarning(true); return; }
    setSubjectWarning(false);
    setSending(true);
    const currentBody = bodyRef.current?.innerHTML ?? body;
    setTimeout(() => {
      sendEmail({
        from: { name: 'Sudarshan Sudhakar', email: 'sudarshan@hcimail.app', avatar: 'SS', color: '#3b72ff' },
        to: to ? [{ name: to, email: to, avatar: to.charAt(0), color: '#6366f1' }] : [],
        subject, body: currentBody,
        preview: currentBody.replace(/<[^>]+>/g, '').slice(0, 100),
        account: 'primary',
        attachments: attachedFiles.map(f => ({ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB` })),
      });
      setSending(false);
      closeCompose(id);
      showToast({ message: 'Message sent', type: 'success', duration: 5000, undoAction: 'send' });
    }, 800);
  };

  const handleClose = () => {
    if (saveStatus !== 'saved') doAutosave();
    closeCompose(id);
  };

  const titleBarBtns: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: (e: React.MouseEvent) => void }[] = [
    { icon: IconMinimize,                    label: minimized ? 'Expand' : 'Minimise',       onClick: e => { e.stopPropagation(); setMinimized(m => !m); } },
    { icon: fullscreen ? IconMinimize2 : IconMaximize, label: fullscreen ? 'Exit fullscreen' : 'Fullscreen', onClick: e => { e.stopPropagation(); setFullscreen(f => !f); } },
    { icon: IconClose,                       label: 'Close',                                  onClick: e => { e.stopPropagation(); handleClose(); } },
  ];

  return (
    <div
      className="compose-window"
      style={{
        position: fullscreen ? 'fixed' : 'relative',
        ...(fullscreen ? { inset: 16, width: 'auto', borderRadius: 'var(--radius-lg)' } : {}),
        height: minimized ? 48 : fullscreen ? undefined : 520,
      }}
      role="dialog"
      aria-label="Compose email"
    >
      {/* ── Title bar ── */}
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--gray-800)', flexShrink: 0, borderRadius: minimized ? 'var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) 0 0', cursor: minimized ? 'pointer' : 'default' }}
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
            <button key={label} onClick={onClick}
              style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-xs)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 120ms' }}
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
          {/* ── Recipients ── */}
          <div className="compose-fields-area" style={{ position: 'relative' }}>
            <RecipientInput label="To"  value={to}  onChange={v => { update('to', v);  scheduleAutosave(); }} contacts={mockContacts} />
            {showCc  && <RecipientInput label="Cc"  value={cc}  onChange={v => { update('cc', v);  scheduleAutosave(); }} contacts={mockContacts} />}
            {showBcc && <RecipientInput label="Bcc" value={bcc} onChange={v => { update('bcc', v); scheduleAutosave(); }} contacts={mockContacts} />}
            <div style={{ position: 'absolute', top: 8, right: 12, display: 'flex', gap: 4 }}>
              {!showCc  && <button onClick={() => setShowCc(true)}  className="compose-cc-btn">Cc</button>}
              {!showBcc && <button onClick={() => setShowBcc(true)} className="compose-cc-btn">Bcc</button>}
            </div>
          </div>

          {/* ── Subject ── */}
          <div className="compose-subject-row" style={{ borderBottomColor: subjectWarning ? 'var(--danger)' : 'var(--border)', background: subjectWarning ? 'rgba(234,67,53,.06)' : undefined }}>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={e => { update('subject', e.target.value); setSubjectWarning(false); scheduleAutosave(); }}
              className="compose-subject-input"
              aria-label="Email subject"
            />
          </div>

          {subjectWarning && (
            <div className="compose-warning-bar">
              <IconAlertCircle className="w-3.5 h-3.5" style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <span style={{ fontSize: '.8125rem', color: 'var(--danger)', flex: 1 }}>Subject is empty.</span>
              <button onClick={() => handleSend(true)} style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Send anyway
              </button>
            </div>
          )}

          {/* ── Rich text body ── */}
          <div
            ref={bodyRef}
            contentEditable
            suppressContentEditableWarning
            className="compose-body compose-rich-body"
            onInput={e => { syncBody(); scheduleAutosave(); }}
            onKeyDown={e => {
              // Ctrl/Cmd shortcuts
              if (e.ctrlKey || e.metaKey) {
                if (e.key === 'b') { e.preventDefault(); handleBold(); }
                if (e.key === 'i') { e.preventDefault(); handleItalic(); }
                if (e.key === 'u') { e.preventDefault(); handleUnderline(); }
                if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
              }
            }}
            aria-label="Email body"
            data-placeholder="Write your message… (Ctrl+B bold, Ctrl+I italic, Ctrl+U underline)"
          />

          {/* ── Attached files strip ── */}
          {attachedFiles.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '6px 14px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
              {attachedFiles.map((f, i) => (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px 3px 8px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--gray-50)', fontSize: '.75rem', color: 'var(--text-secondary)' }}>
                  <IconAttachment className="w-3 h-3" />
                  <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({(f.size / 1024).toFixed(0)}KB)</span>
                  <button onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0, marginLeft: 2 }} aria-label={`Remove ${f.name}`}>
                    <IconClose className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Toolbar ── */}
          <div className="compose-toolbar">
            <ToolbarBtn icon={IconBold}       label="Bold (Ctrl+B)"       onClick={handleBold} />
            <ToolbarBtn icon={IconItalic}     label="Italic (Ctrl+I)"     onClick={handleItalic} />
            <ToolbarBtn icon={IconUnderline}  label="Underline (Ctrl+U)"  onClick={handleUnderline} />
            <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />
            <ToolbarBtn icon={IconLink}       label="Insert link"          onClick={handleLink} />
            <ToolbarBtn icon={IconList}       label="Bullet list"          onClick={handleBulletList} />
            <ToolbarBtn icon={IconQuote}      label="Blockquote"           onClick={handleBlockquote} />
            <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />
            <ToolbarBtn icon={IconAttachment} label="Attach files"         onClick={handleFileInsert} />

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
              aria-label="Attach files"
            />

            {/* Send */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => handleSend()}
                disabled={sending || !to.trim()}
                className="btn btn-primary"
                style={{ gap: 6, padding: '7px 18px' }}
                aria-label="Send email (Ctrl+Enter)"
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
