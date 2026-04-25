// HCI: N1 Visibility of System Status — active account always shown
// HCI: N6 Recognition over Recall — recent searches surfaced on focus
// HCI: W4 Feature Exposure — search always visible, not collapsed
// HCI: S2 Shortcuts — '/' key focuses search; shown in placeholder
// HCI: L8 Jakob's Law — logo top-left, search centre, account top-right (Gmail standard)
// HCI: W9 Conventions — Gmail-familiar topbar layout
import React, { useState, useRef, useEffect } from 'react';
import { useUiStore } from '../../stores/uiStore';
import { useEmailStore } from '../../stores/emailStore';
import { useAccountStore } from '../../stores/accountStore';
import { useSearch } from '../../hooks/useSearch';
import {
  IconSearch, IconSettings, IconClose, IconChevronDown, IconLogOut,
  IconPlus, IconHelpCircle, IconGrid,
} from '../ui/Icons';
import { Avatar } from '../ui/Avatar';
import { Tooltip } from '../ui/Tooltip';

const RECENT_SEARCHES_KEY = 'hcimail-recent-searches';
const MAX_RECENT = 5;

// Lucid logo — clean geometric L mark (HCI: P1 Aesthetic Usability, W9 Conventions)
function LucidLogo() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Lucid" role="img">
      <rect width="30" height="30" rx="9" fill="url(#lucid-grad)" />
      <path d="M9 7v16h12" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="lucid-grad" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb"/>
          <stop offset="1" stopColor="#1a73e8"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TopBar({ onNavigate }) {
  const { searchQuery, setSearchQuery, setActiveLabel } = useEmailStore();
  const { userPreferences, setSearchFocused, searchFocused, setKeyboardShortcutsVisible } = useUiStore();
  const { accounts, activeAccountId, switchAccount, signOutAccount, getActiveAccount } = useAccountStore();
  const activeAccount = getActiveAccount();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [focused, setFocused] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) ?? []; } catch { return []; }
  });
  const [filters, setFilters] = useState({ from: '', hasAttachment: false });

  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const debounceRef = useRef(null);

  const searchResults = useSearch(localQuery, filters);

  useEffect(() => {
    if (searchFocused && searchRef.current) {
      searchRef.current.focus();
      setSearchFocused(false);
    }
  }, [searchFocused]);

  useEffect(() => {
    const handler = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleQueryChange = (val) => {
    setLocalQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(val), 300);
  };

  const handleSearchSubmit = (q = localQuery) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    setSearchQuery(q);
    setFocused(false);
  };

  const clearSearch = () => {
    setLocalQuery('');
    setSearchQuery('');
    setFilters({ from: '', hasAttachment: false });
  };

  return (
    <header className="topbar" role="banner">
      {/* Logo area — Jakob's Law: top-left, brand recognition */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180, flexShrink: 0 }}>
        <button
          onClick={() => { setActiveLabel('inbox'); setLocalQuery(''); setSearchQuery(''); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px 4px 4px', borderRadius: 6 }}
          aria-label="Go to inbox"
        >
          <LucidLogo />
          <span style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--brand-600)', letterSpacing: '-.03em' }}>
            Lucid
          </span>
        </button>
      </div>

      {/* Search bar — always visible (HCI: W4 Feature Exposure, L8 Jakob's Law) */}
      <div style={{ flex: 1, maxWidth: 720, position: 'relative' }}>
        <div
          className="search-bar"
          style={focused ? { background: 'white', borderColor: 'var(--gray-200)', boxShadow: '0 2px 8px rgba(0,0,0,.1)' } : {}}
        >
          <IconSearch className="w-4 h-4" style={{ color: 'var(--gray-500)', flexShrink: 0 }} />
          <input
            ref={searchRef}
            type="search"
            role="searchbox"
            aria-label="Search mail"
            placeholder="Search mail"
            value={localQuery}
            onChange={e => handleQueryChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSearchSubmit();
              if (e.key === 'Escape') { clearSearch(); searchRef.current?.blur(); }
            }}
          />
          {localQuery && (
            <button onClick={clearSearch} className="icon-btn" style={{ width: 28, height: 28 }} aria-label="Clear search">
              <IconClose className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search dropdown — HCI: N6 Recognition over Recall */}
        {focused && (
          <div className="dropdown fade-up" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 9999 }}>
            {/* Filter chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px 8px', flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Filters</span>
              <button
                onClick={() => setFilters(f => ({ ...f, hasAttachment: !f.hasAttachment }))}
                style={{
                  padding: '3px 10px', borderRadius: 'var(--radius-pill)', fontSize: '.75rem', fontWeight: 500, border: 'none', cursor: 'pointer',
                  background: filters.hasAttachment ? 'var(--brand-100)' : 'var(--gray-100)',
                  color: filters.hasAttachment ? 'var(--brand-600)' : 'var(--text-secondary)',
                }}
              >
                Has attachment
              </button>
              <input
                placeholder="From:"
                value={filters.from}
                onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
                style={{
                  padding: '3px 10px', borderRadius: 'var(--radius-pill)', fontSize: '.75rem', background: 'var(--gray-100)',
                  border: 'none', outline: 'none', color: 'var(--text-primary)', width: 110, fontFamily: 'var(--font-sans)',
                }}
              />
            </div>

            {/* Live results */}
            {localQuery && searchResults.length > 0 && (
              <div>
                <p style={{ padding: '8px 14px 4px', fontSize: '.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', margin: 0 }}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
                {searchResults.slice(0, 5).map(email => (
                  <button key={email.id} className="dropdown-item" onMouseDown={() => handleSearchSubmit(localQuery)}>
                    <IconSearch className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ fontSize: '.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <strong>{email.from.name}</strong> — {email.subject}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {localQuery && searchResults.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '.875rem', color: 'var(--text-secondary)', margin: 0 }}>No results for "<strong>{localQuery}</strong>"</p>
                <p style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Try different keywords or remove filters</p>
              </div>
            )}

            {/* Recent searches */}
            {!localQuery && recentSearches.length > 0 && (
              <div>
                <p style={{ padding: '8px 14px 4px', fontSize: '.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', margin: 0 }}>
                  Recent searches
                </p>
                {recentSearches.map(s => (
                  <button key={s} className="dropdown-item" onMouseDown={() => { setLocalQuery(s); handleSearchSubmit(s); }}>
                    <IconSearch className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ fontSize: '.875rem' }}>{s}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right controls — HCI: G3 Proximity, L2 Primacy/Recency */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto', flexShrink: 0 }}>
        {/* Help (?) — HCI: SP1 Availability */}
        <Tooltip content="Help (?)" side="bottom">
          <button
            className="icon-btn"
            onClick={() => setKeyboardShortcutsVisible(true)}
            aria-label="Help and keyboard shortcuts"
          >
            <IconHelpCircle className="w-5 h-5" />
          </button>
        </Tooltip>

        {/* Settings — HCI: D1 Visibility */}
        <Tooltip content="Settings" side="bottom">
          <button
            className="icon-btn"
            onClick={() => onNavigate('/settings')}
            aria-label="Open settings"
          >
            <IconSettings className="w-5 h-5" />
          </button>
        </Tooltip>

        {/* Google apps grid — HCI: L8 Jakob's Law (Gmail has this icon) */}
        <Tooltip content="Google apps" side="bottom">
          <button className="icon-btn" aria-label="Google apps">
            <IconGrid className="w-4 h-4" />
          </button>
        </Tooltip>

        {/* "Change Account" button — HCI: N1 Visibility of system status */}
        <div style={{ position: 'relative', marginLeft: 4 }} ref={accountRef}>
          <button
            onClick={() => setAccountOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 6px',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)',
              background: 'transparent', cursor: 'pointer', transition: 'all 120ms',
              color: 'var(--gray-700)', fontSize: '.8125rem', fontWeight: 500,
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--gray-100)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            aria-label="Change account"
            aria-expanded={accountOpen}
          >
            <Avatar person={activeAccount} size="sm" />
            <span style={{ whiteSpace: 'nowrap' }}>Change Account</span>
          </button>

          {accountOpen && (
            <div className="dropdown fade-up" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 280, zIndex: 9999 }}>
              {/* Account header */}
              <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar person={activeAccount} size="lg" />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeAccount?.name}</p>
                    <p style={{ fontSize: '.75rem', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeAccount?.email}</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '8px 0' }}>
                {accounts.length > 1 && (
                  <>
                    <p style={{ padding: '4px 16px', fontSize: '.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', margin: 0 }}>
                      All accounts
                    </p>
                    {accounts.map(acc => (
                      <div key={acc.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 12px' }}>
                        <button
                          style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '4px', borderRadius: 'var(--radius-sm)', minWidth: 0 }}
                          onClick={() => { switchAccount(acc.id); setAccountOpen(false); }}
                        >
                          <Avatar person={acc} size="sm" />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: '.8125rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.name}</p>
                            <p style={{ fontSize: '.75rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.email}</p>
                          </div>
                          {acc.id === activeAccountId && (
                            <span style={{ marginLeft: 'auto', fontSize: '.6875rem', fontWeight: 600, color: 'var(--brand-600)', flexShrink: 0, paddingLeft: 8 }}>Active</span>
                          )}
                        </button>
                        <Tooltip content={`Sign out ${acc.name}`} side="left">
                          <button
                            className="icon-btn"
                            style={{ width: 28, height: 28, color: 'var(--text-muted)' }}
                            onClick={() => { signOutAccount(acc.id); setAccountOpen(false); }}
                            aria-label={`Sign out of ${acc.name}`}
                          >
                            <IconLogOut className="w-3.5 h-3.5" />
                          </button>
                        </Tooltip>
                      </div>
                    ))}
                    <div className="divider" style={{ margin: '8px 0' }} />
                  </>
                )}
                <button className="dropdown-item" style={{ color: 'var(--brand-600)' }}>
                  <IconPlus className="w-4 h-4" />
                  Add another account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
