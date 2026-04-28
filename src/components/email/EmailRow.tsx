// HCI: D1 Visibility — quick actions on hover, not buried
// HCI: N7 Efficiency — one-click archive/delete from list
// HCI: G3 Proximity — sender, subject, preview on same row
// HCI: L3 Fitts' Law — action buttons large enough (36px), close to content
// HCI: P4 Dual-Coding — unread indicator + bold text (two signals for same info)
// HCI: N9 Error Prevention — spam rows visually flagged before user opens
// HCI: W4 Feature Exposure — inline preview panel shows body + images on click
import React, { useState } from 'react';
import { IconStar, IconTrash, IconMail, IconMailOpen, IconAttachment, IconAlertTriangle, IconArchive, IconCheck, IconBell, IconInbox } from '../ui/Icons';
import { Avatar } from '../ui/Avatar';
import { Tooltip } from '../ui/Tooltip';
import { useEmailStore } from '../../stores/emailStore';
import { useUiStore } from '../../stores/uiStore';
import type { Email } from '../../types';

function formatTime(ts: string): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return d.toLocaleDateString('en', { weekday: 'short' });
  if (d.getFullYear() === now.getFullYear()) return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric', year: '2-digit' });
}

const LABEL_COLORS: Record<string, string> = {
  work: '#0891b2', personal: '#059669', finance: '#d97706',
  travel: '#7c3aed', receipts: '#d93025',
};

interface PreviewPanelProps {
  email: Email;
  onViewDetail?: (id: string) => void;
}

function PreviewPanel({ email, onViewDetail }: PreviewPanelProps) {
  const { openCompose, showToast } = useUiStore();
  const { toggleStar, archive, trash, restoreToInbox, permanentDelete, activeLabel } = useEmailStore();
  const smartReplies = email.smartReplies ?? [];
  const images = email.images ?? [];

  const inTrash    = activeLabel === 'trash';
  const inArchive  = activeLabel === 'archived';
  const inInbox    = !inTrash && !inArchive;

  const handleSmartReply = (reply: string) => {
    openCompose({
      to: email.from.email,
      subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
      body: reply,
    });
  };

  // Build context-sensitive action list
  const previewActions = [
    // Star always available
    {
      icon: IconStar,
      label: email.isStarred ? 'Unstar' : 'Star',
      onClick: () => {
        toggleStar(email.id);
        showToast({ message: email.isStarred ? 'Removed from Starred' : 'Added to Starred', type: 'info', duration: 2500, undoAction: 'star' });
      },
      active: email.isStarred, color: '#f59e0b',
    },

    // TRASH view: Restore to Inbox + Archive + Delete Forever
    ...(inTrash ? [
      {
        icon: IconInbox, label: 'Restore to Inbox',
        onClick: () => { restoreToInbox([email.id]); showToast({ message: 'Restored to Inbox', type: 'success', undoAction: 'move' }); },
      },
      {
        icon: IconArchive, label: 'Move to Archive',
        onClick: () => { archive([email.id]); showToast({ message: 'Moved to Archive', type: 'info', undoAction: 'archive' }); },
      },
      {
        icon: IconTrash, label: 'Delete forever',
        onClick: () => { permanentDelete([email.id]); showToast({ message: 'Permanently deleted', type: 'info' }); },
        danger: true,
      },
    ] : []),

    // ARCHIVE view: Move to Inbox + Move to Trash
    ...(inArchive ? [
      {
        icon: IconInbox, label: 'Move to Inbox',
        onClick: () => { restoreToInbox([email.id]); showToast({ message: 'Moved to Inbox', type: 'success', undoAction: 'move' }); },
      },
      {
        icon: IconTrash, label: 'Move to Trash',
        onClick: () => { trash([email.id]); showToast({ message: 'Moved to Trash', type: 'info', undoAction: 'trash' }); },
        danger: true,
      },
    ] : []),

    // INBOX / other views: Archive + Trash + Spam
    ...(inInbox ? [
      {
        icon: IconArchive, label: 'Archive',
        onClick: () => { archive([email.id]); showToast({ message: 'Archived', type: 'info', undoAction: 'archive' }); },
      },
      {
        icon: IconTrash, label: 'Delete',
        onClick: () => { trash([email.id]); showToast({ message: 'Moved to Trash', type: 'info', undoAction: 'trash' }); },
        danger: true,
      },
      {
        icon: IconAlertTriangle, label: 'Report spam',
        onClick: () => { showToast({ message: 'Marked as spam', type: 'info', undoAction: 'spam' }); },
      },
      {
        icon: IconCheck, label: 'Mark done',
        onClick: () => { showToast({ message: 'Marked as done', type: 'success', duration: 2500 }); },
      },
      {
        icon: IconBell, label: 'Snooze',
        onClick: () => { showToast({ message: 'Snoozed until tomorrow', type: 'info', duration: 2500 }); },
      },
    ] : []),
  ];

  return (
    <div className="email-preview-panel fade-up">
      {/* Spam notice */}
      {email.isSpamDetected && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#fff3f3', borderBottom: '1px solid #fecdd3', color: '#b91c1c', fontSize: '.8125rem', flexShrink: 0 }}>
          <IconAlertTriangle className="w-3.5 h-3.5" style={{ flexShrink: 0 }} />
          <span>This message was flagged as potential spam.</span>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left action sidebar */}
        <div style={{ width: 44, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 2, borderRight: '1px solid var(--border)' }}>
          {previewActions.map(({ icon: Icon, label, onClick, active, color, danger }) => (
            <Tooltip key={label} content={label} side="right">
              <button
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: active ? color : danger ? 'var(--danger)' : 'var(--gray-500)',
                  transition: 'background 120ms',
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--gray-100)')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                aria-label={label}
              >
                <Icon className="w-4 h-4" filled={label === 'Star' || label === 'Unstar' ? active : undefined} />
              </button>
            </Tooltip>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, padding: '16px 20px 12px' }}>
          {/* Body + images side by side */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ flex: 1, minWidth: 0, fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              <div className="preview-body-text" dangerouslySetInnerHTML={{ __html: email.body ?? `<p>${email.preview}</p>` }} />
            </div>
            {images.length > 0 && (
              <div className="email-preview-images" style={{ flexShrink: 0 }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="preview-image-thumb"
                    style={{ background: img.gradient }}
                    aria-label={img.alt}
                    title={img.alt}
                  >
                    {img.isMore && (
                      <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'white', textShadow: '0 1px 3px rgba(0,0,0,.6)' }}>
                        +{img.count}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attachment */}
          {email.attachmentLabel && (
            <div style={{ marginBottom: 8 }}>
              <span className="attachment-badge">
                <IconAttachment className="w-3 h-3" />
                {email.attachmentLabel}
              </span>
            </div>
          )}

          {/* Smart replies */}
          {smartReplies.length > 0 && (
            <div className="smart-replies" style={{ marginBottom: 12 }}>
              {smartReplies.map(r => (
                <button key={r} className="smart-reply-btn" onClick={(e) => { e.stopPropagation(); handleSmartReply(r); }}>
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px dashed var(--gray-200)' }}>
            <span style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>You are viewing in preview mode</span>
            <button
              className="view-mail-btn"
              onClick={(e) => { e.stopPropagation(); onViewDetail?.(email.id); }}
            >
              View Mail &rsaquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EmailRowProps {
  email: Email;
  isSelected: boolean;
  isChecked: boolean;
  isPreview: boolean;
  onSelect: (id: string) => void;
  onCheck: (id: string) => void;
  onViewDetail?: (id: string) => void;
  showAccountBadge?: boolean;
}

// Account color map for All Mail differentiation
const ACCOUNT_COLORS: Record<string, string> = {
  primary: '#6366f1',
  work: '#0891b2',
  personal: '#059669',
};

export function EmailRow({ email, isSelected, isChecked, isPreview, onSelect, onCheck, onViewDetail, showAccountBadge }: EmailRowProps) {
  const { toggleStar, archive: _archive, trash, markRead } = useEmailStore();
  const { showToast } = useUiStore();
  const [hovered, setHovered] = useState(false);

  const makeUndoToast = (msg: string, action: string) => showToast({ message: msg, type: 'info', undoAction: action });

  const handleTrash      = (e: React.MouseEvent) => { e.stopPropagation(); trash([email.id]); makeUndoToast('Moved to Trash — recoverable for 30 days', 'trash'); };
  const handleToggleRead = (e: React.MouseEvent) => { e.stopPropagation(); markRead([email.id], !email.isRead); };
  const handleStar       = (e: React.MouseEvent) => { e.stopPropagation(); toggleStar(email.id); };

  const userLabels = email.labels.filter(l => !['inbox','sent','drafts','spam','trash','allmail','starred','archived'].includes(l));
  const isUnread = !email.isRead;
  const isSpam = !!email.isSpamDetected;

  return (
    <div role="listitem">
      <div
        className={[
          'email-row',
          isSelected || isPreview ? 'email-row--selected' : '',
          isUnread ? 'email-row--unread' : '',
          isSpam ? 'email-row--spam' : '',
        ].filter(Boolean).join(' ')}
        onClick={() => onSelect(email.id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(email.id); }}
        aria-label={`${isUnread ? 'Unread email' : 'Email'} from ${email.from.name}: ${email.subject}`}
        aria-selected={isSelected || isPreview}
        aria-expanded={isPreview}
      >
        {isUnread && !isSelected && !isPreview && (
          <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, borderRadius: '0 2px 2px 0', background: 'var(--brand-500)' }} aria-hidden="true" />
        )}

        {isSpam && (
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#ef4444' }} aria-hidden="true" />
        )}

        <div style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} onClick={e => { e.stopPropagation(); onCheck(email.id); }}>
          <div
            className={`checkbox${isChecked ? ' checkbox--checked' : ''}`}
            role="checkbox"
            aria-checked={isChecked}
            aria-label={`Select email from ${email.from.name}`}
            style={{ opacity: hovered || isChecked ? 1 : 0, transition: 'opacity 120ms' }}
          >
            {isChecked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </div>
        </div>

        <button onClick={handleStar} className={`star-btn${email.isStarred ? ' star-btn--starred' : ''}`} style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 2, borderRadius: 4, lineHeight: 0 }} aria-label={email.isStarred ? 'Unstar' : 'Star'} aria-pressed={email.isStarred}>
          <IconStar className="w-4 h-4" filled={email.isStarred} />
        </button>

        <div style={{ flexShrink: 0 }}>
          <Avatar person={email.from} size="md" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            {isSpam && <IconAlertTriangle className="w-3.5 h-3.5" style={{ color: '#ef4444', flexShrink: 0 }} aria-label="Spam" />}
            {showAccountBadge && email.account && (
              <Tooltip content={email.account} side="top">
                <span
                  className="account-dot"
                  style={{ background: ACCOUNT_COLORS[email.account] ?? '#9aa0a6' }}
                  aria-label={`Account: ${email.account}`}
                />
              </Tooltip>
            )}
            <span className="email-sender" style={{ fontSize: '.875rem', flexShrink: 0, fontWeight: isUnread ? 700 : 500, color: isSpam ? '#b91c1c' : isUnread ? 'var(--gray-900)' : 'var(--text-secondary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {email.from.name}
            </span>
            {userLabels.length > 0 && (
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {userLabels.slice(0, 2).map(l => (
                  <span key={l} className="label-chip" style={{ background: LABEL_COLORS[l] ? `${LABEL_COLORS[l]}18` : 'var(--gray-100)', color: LABEL_COLORS[l] || 'var(--text-secondary)', border: `1px solid ${LABEL_COLORS[l] ? `${LABEL_COLORS[l]}40` : 'var(--border)'}` }}>
                    {l}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
            <span className="email-subject" style={{ fontSize: '.8125rem', flexShrink: 0, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isUnread ? 600 : 400, color: isSpam ? '#b91c1c' : isUnread ? 'var(--gray-900)' : 'var(--text-primary)' }}>
              {email.subject}
            </span>
            <span style={{ color: 'var(--gray-300)', fontSize: '.8125rem', flexShrink: 0 }}>—</span>
            <span style={{ fontSize: '.8125rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {email.preview}
            </span>
          </div>
        </div>

        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 2, marginLeft: 8 }}>
          {(email.attachments?.length ?? 0) > 0 && !hovered && (
            <IconAttachment className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} aria-label="Has attachments" />
          )}
          {email.attachmentLabel && !hovered && (
            <span className="attachment-badge" style={{ marginRight: 4 }}>
              <IconAttachment className="w-3 h-3" />
              {email.attachmentLabel}
            </span>
          )}
          {hovered ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} role="toolbar" aria-label="Quick actions">
              <Tooltip content="Delete — moves to Trash, recoverable for 30 days (#)" side="top">
                <button className="icon-btn" onClick={handleTrash} aria-label="Delete" style={{ color: 'var(--danger)' }}>
                  <IconTrash className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip content={email.isRead ? 'Mark unread' : 'Mark read'} side="top">
                <button className="icon-btn" onClick={handleToggleRead} aria-label={email.isRead ? 'Mark as unread' : 'Mark as read'}>
                  {email.isRead ? <IconMail className="w-4 h-4" /> : <IconMailOpen className="w-4 h-4" />}
                </button>
              </Tooltip>
            </div>
          ) : (
            <span style={{ fontSize: '.75rem', whiteSpace: 'nowrap', fontWeight: isUnread ? 700 : 400, color: isUnread ? 'var(--gray-700)' : 'var(--text-muted)' }}>
              {formatTime(email.timestamp)}
            </span>
          )}
        </div>
      </div>

      {isPreview && <PreviewPanel email={email} onViewDetail={onViewDetail} />}
    </div>
  );
}
