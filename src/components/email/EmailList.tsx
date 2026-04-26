// HCI: N1 Visibility — welcome header shows active user at a glance
// HCI: S8 Reduce STM Load — stat badges (inbox/sent/drafts counts) surfaced upfront
// HCI: L2 Primacy/Recency — newest emails at top
// HCI: G2 Common Region — bulk action bar clearly demarcated
// HCI: N3 User Control — clear escape from bulk select mode
// HCI: W4 Feature Exposure — preview mode with blue border highlights active selection
import React, { useState, useMemo } from 'react';
import { IconTrash, IconMailOpen, IconClose, IconNoEmail, IconNoSearch, IconCompose, IconArchive, IconInbox } from '../ui/Icons';
import { Avatar } from '../ui/Avatar';
import { EmailRow } from './EmailRow';
import { useEmailStore } from '../../stores/emailStore';
import { useUiStore } from '../../stores/uiStore';
import { useAccountStore } from '../../stores/accountStore';
import { useSearch } from '../../hooks/useSearch';
import type { Label, Account, Email } from '../../types';

function SkeletonRow() {
  return (
    <div className="email-row" style={{ gap: 8, pointerEvents: 'none' }}>
      <div className="skeleton" style={{ width: 18, height: 18, flexShrink: 0 }} />
      <div className="skeleton" style={{ width: 16, height: 16, flexShrink: 0 }} />
      <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div className="skeleton" style={{ height: 12, width: '30%' }} />
        <div className="skeleton" style={{ height: 12, width: '70%' }} />
      </div>
      <div className="skeleton" style={{ width: 32, height: 10 }} />
    </div>
  );
}

interface EmptyStateConfig {
  title: string;
  desc: string;
  action: string | null;
}

const EMPTY_STATES: Record<string, EmptyStateConfig> = {
  inbox:    { title: 'Your inbox is empty',     desc: 'When you receive mail, it will appear here.',                       action: null },
  starred:  { title: 'No starred messages',      desc: 'Star emails you want to find again quickly.',                       action: null },
  sent:     { title: 'Nothing sent yet',          desc: 'Emails you send will appear here.',                                action: 'Compose your first email' },
  drafts:   { title: 'No drafts',                desc: 'Emails you save while composing will appear here.',                 action: 'Start composing' },
  trash:    { title: 'Trash is empty',           desc: 'Deleted messages appear here and are permanently removed after 30 days.', action: null },
  spam:     { title: 'No spam here',             desc: 'Messages marked as spam will appear here.',                         action: null },
  allmail:  { title: 'No messages',              desc: 'All your mail will appear here once you receive some.',             action: null },
  archived: { title: 'No archived messages',     desc: 'Emails you archive will appear here instead of your inbox.',       action: null },
};

function EmptyState({ label, searchQuery }: { label: string; searchQuery: string }) {
  const { openCompose } = useUiStore();
  if (searchQuery) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', textAlign: 'center' }}>
        <IconNoSearch className="w-16 h-16" style={{ marginBottom: 24, color: 'var(--gray-200)' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>No results for &ldquo;{searchQuery}&rdquo;</h3>
        <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', maxWidth: 300 }}>Try removing filters or using different keywords.</p>
      </div>
    );
  }
  const state = EMPTY_STATES[label] ?? EMPTY_STATES.inbox;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', textAlign: 'center' }}>
      <IconNoEmail className="w-20 h-20" style={{ marginBottom: 24, color: 'var(--gray-200)' }} />
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{state.title}</h3>
      <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', maxWidth: 300 }}>{state.desc}</p>
      {state.action && (
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => openCompose()}>
          <IconCompose className="w-4 h-4" />
          {state.action}
        </button>
      )}
    </div>
  );
}

interface WelcomeHeaderProps {
  activeAccount: Account;
  customLabels: Label[];
  emails: Email[];
}

function WelcomeHeader({ activeAccount, customLabels, emails }: WelcomeHeaderProps) {
  const inboxCount  = emails.filter(e => e.labels.includes('inbox') && !e.isRead).length;
  const sentCount   = emails.filter(e => e.labels.includes('sent')).length;
  const draftsCount = emails.filter(e => e.labels.includes('drafts')).length;
  const firstName = activeAccount?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="welcome-header">
      <div className="welcome-user">
        <Avatar person={activeAccount} size="lg" />
        <div>
          <p className="welcome-name">Welcome, {firstName}</p>
          {customLabels.length > 0 && (
            <div className="welcome-tags">
              {customLabels.slice(0, 4).map(l => (
                <span key={l.id} className="welcome-tag" style={{ background: `${l.color}18`, color: l.color ?? undefined, borderColor: `${l.color}40` }}>
                  {l.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="welcome-stats">
        <div className="welcome-stat">
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-600)' }}>{inboxCount}</span>
          <span style={{ fontSize: '.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Unread</span>
        </div>
        <div className="welcome-stat">
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-700)' }}>{sentCount}</span>
          <span style={{ fontSize: '.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Sent</span>
        </div>
        <div className="welcome-stat">
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-700)' }}>{draftsCount}</span>
          <span style={{ fontSize: '.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Drafts</span>
        </div>
      </div>
    </div>
  );
}

interface EmailListProps {
  onEmailSelect: (id: string) => void;
  previewEmailId: string | null;
  onViewDetail: (id: string) => void;
}

export function EmailList({ onEmailSelect, previewEmailId, onViewDetail }: EmailListProps) {
  const {
    emails, activeLabel, searchQuery, selectedEmailId, setSelectedEmail: _setSelectedEmail,
    trash, archive, restoreToInbox, permanentDelete, markRead, getEmailsByLabel, customLabels,
  } = useEmailStore();
  const { showToast, userPreferences } = useUiStore();
  const { getActiveAccount } = useAccountStore();
  const activeAccount = getActiveAccount();

  const [loading] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const searchResults = useSearch(searchQuery);

  const displayedEmails = useMemo(() => {
    if (searchQuery) return searchResults;
    const accountId = activeLabel === 'inbox' ? activeAccount?.id : null;
    return getEmailsByLabel(activeLabel, accountId ?? null);
  }, [emails, activeLabel, searchQuery, searchResults, activeAccount?.id]);

  const toggleCheck = (id: string) => {
    setChecked(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const toggleAll = () => {
    if (checked.size === displayedEmails.length) setChecked(new Set());
    else setChecked(new Set(displayedEmails.map(e => e.id)));
  };

  const checkedIds = [...checked];
  const hasChecked = checkedIds.length > 0;
  const allChecked = checked.size === displayedEmails.length && displayedEmails.length > 0;
  const someChecked = checked.size > 0 && !allChecked;
  const n = checkedIds.length;

  // Context-sensitive bulk actions
  const handleBulkTrash       = () => { trash(checkedIds);           showToast({ message: `${n} moved to Trash`,     type: 'info',    undoAction: 'trash'   }); setChecked(new Set()); };
  const handleBulkArchive     = () => { archive(checkedIds);         showToast({ message: `${n} archived`,           type: 'info',    undoAction: 'archive' }); setChecked(new Set()); };
  const handleBulkRestore     = () => { restoreToInbox(checkedIds);  showToast({ message: `${n} restored to Inbox`,  type: 'success', undoAction: 'move'    }); setChecked(new Set()); };
  const handleBulkDeleteForever = () => { permanentDelete(checkedIds); showToast({ message: `${n} permanently deleted`, type: 'info' }); setChecked(new Set()); };
  const handleBulkRead        = () => { markRead(checkedIds, true);  setChecked(new Set()); };

  const handleSelect = (id: string) => {
    markRead([id], true);
    onEmailSelect?.(id);
  };

  const LABEL_TITLES: Record<string, string> = {
    inbox: 'Inbox', starred: 'Starred', sent: 'Sent', drafts: 'Drafts',
    spam: 'Spam', trash: 'Trash', allmail: 'All Mail', archived: 'Archive',
  };
  const labelTitle = searchQuery
    ? `Search: "${searchQuery}"`
    : LABEL_TITLES[activeLabel] ?? (activeLabel.charAt(0).toUpperCase() + activeLabel.slice(1));
  const showAccountBadge = activeLabel === 'allmail';

  return (
    <div
      className={`email-list-container density-${userPreferences.density}`}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--surface)' }}
    >
      {activeLabel === 'inbox' && !searchQuery && (
        <WelcomeHeader activeAccount={activeAccount} customLabels={customLabels} emails={emails} />
      )}

      <div className="email-list-header">
        <button
          onClick={toggleAll}
          className={`checkbox${allChecked ? ' checkbox--checked' : someChecked ? ' checkbox--intermediate' : ''}`}
          aria-label={allChecked ? 'Deselect all' : 'Select all emails'}
        >
          {allChecked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          {someChecked && !allChecked && <span style={{ width: 8, height: 2, background: 'white', borderRadius: 1 }} />}
        </button>

        <h2 style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {labelTitle}
          {displayedEmails.filter(e => !e.isRead).length > 0 && !searchQuery && (
            <span style={{ marginLeft: 6, fontSize: '.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>
              {displayedEmails.filter(e => !e.isRead).length} unread
            </span>
          )}
        </h2>
      </div>

      {hasChecked && (
        <div className="bulk-bar">
          <span style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--brand-700)' }}>{n} selected</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>

            {/* ── TRASH VIEW ── restore + delete forever */}
            {activeLabel === 'trash' && <>
              <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '.75rem' }} onClick={handleBulkRestore}>
                <IconInbox className="w-3.5 h-3.5" />Restore to Inbox
              </button>
              <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '.75rem' }} onClick={handleBulkArchive}>
                <IconArchive className="w-3.5 h-3.5" />Move to Archive
              </button>
              <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '.75rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleBulkDeleteForever}>
                <IconTrash className="w-3.5 h-3.5" />Delete forever
              </button>
            </>}

            {/* ── ARCHIVE VIEW ── restore to inbox + move to trash */}
            {activeLabel === 'archived' && <>
              <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '.75rem' }} onClick={handleBulkRestore}>
                <IconInbox className="w-3.5 h-3.5" />Move to Inbox
              </button>
              <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '.75rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleBulkTrash}>
                <IconTrash className="w-3.5 h-3.5" />Move to Trash
              </button>
            </>}

            {/* ── INBOX / ALL OTHER VIEWS ── archive + delete + mark read */}
            {activeLabel !== 'trash' && activeLabel !== 'archived' && <>
              <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '.75rem' }} onClick={handleBulkArchive}>
                <IconArchive className="w-3.5 h-3.5" />Archive
              </button>
              <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '.75rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleBulkTrash}>
                <IconTrash className="w-3.5 h-3.5" />Delete
              </button>
              <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '.75rem' }} onClick={handleBulkRead}>
                <IconMailOpen className="w-3.5 h-3.5" />Mark read
              </button>
            </>}

          </div>
          <button className="icon-btn" style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} onClick={() => setChecked(new Set())} aria-label="Clear selection">
            <IconClose className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto' }} role="list" aria-label="Email list">
        {loading ? (
          Array.from({ length: 8 }, (_, i) => <SkeletonRow key={i} />)
        ) : displayedEmails.length === 0 ? (
          <EmptyState label={activeLabel} searchQuery={searchQuery} />
        ) : (
          displayedEmails.map(email => (
            <EmailRow
              key={email.id}
              email={email}
              isSelected={selectedEmailId === email.id}
              isChecked={checked.has(email.id)}
              isPreview={previewEmailId === email.id}
              onSelect={handleSelect}
              onCheck={toggleCheck}
              onViewDetail={onViewDetail}
              showAccountBadge={showAccountBadge}
            />
          ))
        )}
      </div>
    </div>
  );
}
