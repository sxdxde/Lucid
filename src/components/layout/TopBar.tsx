// HCI: N1 Visibility of System Status — active account always shown
// HCI: N6 Recognition over Recall — recent searches surfaced on focus
// HCI: W4 Feature Exposure — search always visible, not collapsed
// HCI: L8 Jakob's Law — logo top-left, search centre, account top-right
import React, { useState, useRef, useEffect } from 'react';
import { useUiStore } from '../../stores/uiStore';
import { useEmailStore } from '../../stores/emailStore';
import { useAccountStore } from '../../stores/accountStore';
import { useSearch } from '../../hooks/useSearch';
import {
  IconSearch, IconSettings, IconClose, IconLogOut,
  IconPlus, IconHelpCircle, IconGrid,
} from '../ui/Icons';
import { Avatar } from '../ui/Avatar';
import { Tooltip } from '../ui/Tooltip';
import type { Email } from '../../types';

const RECENT_SEARCHES_KEY = 'hcimail-recent-searches';
const MAX_RECENT = 5;

// Google-colored LUCID wordmark — each letter a different Google brand color
function LucidWordmark() {
  const letters = [
    { ch: 'L', color: '#4285F4' },
    { ch: 'U', color: '#EA4335' },
    { ch: 'C', color: '#FBBC04' },
    { ch: 'I', color: '#34A853' },
    { ch: 'D', color: '#4285F4' },
  ];
  return (
    <span style={{ display: 'flex', alignItems: 'baseline', gap: 0, userSelect: 'none' }}>
      {letters.map(({ ch, color }) => (
        <span key={ch + color} style={{ color, fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-.02em', lineHeight: 1 }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

interface TopBarProps {
  onNavigate: (path: string) => void;
}

export function TopBar({ onNavigate }: TopBarProps) {
  const { searchQuery, setSearchQuery, setActiveLabel } = useEmailStore();
  const { setSearchFocused, searchFocused, setKeyboardShortcutsVisible } = useUiStore();
  const { accounts, activeAccountId, switchAccount, signOutAccount, addAccount, getActiveAccount } = useAccountStore();
  const activeAccount = getActiveAccount();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [focused, setFocused] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [addingAccount, setAddingAccount] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? '[]') ?? []; } catch { return []; }
  });
  const [filters, setFilters] = useState({ from: '', hasAttachment: false });

  const searchRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchResults: Email[] = useSearch(localQuery, filters);

  useEffect(() => {
    if (searchFocused && searchRef.current) {
      searchRef.current.focus();
      setSearchFocused(false);
    }
  }, [searchFocused]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleQueryChange = (val: string) => {
    setLocalQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
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
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 160, flexShrink: 0 }}>
        <button
          onClick={() => { setActiveLabel('inbox'); setLocalQuery(''); setSearchQuery(''); }}
          style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px 4px 4px', borderRadius: 6 }}
          aria-label="Go to inbox"
        >
          <LucidWordmark />
        </button>
      </div>

      {/* Search bar */}
      <div style={{ flex: 1, maxWidth: 720, position: 'relative' }}>
        <div
          className="search-bar"
          style={focused ? { background: 'var(--surface)', borderColor: 'var(--gray-200)', boxShadow: '0 2px 8px rgba(0,0,0,.1)' } : {}}
        >
          <IconSearch className="w-4 h-4" style={{ color: 'var(--gray-500)', flexShrink: 0 }} />
          <input
            ref={searchRef}
            type="search"
            role="searchbox"
            aria-label="Search mail"
            placeholder="Search mail  ( / )"
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

        {focused && (
          <div className="dropdown fade-up" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 9999 }}>
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

            {localQuery && searchResults.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '.875rem', color: 'var(--text-secondary)', margin: 0 }}>No results for "<strong>{localQuery}</strong>"</p>
                <p style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Try different keywords or remove filters</p>
              </div>
            )}

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

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto', flexShrink: 0 }}>
        <Tooltip content="Keyboard shortcuts (?)" side="bottom">
          <button className="icon-btn" onClick={() => setKeyboardShortcutsVisible(true)} aria-label="Help and keyboard shortcuts">
            <IconHelpCircle className="w-5 h-5" />
          </button>
        </Tooltip>

        <Tooltip content="Settings" side="bottom">
          <button className="icon-btn" onClick={() => onNavigate('/settings')} aria-label="Open settings">
            <IconSettings className="w-5 h-5" />
          </button>
        </Tooltip>

        <div style={{ position: 'relative', marginLeft: 4 }} ref={accountRef}>
          <button
            onClick={() => setAccountOpen(o => !o)}
            className="account-pill"
            aria-label="Change account"
            aria-expanded={accountOpen}
          >
            <Avatar person={activeAccount} size="sm" />
            <span style={{ whiteSpace: 'nowrap', fontSize: '.8125rem', fontWeight: 500 }}>Change Account</span>
          </button>

          {accountOpen && (
            <div className="dropdown fade-up" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 280, zIndex: 9999 }}>
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
                {!addingAccount ? (
                  <button
                    className="dropdown-item"
                    style={{ color: 'var(--brand-600)' }}
                    onClick={() => setAddingAccount(true)}
                  >
                    <IconPlus className="w-4 h-4" />
                    Add another account
                  </button>
                ) : (
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <p style={{ margin: '0 0 4px', fontSize: '.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>New account</p>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Full name"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: '.875rem', fontFamily: 'var(--font-sans)', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                      onFocus={e => (e.target.style.borderColor = 'var(--brand-500)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newName.trim() && newEmail.includes('@')) {
                          addAccount(newName.trim(), newEmail.trim());
                          setNewName(''); setNewEmail(''); setAddingAccount(false); setAccountOpen(false);
                        }
                      }}
                      style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: '.875rem', fontFamily: 'var(--font-sans)', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                      onFocus={e => (e.target.style.borderColor = 'var(--brand-500)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => { setAddingAccount(false); setNewName(''); setNewEmail(''); }}
                        style={{ flex: 1, padding: '7px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '.8125rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                      >Cancel</button>
                      <button
                        onClick={() => {
                          if (newName.trim() && newEmail.includes('@')) {
                            addAccount(newName.trim(), newEmail.trim());
                            setNewName(''); setNewEmail(''); setAddingAccount(false); setAccountOpen(false);
                          }
                        }}
                        style={{ flex: 1, padding: '7px', borderRadius: 8, border: 'none', background: 'var(--brand-500)', color: 'white', fontSize: '.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                      >Add</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
