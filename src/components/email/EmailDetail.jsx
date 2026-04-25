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
  IconPlus, IconCheck,
} from '../ui/Icons';
import { useEmailStore } from '../../stores/emailStore';
import { useUiStore } from '../../stores/uiStore';
import { Avatar } from '../ui/Avatar';
import { Tooltip } from '../ui/Tooltip';

function formatFullDate(ts) {
  return new Date(ts).toLocaleString('en', {
    weekday: 'short', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// Left action sidebar — only Delete is the primary destructive action
// HCI: G3 Proximity, L3 Fitts' Law, N5 Error Prevention (delete = explicit red)
function ActionSidebar({ email, onTrash, onToggleStar }) {
  const actions = [
    { icon: IconStar,          label: email.isStarred ? 'Unstar' : 'Star', onClick: onToggleStar, active: email.isStarred, activeColor: '#f59e0b' },
    { icon: IconTrash,         label: 'Delete — moves to Trash (30 days to recover)', onClick: onTrash, active: false, activeColor: '#ef4444', danger: true },
    { icon: IconAlertTriangle, label: 'Report spam',  onClick: () => {}, active: false },
    { icon: IconPlus,          label: 'Add label',    onClick: () => {}, active: false },
    { icon: IconCheck,         label: 'Mark done',    onClick: () => {}, active: false },
    { icon: IconBell,          label: 'Snooze',       onClick: () => {}, active: false },
  ];

  return (
    <div className="detail-action-sidebar">
      {actions.map(({ icon: Icon, label, onClick, active, activeColor }) => (
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

// Inline reply composer — HCI: N3 User Control, S5 Reversibility
function ReplyComposer({ email, onClose, onSend }) {
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
      {/* Toolbar */}
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

export function EmailDetail({ emailId, onBack }) {
  const { emails, trash, toggleStar } = useEmailStore();
  const { openCompose, showToast } = useUiStore();
  const [replyOpen, setReplyOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);

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

  const handleSmartReply = (reply) => {
    openCompose({
      to: email.from.email,
      subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
      body: reply,
    });
  };

  return (
    <div className="email-detail-v2">
      {/* Left action sidebar — HCI: G3 Proximity, L3 Fitts' Law */}
      <ActionSidebar
        email={email}
        onTrash={handleTrash}
        onToggleStar={() => toggleStar(email.id)}
      />

      {/* Main content */}
      <div className="detail-main">
        {/* Back button */}
        <button className="detail-back-btn" onClick={onBack} aria-label="Back to inbox">
          <IconArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Subject */}
        <h1 className="detail-subject">{email.subject}</h1>

        {/* Sender section */}
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

        {/* Spam warning bar */}
        {email.isSpamDetected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#fff3f3', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
            <IconAlertTriangle className="w-4 h-4" style={{ color: '#ef4444', flexShrink: 0 }} />
            <span style={{ fontSize: '.875rem', color: '#b91c1c' }}>This message was detected as potential spam. Exercise caution with any links or attachments.</span>
          </div>
        )}

        {/* Body + image grid side-by-side — HCI: G1 Figure/Ground, G4 Similarity */}
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

        {/* Attachment badge */}
        {email.attachmentLabel && (
          <div style={{ marginBottom: 16 }}>
            <span className="attachment-badge">
              <IconAttachment className="w-3 h-3" />
              {email.attachmentLabel}
            </span>
          </div>
        )}

        {/* Standard file attachments */}
        {email.attachments?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {email.attachments.map((f, i) => (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '.8125rem' }}>
                <IconAttachment className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{f.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>{f.size}</span>
              </div>
            ))}
          </div>
        )}

        {/* Smart replies — HCI: N7 Flexibility & Efficiency, L4 Hick's Law */}
        {smartReplies.length > 0 && !replyOpen && (
          <div className="smart-replies" style={{ marginBottom: 20 }}>
            {smartReplies.map(r => (
              <button key={r} className="smart-reply-btn" onClick={() => handleSmartReply(r)}>{r}</button>
            ))}
          </div>
        )}

        {/* Reply / Forward buttons — HCI: N3 User Control, D1 Visibility */}
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

        {/* Inline reply composer */}
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
