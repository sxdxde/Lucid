import React from 'react';

function SkeletonTopBar() {
  return (
    <div className="topbar" style={{ gap: 12 }}>
      {/* Hamburger placeholder */}
      <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0 }} />
      {/* Logo */}
      <div className="skeleton" style={{ width: 72, height: 22, borderRadius: 6 }} />
      {/* Search bar */}
      <div className="skeleton" style={{ flex: 1, maxWidth: 560, height: 38, borderRadius: 24 }} />
      {/* Right icons */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
      </div>
    </div>
  );
}

function SkeletonSidebar() {
  return (
    <div style={{
      width: 240, flexShrink: 0,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '12px 8px',
      gap: 4,
      overflowY: 'hidden',
    }}>
      {/* Compose button */}
      <div className="skeleton" style={{ height: 48, borderRadius: 24, marginBottom: 8, marginLeft: 4, marginRight: 4 }} />

      {/* Nav items — first one highlighted */}
      {[{ w: '80%', active: true }, { w: '60%' }, { w: '70%' }, { w: '55%' }, { w: '65%' }].map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 99,
          background: item.active ? 'var(--surface-active)' : 'transparent',
        }}>
          <div className="skeleton" style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0 }} />
          <div className="skeleton" style={{ height: 10, width: item.w, borderRadius: 5 }} />
          {i === 0 && (
            <div className="skeleton" style={{ width: 22, height: 16, borderRadius: 8, marginLeft: 'auto' }} />
          )}
        </div>
      ))}

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', margin: '8px 4px' }} />

      {/* Label items */}
      {['65%', '75%', '50%', '60%'].map((w, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', borderRadius: 99,
        }}>
          <div className="skeleton" style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0 }} />
          <div className="skeleton" style={{ height: 9, width: w, borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}

function SkeletonEmailRow({ unread = false }: { unread?: boolean }) {
  return (
    <div className="email-row" style={{ gap: 10, pointerEvents: 'none' }}>
      <div className="skeleton" style={{ width: 18, height: 18, flexShrink: 0, borderRadius: 3 }} />
      <div className="skeleton" style={{ width: 16, height: 16, flexShrink: 0, borderRadius: 3 }} />
      <div className="skeleton" style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ height: 11, width: unread ? '28%' : '22%', borderRadius: 5 }} />
          <div className="skeleton" style={{ height: 9, width: 36, borderRadius: 4 }} />
        </div>
        <div className="skeleton" style={{ height: 11, width: unread ? '75%' : '60%', borderRadius: 5 }} />
        <div className="skeleton" style={{ height: 9, width: '45%', borderRadius: 4 }} />
      </div>
    </div>
  );
}

function SkeletonEmailList() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
        <div className="skeleton" style={{ width: 20, height: 20, borderRadius: 3 }} />
        <div className="skeleton" style={{ width: 24, height: 24, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: 24, height: 24, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: 24, height: 24, borderRadius: 4 }} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <div className="skeleton" style={{ width: 60, height: 20, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: 24, height: 20, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: 24, height: 20, borderRadius: 4 }} />
        </div>
      </div>

      {/* Email rows */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {[true, false, false, true, false, false, false, true, false, false, false, false].map((unread, i) => (
          <SkeletonEmailRow key={i} unread={unread} />
        ))}
      </div>
    </div>
  );
}

export function AppSkeleton() {
  return (
    <div className="app-frame">
      <SkeletonTopBar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SkeletonSidebar />
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex' }} role="main">
          <SkeletonEmailList />
        </main>
      </div>
    </div>
  );
}
