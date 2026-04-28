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
import { LoginLoadingScreen }  from './components/ui/LoginLoadingScreen';
import { OnboardingTutorial, shouldShowOnboarding } from './components/ui/OnboardingTutorial';
import { AppSkeleton }   from './components/ui/AppSkeleton';
import { useUiStore }    from './stores/uiStore';
import { useEmailStore } from './stores/emailStore';
import { useKeyboard }   from './hooks/useKeyboard';
import './App.css';

type AppView = 'landing' | 'loading' | 'inbox' | 'detail' | 'settings';

function MainApp({ showOnboarding, onOnboardingDone }: { showOnboarding: boolean; onOnboardingDone: () => void }) {
  useKeyboard();

  const { composeWindows, userPreferences } = useUiStore();
  const { selectedEmailId, setSelectedEmail, markRead } = useEmailStore();

  const [view, setView]               = useState<Exclude<AppView, 'landing' | 'loading'>>('inbox');
  const [previewEmailId, setPreviewEmailId] = useState<string | null>(null);
  const [settingsTab, setSettingsTab] = useState<string>('appearance');
  const [appReady, setAppReady]       = useState(false);

  useEffect(() => {
    const pct = typeof userPreferences.zoom === 'number' ? userPreferences.zoom : 100;
    document.documentElement.style.fontSize = (14 * pct / 100).toFixed(2) + 'px';
    if (userPreferences.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  // Simulate initial data load — show skeleton briefly then reveal real app
  useEffect(() => {
    const timer = setTimeout(() => setAppReady(true), 1300);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (path: string) => {
    if (path === '/settings') { setSettingsTab('appearance'); setView('settings'); }
    if (path === '/inbox')    { setSelectedEmail(null); setPreviewEmailId(null); setView('inbox'); }
  };

  const handleEditShortcuts = () => {
    setSettingsTab('shortcuts');
    setView('settings');
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

  // Show full-page skeleton while app data "loads"
  if (!appReady) {
    return (
      <>
        <AppSkeleton />
        {/* Onboarding waits until app is ready — don't show over skeleton */}
      </>
    );
  }

  if (view === 'settings') {
    return (
      <>
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
          <KeyboardShortcutsOverlay onEditShortcuts={handleEditShortcuts} />
        </div>
        {showOnboarding && <OnboardingTutorial onClose={onOnboardingDone} />}
      </>
    );
  }

  return (
    <>
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
        <KeyboardShortcutsOverlay onEditShortcuts={handleEditShortcuts} />
      </div>

      {showOnboarding && <OnboardingTutorial onClose={onOnboardingDone} />}
    </>
  );
}

export default function App() {
  const [appView, setAppView]           = useState<AppView>('landing');
  const [userName, setUserName]         = useState('Sudarshan');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleLogin = (name: string) => {
    setUserName(name);
    setAppView('loading');
  };

  const handleLoadingComplete = () => {
    setAppView('inbox');
    if (shouldShowOnboarding()) {
      setShowOnboarding(true);
    }
  };

  if (appView === 'landing') {
    return <LandingPage onLogin={handleLogin} />;
  }

  if (appView === 'loading') {
    return <LoginLoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <MainApp
      showOnboarding={showOnboarding}
      onOnboardingDone={() => setShowOnboarding(false)}
    />
  );
}
