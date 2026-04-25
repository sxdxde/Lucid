// HCI: L4 Hick's Law — sidebar limits choices at any width
// HCI: L3 Fitts' Law — large touch targets for all nav items
// HCI: S7 Locus of Control — user resizes sidebar by dragging the edge
import React, { useRef, useState } from 'react';
import { useEmailStore } from '../../stores/emailStore';
import { useUiStore } from '../../stores/uiStore';
import {
  IconInbox, IconStar, IconSend, IconDraft, IconSpam, IconTrash, IconArchive, IconMailOpen, IconPlus,
  IconVideo, IconVideoPlus, IconChevronDown, IconChevronRight,
} from '../ui/Icons';
import { Tooltip } from '../ui/Tooltip';
import { Avatar } from '../ui/Avatar';
import { mockContacts } from '../../data/mockEmails';

const COMPACT_W   = 68;
const EXPANDED_W  = 220;
const SNAP_THRESH = 120;   // below this → snap to compact
const MAX_W       = 300;

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  isInbox?: boolean;
}

const SYSTEM_NAV: NavItem[] = [
  { id: 'inbox',    icon: IconInbox,    label: 'Inbox',    isInbox: true },
  { id: 'starred',  icon: IconStar,     label: 'Starred'                 },
  { id: 'sent',     icon: IconSend,     label: 'Sent'                    },
  { id: 'archived', icon: IconArchive,  label: 'Archive'                 },
  { id: 'allmail',  icon: IconMailOpen, label: 'All Mail'                },
  { id: 'drafts',   icon: IconDraft,    label: 'Drafts'                  },
  { id: 'spam',     icon: IconSpam,     label: 'Spam'                    },
  { id: 'trash',    icon: IconTrash,    label: 'Trash'                   },
];

const PRIMARY_NAV = ['inbox', 'starred', 'sent', 'archived'];

interface SidebarProps {
  onLabelSelect?: (id: string) => void;
}

export function Sidebar({ onLabelSelect }: SidebarProps) {
  const { activeLabel, setActiveLabel, customLabels, getUnreadCount } = useEmailStore();
  const { openCompose, openChat } = useUiStore();

  const [width, setWidth] = useState(COMPACT_W);
  const [expanded, setExpanded] = useState(false);
  const isExpanded = width > SNAP_THRESH;

  const chatContacts = mockContacts.slice(0, 3);

  // ── Resize handle drag ──────────────────────────────────
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = width;

    const onMove = (me: MouseEvent) => {
      const newW = Math.min(MAX_W, Math.max(COMPACT_W, startW + (me.clientX - startX)));
      setWidth(newW);
    };

    const onUp = () => {
      setWidth(w => {
        if (w < SNAP_THRESH) return COMPACT_W;
        if (w < EXPANDED_W) return EXPANDED_W;
        return w;
      });
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const selectLabel = (id: string) => {
    if (id === '__create_label__') { onLabelSelect?.(id); return; }
    setActiveLabel(id);
    onLabelSelect?.(id);
  };

  const visibleNav = expanded ? SYSTEM_NAV : SYSTEM_NAV.filter(n => PRIMARY_NAV.includes(n.id));

  return (
    <aside
      style={{ width, flexShrink: 0, position: 'relative', transition: 'none' }}
      className={`sidebar-nav${isExpanded ? ' sidebar-nav--expanded' : ''}`}
      aria-label="Mail navigation"
      role="navigation"
    >
      {/* Compose button */}
      <div style={{ padding: isExpanded ? '8px 6px 4px' : '8px 0 4px', width: '100%' }}>
        <Tooltip content="Compose  ( C )" side="right" disabled={isExpanded}>
          <button
            className={isExpanded ? 'compose-expanded-btn' : 'compose-circle-btn'}
            onClick={() => openCompose()}
            aria-label="Compose new email"
          >
            {isExpanded ? (
              <>
                <span style={{ fontSize: '1.1rem', fontWeight: 300, lineHeight: 1 }}>+</span>
                <span>Compose</span>
              </>
            ) : '+'}
          </button>
        </Tooltip>
      </div>

      {/* ── Section divider with label ── */}
      <div className="sidebar-section-divider">
        {isExpanded && <span className="sidebar-section-label-text">Menu</span>}
      </div>

      {/* Primary nav */}
      <nav
        role="list"
        aria-label="Mail folders"
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: isExpanded ? 'stretch' : 'center', padding: isExpanded ? '0 4px' : '0' }}
      >
        {visibleNav.map(({ id, icon: Icon, label, isInbox }) => {
          const isActive = activeLabel === id;
          const unread = getUnreadCount(id);
          const btn = (
            <button
              key={id}
              className={[
                isExpanded ? 'sidebar-nav-item' : 'sidebar-icon-btn',
                isActive ? (isExpanded ? 'sidebar-nav-item--active' : 'sidebar-icon-btn--active') : '',
                isInbox && isActive && !isExpanded ? 'sidebar-icon-btn--inbox-active' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => selectLabel(id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
              role="listitem"
            >
              <Icon
                className="w-4 h-4"
                style={{
                  flexShrink: 0,
                  color: isInbox
                    ? '#ea4335'
                    : isActive ? 'var(--brand-600)' : 'var(--gray-600)',
                }}
              />
              {isExpanded && (
                <span style={{ flex: 1, fontSize: '.875rem', fontWeight: isActive ? 600 : 400, textAlign: 'left' }}>
                  {label}
                </span>
              )}
              {isExpanded && unread > 0 && (
                <span style={{
                  fontSize: '.6875rem', fontWeight: 700, minWidth: 18,
                  background: 'var(--brand-500)', color: 'white',
                  borderRadius: 'var(--radius-pill)', padding: '1px 5px', textAlign: 'center',
                }}>
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
              {!isExpanded && unread > 0 && !isActive && (
                <span className="unread-dot-badge" aria-hidden="true" />
              )}
            </button>
          );
          return isExpanded ? btn : (
            <Tooltip key={id} content={`${label}${unread > 0 ? ` (${unread})` : ''}`} side="right">
              {btn}
            </Tooltip>
          );
        })}

        {/* Custom label chips */}
        {isExpanded ? (
          <>
            {customLabels.slice(0, 6).map(label => {
              const isActive = activeLabel === label.id;
              return (
                <button
                  key={label.id}
                  className={`sidebar-nav-item${isActive ? ' sidebar-nav-item--active' : ''}`}
                  onClick={() => selectLabel(label.id)}
                  aria-label={label.name}
                >
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: label.color ?? undefined, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '.875rem', fontWeight: isActive ? 600 : 400, textAlign: 'left' }}>
                    {label.name}
                  </span>
                </button>
              );
            })}
            <button
              className="sidebar-nav-item"
              onClick={() => selectLabel('__create_label__')}
              style={{ color: 'var(--text-muted)' }}
              aria-label="Create new label"
            >
              <IconPlus className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span style={{ fontSize: '.8125rem' }}>Create label</span>
            </button>
          </>
        ) : (
          customLabels.slice(0, 3).map(label => {
            const isActive = activeLabel === label.id;
            return (
              <Tooltip key={label.id} content={label.name} side="right">
                <button
                  className={`sidebar-letter-btn${isActive ? ' sidebar-letter-btn--active' : ''}`}
                  onClick={() => selectLabel(label.id)}
                  aria-label={label.name}
                  style={isActive ? { borderColor: label.color ?? undefined, color: label.color ?? undefined, background: `${label.color}15` } : {}}
                >
                  {label.name.charAt(0).toUpperCase()}
                </button>
              </Tooltip>
            );
          })
        )}

        {/* More / less toggle */}
        {isExpanded ? (
          <button
            className="sidebar-nav-item"
            onClick={() => setExpanded(e => !e)}
            style={{ color: 'var(--text-muted)' }}
            aria-label={expanded ? 'Show fewer folders' : 'Show all folders'}
          >
            {expanded
              ? <IconChevronDown className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
              : <IconChevronRight className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
            }
            <span style={{ fontSize: '.875rem' }}>{expanded ? 'Show less' : 'More folders'}</span>
          </button>
        ) : (
          <Tooltip content={expanded ? 'Show less' : 'More folders'} side="right">
            <button
              className="sidebar-icon-btn"
              onClick={() => setExpanded(e => !e)}
              aria-label={expanded ? 'Show fewer' : 'More folders'}
            >
              {expanded
                ? <IconChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--gray-500)' }} />
                : <IconChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--gray-500)' }} />
              }
            </button>
          </Tooltip>
        )}
      </nav>

      {/* ── Section divider ── */}
      <div className="sidebar-section-divider">
        {isExpanded && <span className="sidebar-section-label-text">Meet</span>}
      </div>

      {[
        { Icon: IconVideo,     label: 'Start a meeting', href: 'https://meet.google.com/new' },
        { Icon: IconVideoPlus, label: 'Join a meeting',  href: 'https://meet.google.com'    },
      ].map(({ Icon, label, href }) => {
        const btn = (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={isExpanded ? 'sidebar-nav-item' : 'sidebar-icon-btn'}
            aria-label={label}
            style={{ textDecoration: 'none', color: 'inherit', ...(isExpanded ? { margin: '0 4px' } : {}) }}
          >
            <Icon className="w-4 h-4" style={{ color: 'var(--gray-600)', flexShrink: 0 }} />
            {isExpanded && <span style={{ fontSize: '.875rem', color: 'var(--text-secondary)' }}>{label}</span>}
          </a>
        );
        return isExpanded ? btn : (
          <Tooltip key={label} content={label} side="right">{btn}</Tooltip>
        );
      })}

      {/* ── Section divider ── */}
      <div className="sidebar-section-divider">
        {isExpanded && <span className="sidebar-section-label-text">Chat</span>}
      </div>

      {chatContacts.map(contact => {
        const btn = (
          <button
            key={contact.email}
            className={isExpanded ? 'sidebar-nav-item' : 'chat-avatar-btn'}
            aria-label={`Chat with ${contact.name}`}
            onClick={() => openChat(contact)}
            style={isExpanded ? { margin: '0 4px' } : {}}
          >
            <Avatar person={contact} size="sm" />
            {isExpanded && <span style={{ fontSize: '.875rem', color: 'var(--text-secondary)' }}>{contact.name}</span>}
          </button>
        );
        return isExpanded ? btn : (
          <Tooltip key={contact.email} content={contact.name} side="right">{btn}</Tooltip>
        );
      })}

      {/* ── Resize handle ── */}
      <div
        className="sidebar-resize-handle"
        onMouseDown={startResize}
        title="Drag to resize"
        aria-label="Resize sidebar"
      />
    </aside>
  );
}
