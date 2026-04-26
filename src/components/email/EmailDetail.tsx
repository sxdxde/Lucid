// HCI: S4 Closure — full email context, clear beginning/end
// HCI: N3 User Control — reply/forward always visible, back always reachable
// HCI: S5 Reversal — archive/trash with immediate undo toast
// HCI: P1 Aesthetic Usability — clean two-column layout matching Gmail ref
// HCI: G3 Proximity — action sidebar grouped by function, body content on right
// HCI: N7 Flexibility & Efficiency — smart replies for one-tap response
import React, { useState } from 'react';
import {
  IconArrowLeft, IconTrash, IconStar, IconReply, IconForward,
  IconAttachment, IconBell, IconClose, IconNoEmail, IconAlertTriangle,
  IconPlus, IconCheck, IconArchive, IconInbox,
} from '../ui/Icons';
import { useEmailStore } from '../../stores/emailStore';
import { useUiStore } from '../../stores/uiStore';
import { Avatar } from '../ui/Avatar';
import { Tooltip } from '../ui/Tooltip';
import type { Email } from '../../types';

function formatFullDate(ts: string): string {
  return new Date(ts).toLocaleString('en', {
    weekday: 'short', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

interface ActionDef {
  icon: React.ComponentType<{ className?: string; filled?: boolean; style?: React.CSSProperties }>;
  label: string;
  onClick: () => void;
  active: boolean;
  activeColor?: string;
  danger?: boolean;
}

interface ActionSidebarProps {
  email: Email;
  inTrash: boolean;
  inArchive: boolean;
  onTrash: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDeleteForever: () => void;
  onToggleStar: () => void;
}

function ActionSidebar({ email, inTrash, inArchive, onTrash, onArchive, onRestore, onDeleteForever, onToggleStar }: ActionSidebarProps) {
  // Build context-aware action list
  const actions: ActionDef[] = [
    { icon: IconStar, label: email.isStarred ? 'Unstar' : 'Star', onClick: onToggleStar, active: email.isStarred, activeColor: '#f59e0b' },

    // TRASH: Restore, Move to Archive, Delete Forever
    ...(inTrash ? [
      { icon: IconInbox,  label: 'Restore to Inbox',               onClick: onRestore,       active: false },
      { icon: IconArchive,label: 'Move to Archive',                 onClick: onArchive,       active: false },
      { icon: IconTrash,  label: 'Delete forever (cannot be undone)', onClick: onDeleteForever, active: false, danger: true },
    ] as ActionDef[] : []),

    // ARCHIVE: Move to Inbox, Move to Trash
    ...(inArchive ? [
      { icon: IconInbox,  label: 'Move to Inbox',  onClick: onRestore, active: false },
      { icon: IconTrash,  label: 'Move to Trash',  onClick: onTrash,   active: false, danger: true },
      { icon: IconCheck,  label: 'Mark done',       onClick: () => {}, active: false },
      { icon: IconBell,   label: 'Snooze',          onClick: () => {}, active: false },
    ] as ActionDef[] : []),

    // INBOX / other: Archive, Trash, Spam, Done, Snooze
    ...(!inTrash && !inArchive ? [
      { icon: IconArchive,       label: 'Archive (removes from inbox)', onClick: onArchive, active: false },
      { icon: IconTrash,         label: 'Delete — moves to Trash (30 days to recover)', onClick: onTrash, active: false, danger: true },
      { icon: IconAlertTriangle, label: 'Report spam',  onClick: () => {}, active: false },
      { icon: IconPlus,          label: 'Add label',    onClick: () => {}, active: false },
      { icon: IconCheck,         label: 'Mark done',    onClick: () => {}, active: false },
      { icon: IconBell,          label: 'Snooze',       onClick: () => {}, active: false },
    ] as ActionDef[] : []),
  ];

  return (
    <div className="detail-action-sidebar">
      {actions.map(({ icon: Icon, label, onClick, active, activeColor, danger }) => (
        <Tooltip key={label} content={label} side="right">
          <button
            className="detail-action-btn"
            onClick={onClick}
            aria-label={label}
            style={active ? { color: activeColor } : danger ? { color: 'var(--danger)' } : {}}
          >
            <Icon className="w-4 h-4" filled={label === 'Star' || label === 'Unstar' ? active : undefined} />
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

interface ReplyComposerProps {
  email: Email;
  onClose: () => void;
  onSend: (body: string) => void;
}

function ReplyComposer({ email, onClose, onSend }: ReplyComposerProps) {
  const [body, setBody] = useState('');

  return (
    <div className="detail-reply-area">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>Reply to <strong>{email.from.name}</strong></span>
        <button className="icon-btn" style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} onClick={onClose} aria-label="Cancel reply">
          <IconClose className="w-3.5 h-3.5" />
        </button>
      </div>
      <textarea
        placeholder="Write your reply..."
        value={body}
        onChange={e => setBody(e.target.value)}
        style={{ width: '100%', minHeight: 100, resize: 'vertical', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '.875rem', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--text-primary)', lineHeight: 1.6 }}
        aria-label="Reply body"
      />
      <div className="detail-reply-toolbar">
        <button
          className="btn btn-primary"
          onClick={() => { onSend(body); setBody(''); }}
          disabled={!body.trim()}
          style={{ opacity: body.trim() ? 1 : 0.5 }}
        >
          Send
        </button>
        <button className="icon-btn detail-reply-toolbar-btn" aria-label="Attach file"><IconAttachment className="w-4 h-4" /></button>
        <button className="icon-btn detail-reply-toolbar-btn" style={{ marginLeft: 'auto' }} onClick={onClose} aria-label="Discard draft">
          <IconTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface EmailDetailProps {
  emailId: string | null;
  onBack: () => void;
}

export function EmailDetail({ emailId, onBack }: EmailDetailProps) {
  const { emails, activeLabel, trash, archive, restoreToInbox, permanentDelete, toggleStar } = useEmailStore();
  const { openCompose, showToast } = useUiStore();
  const [replyOpen, setReplyOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);

  const inTrash   = activeLabel === 'trash';
  const inArchive = activeLabel === 'archived';

  const email = emails.find(e => e.id === emailId);

  if (!email) {
    return (
      <div className="empty-detail" style={{ background: 'var(--gray-25)' }}>
        <div style={{ textAlign: 'center' }}>
          <IconNoEmail className="w-20 h-20" style={{ marginBottom: 20, color: 'var(--gray-200)' }} />
          <p style={{ fontSize: '.9375rem', fontWeight: 500, color: 'var(--text-muted)' }}>Select a message to read</p>
          <p style={{ fontSize: '.8125rem', color: 'var(--gray-300)', marginTop: 4 }}>Nothing selected yet</p>
        </div>
      </div>
    );
  }

  const smartReplies = email.smartReplies ?? [];
  const images = email.images ?? [];

  const handleTrash = () => {
    trash([email.id]);
    showToast({ message: 'Moved to Trash', type: 'info', undoAction: 'trash' });
    onBack?.();
  };

  const handleArchive = () => {
    archive([email.id]);
    showToast({ message: 'Archived', type: 'info', undoAction: 'archive' });
    onBack?.();
  };

  const handleRestore = () => {
    restoreToInbox([email.id]);
    showToast({ message: 'Restored to Inbox', type: 'success', undoAction: 'move' });
    onBack?.();
  };

  const handleDeleteForever = () => {
    permanentDelete([email.id]);
    showToast({ message: 'Permanently deleted', type: 'info' });
    onBack?.();
  };

  const handleReply = (body = '') => {
    openCompose({
      to: email.from.email,
      subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
      body,
    });
    setReplyOpen(false);
  };

  const handleForward = () => {
    openCompose({
      subject: email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`,
      body: `\n\n--- Forwarded message ---\nFrom: ${email.from.name} <${email.from.email}>\n\n${email.body?.replace(/<[^>]+>/g, '') ?? ''}`,
    });
    setForwardOpen(false);
  };

  const handleSmartReply = (reply: string) => {
    openCompose({
      to: email.from.email,
      subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
      body: reply,
    });
  };

  return (
    <div className="email-detail-v2">
      <ActionSidebar
        email={email}
        inTrash={inTrash}
        inArchive={inArchive}
        onTrash={handleTrash}
        onArchive={handleArchive}
        onRestore={handleRestore}
        onDeleteForever={handleDeleteForever}
        onToggleStar={() => toggleStar(email.id)}
      />

      <div className="detail-main">
        <button className="detail-back-btn" onClick={onBack} aria-label="Back">
          <IconArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Context banner for trash / archive */}
        {inTrash && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', marginBottom: 16, background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 'var(--radius-md)', fontSize: '.875rem', color: '#795548' }}>
            <IconTrash className="w-4 h-4" style={{ flexShrink: 0, color: '#f57c00' }} />
            <span>This email is in <strong>Trash</strong>. Messages are permanently deleted after 30 days.</span>
            <button onClick={handleRestore} style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 6, border: 'none', background: '#1a73e8', color: 'white', fontSize: '.8125rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Restore to Inbox
            </button>
            <button onClick={handleDeleteForever} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontSize: '.8125rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Delete forever
            </button>
          </div>
        )}
        {inArchive && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', marginBottom: 16, background: 'var(--brand-50)', border: '1px solid var(--brand-200)', borderRadius: 'var(--radius-md)', fontSize: '.875rem', color: 'var(--brand-700)' }}>
            <IconArchive className="w-4 h-4" style={{ flexShrink: 0 }} />
            <span>This email is <strong>archived</strong> and not in your Inbox.</span>
            <button onClick={handleRestore} style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 6, border: 'none', background: '#1a73e8', color: 'white', fontSize: '.8125rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Move to Inbox
            </button>
          </div>
        )}

        <h1 className="detail-subject">{email.subject}</h1>

        <div className="detail-sender-section">
          <Avatar person={email.from} size="lg" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{email.from.name}</span>
              <span style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>&lt;{email.from.email}&gt;</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>to me</span>
              <span style={{ fontSize: '.75rem', color: 'var(--gray-300)' }}>·</span>
              <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{formatFullDate(email.timestamp)}</span>
            </div>
          </div>
        </div>

        {email.isSpamDetected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#fff3f3', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
            <IconAlertTriangle className="w-4 h-4" style={{ color: '#ef4444', flexShrink: 0 }} />
            <span style={{ fontSize: '.875rem', color: '#b91c1c' }}>This message was detected as potential spam. Exercise caution with any links or attachments.</span>
          </div>
        )}

        <div className="detail-body-row">
          <div
            className="email-body"
            style={{ flex: 1, minWidth: 0, fontSize: '.9375rem', lineHeight: 1.7, color: 'var(--text-primary)' }}
            dangerouslySetInnerHTML={{ __html: email.body ?? `<p>${email.preview}</p>` }}
          />
          {images.length > 0 && (
            <div className="detail-images-grid">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="detail-image-thumb"
                  style={{ background: img.gradient }}
                  aria-label={img.alt}
                  title={img.alt}
                >
                  {img.isMore && (
                    <span style={{ fontSize: '.8125rem', fontWeight: 700, color: 'white', textShadow: '0 1px 3px rgba(0,0,0,.6)' }}>
                      +{img.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {email.attachmentLabel && (
          <div style={{ marginBottom: 16 }}>
            <span className="attachment-badge">
              <IconAttachment className="w-3 h-3" />
              {email.attachmentLabel}
            </span>
          </div>
        )}

        {(email.attachments?.length ?? 0) > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {email.attachments!.map((f, i) => (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '.8125rem' }}>
                <IconAttachment className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{f.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>{f.size}</span>
              </div>
            ))}
          </div>
        )}

        {smartReplies.length > 0 && !replyOpen && (
          <div className="smart-replies" style={{ marginBottom: 20 }}>
            {smartReplies.map(r => (
              <button key={r} className="smart-reply-btn" onClick={() => handleSmartReply(r)}>{r}</button>
            ))}
          </div>
        )}

        {!replyOpen && !forwardOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <button className="btn btn-outline" onClick={() => setReplyOpen(true)} style={{ gap: 6 }}>
              <IconReply className="w-4 h-4" />
              Reply
            </button>
            <button className="btn btn-outline" onClick={handleForward} style={{ gap: 6 }}>
              <IconForward className="w-4 h-4" />
              Forward
            </button>
          </div>
        )}

        {replyOpen && (
          <ReplyComposer
            email={email}
            onClose={() => setReplyOpen(false)}
            onSend={handleReply}
          />
        )}
      </div>
    </div>
  );
}
