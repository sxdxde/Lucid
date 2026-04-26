import React, { useState, useEffect } from 'react';
import { LandingPage }  from './pages/LandingPage';
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

type AppView = 'landing' | 'inbox' | 'detail' | 'settings';

function MainApp() {
  useKeyboard();

  const { composeWindows, userPreferences } = useUiStore();
  const { selectedEmailId, setSelectedEmail, markRead } = useEmailStore();

  const [view, setView]               = useState<Exclude<AppView, 'landing'>>('inbox');
  const [previewEmailId, setPreviewEmailId] = useState<string | null>(null);
  const [settingsTab, setSettingsTab] = useState<string>('appearance');

  useEffect(() => {
    const sizes: Record<string, string> = { small: '12px', default: '14px', large: '16px' };
    document.documentElement.style.fontSize = sizes[userPreferences.zoom ?? 'default'] ?? '14px';
    if (userPreferences.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const handleNavigate = (path: string) => {
    if (path === '/settings') { setSettingsTab('appearance'); setView('settings'); }
  };

  const handleEmailSelect = (id: string) => {
    if (previewEmailId === id) return;
    setPreviewEmailId(id);
    markRead([id], true);
  };

  const handleViewDetail = (id: string) => {
    setSelectedEmail(id);
    setPreviewEmailId(null);
    setView('detail');
  };

  const handleBack = () => {
    setSelectedEmail(null);
    setPreviewEmailId(null);
    setView('inbox');
  };

  const handleLabelSelect = (id?: string) => {
    setPreviewEmailId(null);
    setSelectedEmail(null);
    if (id === '__create_label__') { setSettingsTab('tags'); setView('settings'); }
    else setView('inbox');
  };

  const hasCompose = composeWindows.length > 0;

  if (view === 'settings') {
    return (
      <div className="app-frame">
        <TopBar onNavigate={handleNavigate} />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar onLabelSelect={handleLabelSelect} />
          <main style={{ flex: 1, overflow: 'hidden' }} role="main">
            <Settings onBack={() => setView('inbox')} initialTab={settingsTab} />
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

      {hasCompose && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(32,33,36,.28)', backdropFilter: 'blur(3px)', zIndex: 48 }}
          aria-hidden="true"
        />
      )}

      {composeWindows.map((w, i) => (
        <div key={w.id} style={{ position: 'fixed', right: 16 + i * 556, bottom: 0, zIndex: 50 }}>
          <ComposeWindow windowData={w} />
        </div>
      ))}

      <Chat />
      <ToastContainer />
      <ConfirmDialog />
      <KeyboardShortcutsOverlay />
    </div>
  );
}

export default function App() {
  const [appView, setAppView] = useState<AppView>('landing');
  const [userName, setUserName] = useState('Sudarshan');

  const handleLogin = (name: string) => {
    setUserName(name);
    setAppView('inbox');
  };

  if (appView === 'landing') {
    return <LandingPage onLogin={handleLogin} />;
  }

  return <MainApp />;
}
