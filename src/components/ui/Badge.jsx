// HCI: N1 Visibility — unread count always visible next to folder name
// HCI: S8 Reduce STM Load — user doesn't need to count unread emails
import React from 'react';

export function Badge({ count }) {
  if (!count || count === 0) return null;
  return (
    <span className="badge" style={{ fontSize: '.6875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
      {count > 999 ? '999+' : count}
    </span>
  );
}
