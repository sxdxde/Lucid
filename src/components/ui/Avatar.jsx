// HCI: P4 Dual-Coding — avatar + name initials for recognition
// HCI: G6 Similarity — consistent avatar style throughout
import React from 'react';

// Deterministic pastel colors based on name
const PALETTE = [
  '#4285F4','#EA4335','#34A853','#FBBC04','#9C27B0',
  '#FF6D00','#00BCD4','#607D8B','#E91E63','#795548',
];

function getColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ person, size = 'md', style: extraStyle }) {
  const name = person?.name || person?.email || '?';
  const bg = person?.color || getColor(name);
  const initials = person?.avatar || getInitials(name);
  return (
    <div
      className={`avatar avatar--${size}`}
      style={{ background: bg, ...extraStyle }}
      aria-label={name}
      role="img"
    >
      {initials}
    </div>
  );
}
