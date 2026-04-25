// HCI: L4 Hick's Law — compact sidebar limits choices, reduces decision time
// HCI: L3 Fitts' Law — large touch targets for all nav items
// HCI: N6 Recognition over Recall — icons + labels in expanded mode
// HCI: S7 Locus of Control — user can expand/collapse sidebar
// HCI: G3 Proximity — Meet/Chat sections grouped by function
import React from 'react';
import { useEmailStore } from '../../stores/emailStore';
import { useUiStore } from '../../stores/uiStore';
import {
  IconInbox, IconStar, IconSend, IconDraft, IconSpam, IconTrash,
  IconVideo, IconVideoPlus, IconChevronDown, IconChevronRight, IconChevronLeft,
} from '../ui/Icons';
import { Tooltip } from '../ui/Tooltip';
import { Avatar } from '../ui/Avatar';
import { mockContacts } from '../../data/mockEmails';

// Lucid wordmark icon for expanded sidebar top
function LucidMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="26" height="26" rx="8" fill="url(#lm-g)" />
      <path d="M8 6v14h10" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="lm-g" x1="0" y1="0" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb"/><stop offset="1" stopColor="#1a73e8"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

const SYSTEM_NAV = [
  { id: 'inbox',   icon: IconInbox, label: 'Inbox',   isInbox: true  },
  { id: 'starred', icon: IconStar,  label: 'Starred'                  },
  { id: 'sent',    icon: IconSend,  label: 'Sent'                     },
  { id: 'drafts',  icon: IconDraft, label: 'Drafts'                   },
  { id: 'spam',    icon: IconSpam,  label: 'Spam'                     },
  { id: 'trash',   icon: IconTrash, label: 'Trash'                    },
];

const PRIMARY_NAV = ['inbox', 'starred', 'sent'];

export function Sidebar({ onLabelSelect }) {
  const { activeLabel, setActiveLabel, customLabels, getUnreadCount } = useEmailStore();
  const { openCompose, openChat, sidebarExpanded, toggleSidebar } = useUiStore();
  const [expanded, setExpanded] = React.useState(false);

  const chatContacts = mockContacts.slice(0, 3);

  const selectLabel = (id) => {
    setActiveLabel(id);
    onLabelSelect?.(id);
  };

  const visibleNav = expanded ? SYSTEM_NAV : SYSTEM_NAV.filter(n => PRIMARY_NAV.includes(n.id));

  return (
    <aside
      className={`sidebar-nav${sidebarExpanded ? ' sidebar-nav--expanded' : ''}`}
      aria-label="Mail navigation"
      role="navigation"
    >
      {/* Collapse/expand toggle at top */}
      <div className="sidebar-toggle-row">
        {sidebarExpanded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
            <LucidMark />
            <span style={{ fontSize: '.9375rem', fontWeight: 700, color: 'var(--brand-600)', letterSpacing: '-.02em' }}>
              Lucid
            </span>
          </div>
        )}
        <Tooltip content={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'} side="right">
          <button
            className="sidebar-icon-btn"
            onClick={toggleSidebar}
            aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{ marginLeft: sidebarExpanded ? 'auto' : undefined }}
          >
            {sidebarExpanded
              ? <IconChevronLeft className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
              : <IconChevronRight className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
            }
          </button>
        </Tooltip>
      </div>

      {/* Compose button */}
      <Tooltip content="Compose (C)" side="right" disabled={sidebarExpanded}>
        <button
          className={sidebarExpanded ? 'compose-expanded-btn' : 'compose-circle-btn'}
          onClick={() => openCompose()}
          aria-label="Compose new email"
        >
          {sidebarExpanded ? (
            <>
              <span style={{ fontSize: '1.1rem', fontWeight: 300, lineHeight: 1 }}>+</span>
              <span>Compose</span>
            </>
          ) : '+'}
        </button>
      </Tooltip>

      {sidebarExpanded && (
        <p className="sidebar-section-label" style={{ textAlign: 'left', padding: '0 10px' }}>Menu</p>
      )}
      {!sidebarExpanded && <span className="sidebar-section-label">Menu</span>}

      {/* Primary nav */}
      <nav role="list" aria-label="Mail folders" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: sidebarExpanded ? 'stretch' : 'center' }}>
        {visibleNav.map(({ id, icon: Icon, label, isInbox }) => {
          const isActive = activeLabel === id;
          const unread = getUnreadCount(id);
          const btn = (
            <button
              key={id}
              className={[
                sidebarExpanded ? 'sidebar-nav-item' : 'sidebar-icon-btn',
                isActive ? (sidebarExpanded ? 'sidebar-nav-item--active' : 'sidebar-icon-btn--active') : '',
                isInbox && isActive && !sidebarExpanded ? 'sidebar-icon-btn--inbox-active' : '',
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
              {sidebarExpanded && (
                <span style={{ flex: 1, fontSize: '.875rem', fontWeight: isActive ? 600 : 400, textAlign: 'left' }}>
                  {label}
                </span>
              )}
              {sidebarExpanded && unread > 0 && (
                <span style={{
                  fontSize: '.6875rem', fontWeight: 700, minWidth: 18,
                  background: 'var(--brand-500)', color: 'white',
                  borderRadius: 'var(--radius-pill)', padding: '1px 5px', textAlign: 'center',
                }}>
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
              {!sidebarExpanded && unread > 0 && !isActive && (
                <span className="unread-dot-badge" aria-hidden="true" />
              )}
            </button>
          );
          return sidebarExpanded ? btn : (
            <Tooltip key={id} content={`${label}${unread > 0 ? ` (${unread})` : ''}`} side="right">
              {btn}
            </Tooltip>
          );
        })}

        {/* Custom label chips */}
        {sidebarExpanded ? (
          customLabels.slice(0, 5).map(label => {
            const isActive = activeLabel === label.id;
            return (
              <button
                key={label.id}
                className={`sidebar-nav-item${isActive ? ' sidebar-nav-item--active' : ''}`}
                onClick={() => selectLabel(label.id)}
                aria-label={label.name}
              >
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: label.color, flexShrink: 0,
                }} />
                <span style={{ flex: 1, fontSize: '.875rem', fontWeight: isActive ? 600 : 400, textAlign: 'left' }}>
                  {label.name}
                </span>
              </button>
            );
          })
        ) : (
          customLabels.slice(0, 3).map(label => {
            const isActive = activeLabel === label.id;
            const letter = label.name.charAt(0).toUpperCase();
            return (
              <Tooltip key={label.id} content={label.name} side="right">
                <button
                  className={`sidebar-letter-btn${isActive ? ' sidebar-letter-btn--active' : ''}`}
                  onClick={() => selectLabel(label.id)}
                  aria-label={label.name}
                  style={isActive ? { borderColor: label.color, color: label.color, background: `${label.color}15` } : {}}
                >
                  {letter}
                </button>
              </Tooltip>
            );
          })
        )}

        {/* Expand/collapse more folders */}
        {sidebarExpanded ? (
          <button
            className="sidebar-nav-item"
            onClick={() => setExpanded(e => !e)}
            aria-label={expanded ? 'Show fewer folders' : 'Show all folders'}
          >
            {expanded
              ? <IconChevronDown className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
              : <IconChevronRight className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
            }
            <span style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>
              {expanded ? 'Show less' : 'More folders'}
            </span>
          </button>
        ) : (
          <Tooltip content={expanded ? 'Show less' : 'More folders'} side="right">
            <button
              className="sidebar-icon-btn"
              onClick={() => setExpanded(e => !e)}
              aria-label={expanded ? 'Show fewer folders' : 'Show all folders'}
            >
              {expanded
                ? <IconChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--gray-500)' }} />
                : <IconChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--gray-500)' }} />
              }
            </button>
          </Tooltip>
        )}
      </nav>

      <div className="sidebar-divider" />

      {/* Meet section — links to Google Meet */}
      {sidebarExpanded
        ? <p className="sidebar-section-label" style={{ textAlign: 'left', padding: '0 10px' }}>Meet</p>
        : <span className="sidebar-section-label">Meet</span>
      }

      {[
        { Icon: IconVideo,    label: 'Start a meeting', href: 'https://meet.google.com/new' },
        { Icon: IconVideoPlus, label: 'Join a meeting',  href: 'https://meet.google.com'    },
      ].map(({ Icon, label, href }) => {
        const btn = (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={sidebarExpanded ? 'sidebar-nav-item' : 'sidebar-icon-btn'}
            aria-label={label}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Icon className="w-4 h-4" style={{ color: 'var(--gray-600)', flexShrink: 0 }} />
            {sidebarExpanded && (
              <span style={{ fontSize: '.875rem', color: 'var(--text-secondary)' }}>{label}</span>
            )}
          </a>
        );
        return sidebarExpanded ? btn : (
          <Tooltip key={label} content={label} side="right">{btn}</Tooltip>
        );
      })}

      <div className="sidebar-divider" />

      {/* Chat section */}
      {sidebarExpanded
        ? <p className="sidebar-section-label" style={{ textAlign: 'left', padding: '0 10px' }}>Chat</p>
        : <span className="sidebar-section-label">Chat</span>
      }

      {chatContacts.map(contact => {
        const btn = (
          <button
            key={contact.email}
            className={sidebarExpanded ? 'sidebar-nav-item' : 'chat-avatar-btn'}
            aria-label={`Chat with ${contact.name}`}
            onClick={() => openChat(contact)}
          >
            <Avatar person={contact} size="sm" />
            {sidebarExpanded && (
              <span style={{ fontSize: '.875rem', color: 'var(--text-secondary)' }}>{contact.name}</span>
            )}
          </button>
        );
        return sidebarExpanded ? btn : (
          <Tooltip key={contact.email} content={contact.name} side="right">{btn}</Tooltip>
        );
      })}
    </aside>
  );
}
