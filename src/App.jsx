// HCI: Jakob's Law — familiar layout; compact sidebar, top bar, content pane
// HCI: G8 Continuity — consistent chrome on every screen
// HCI: S5 Reversal — undo available globally via keyboard + toast
// HCI: D6 Affordance — compose blurs background to signal modal focus
import React, { useState, useEffect } from 'react';
import { TopBar }        from './components/layout/TopBar';
import { Sidebar }       from './components/layout/Sidebar';
import { EmailList }     from './components/email/EmailList';
import { EmailDetail }   from './components/email/EmailDetail';
import { ComposeWindow } from './components/compose/ComposeWindow';
import { Chat }          from './components/chat/Chat';
import { ToastContainer }           from './components/ui/Toast';
import { ConfirmDialog }            from './components/ui/ConfirmDialog';
import { KeyboardShortcutsOverlay } from './components/ui/KeyboardShortcutsOverlay';
import { Settings }      from './pages/Settings';
import { useUiStore }    from './stores/uiStore';
import { useEmailStore } from './stores/emailStore';
import { useKeyboard }   from './hooks/useKeyboard';
import './App.css';

export default function App() {
  useKeyboard();

  const { composeWindows, userPreferences } = useUiStore();
  const { selectedEmailId, setSelectedEmail, markRead } = useEmailStore();

  const [view, setView]                     = useState('inbox');
  const [previewEmailId, setPreviewEmailId] = useState(null);

  // Apply zoom and theme on mount (persisted preferences need re-application)
  useEffect(() => {
    const sizes = { small: '12px', default: '14px', large: '16px' };
    document.documentElement.style.fontSize = sizes[userPreferences.zoom ?? 'default'] ?? '14px';
    if (userPreferences.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const handleNavigate = (path) => {
    if (path === '/settings') setView('settings');
  };

  const handleEmailSelect = (id) => {
    if (previewEmailId === id) return;
    setPreviewEmailId(id);
    markRead([id], true);
  };

  const handleViewDetail = (id) => {
    setSelectedEmail(id);
    setPreviewEmailId(null);
    setView('detail');
  };

  const handleBack = () => {
    setSelectedEmail(null);
    setPreviewEmailId(null);
    setView('inbox');
  };

  const handleLabelSelect = () => {
    setPreviewEmailId(null);
    setSelectedEmail(null);
    setView('inbox');
  };

  const hasCompose = composeWindows.length > 0;

  if (view === 'settings') {
    return (
      <div className="app-frame">
        <TopBar onNavigate={handleNavigate} />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar onLabelSelect={handleLabelSelect} />
          <main style={{ flex: 1, overflow: 'hidden' }} role="main">
            <Settings onBack={() => setView('inbox')} />
          </main>
        </div>
        <ToastContainer />
        <ConfirmDialog />
        <KeyboardShortcutsOverlay />
      </div>
    );
  }

  return (
    <div className="app-frame">
      <TopBar onNavigate={handleNavigate} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar onLabelSelect={handleLabelSelect} />

        <main
          style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}
          role="main"
          aria-label="Email content"
        >
          {view === 'detail' ? (
            <EmailDetail emailId={selectedEmailId} onBack={handleBack} />
          ) : (
            <EmailList
              onEmailSelect={handleEmailSelect}
              previewEmailId={previewEmailId}
              onViewDetail={handleViewDetail}
            />
          )}
        </main>
      </div>

      {/* Compose backdrop blur */}
      {hasCompose && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(32, 33, 36, 0.28)',
            backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
            zIndex: 48,
          }}
          aria-hidden="true"
        />
      )}

      {/* Floating compose windows */}
      {composeWindows.map((w, i) => (
        <div
          key={w.id}
          style={{ position: 'fixed', right: 16 + i * (548 + 8), bottom: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }}
        >
          <ComposeWindow windowData={w} />
        </div>
      ))}

      {/* Chat panel */}
      <Chat />

      <ToastContainer />
      <ConfirmDialog />
      <KeyboardShortcutsOverlay />
    </div>
  );
}
