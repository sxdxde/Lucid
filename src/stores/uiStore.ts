// HCI: S7 Locus of Control — user preferences persist across sessions
// HCI: N1 Visibility of System Status — toast queue and chat state always reflect reality
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ComposeWindowData, Toast, ConfirmDialogConfig, UserPreferences } from '../types';
import type { Person } from '../types';

let toastId = 0;

interface ShowToastOptions {
  message: string;
  type?: 'info' | 'success' | 'error';
  duration?: number;
  undoAction?: string | null;
  retryAction?: (() => void) | null;
}

interface UiStore {
  sidebarExpanded: boolean;
  composeOpen: boolean;
  composeWindows: ComposeWindowData[];
  activeView: string;
  toastQueue: Toast[];
  keyboardShortcutsVisible: boolean;
  confirmDialog: ConfirmDialogConfig | null;
  searchFocused: boolean;
  chatOpen: boolean;
  chatContact: Person | null;
  userPreferences: UserPreferences;

  toggleSidebar: () => void;
  openCompose: (prefill?: Partial<ComposeWindowData>) => string;
  closeCompose: (id: string) => void;
  updateCompose: (id: string, fields: Partial<ComposeWindowData>) => void;
  openChat: (contact: Person) => void;
  closeChat: () => void;
  setActiveView: (view: string) => void;
  setSearchFocused: (val: boolean) => void;
  setKeyboardShortcutsVisible: (val: boolean) => void;
  showToast: (opts: ShowToastOptions) => number;
  dismissToast: (id: number) => void;
  showConfirmDialog: (config: ConfirmDialogConfig) => void;
  hideConfirmDialog: () => void;
  setPreference: (key: keyof UserPreferences, value: UserPreferences[keyof UserPreferences]) => void;
  setCustomShortcut: (actionId: string, key: string) => void;
  resetShortcuts: () => void;
}

const DEFAULT_SHORTCUTS: Record<string, string> = {
  compose: 'c', search: '/', help: '?', undo: 'z',
  delete: '#', goInbox: 'gi', goSent: 'gs',
  goTrash: 'gt', goDrafts: 'gd', reply: 'r', forward: 'f',
};

export const useUiStore = create<UiStore>()(
  persist(
    (set, get) => ({
      sidebarExpanded: false,
      composeOpen: false,
      composeWindows: [],
      activeView: 'list',
      toastQueue: [],
      keyboardShortcutsVisible: false,
      confirmDialog: null,
      searchFocused: false,
      chatOpen: false,
      chatContact: null,

      userPreferences: {
        density: 'comfortable',
        theme: 'light',
        zoom: 100,
        keyboardShortcutsEnabled: true,
        customShortcuts: { ...DEFAULT_SHORTCUTS },
      },

      toggleSidebar: () => set(s => ({ sidebarExpanded: !s.sidebarExpanded })),

      openCompose: (prefill = {}) => {
        const id = `compose-${Date.now()}`;
        set(state => ({
          composeOpen: true,
          composeWindows: [...state.composeWindows, { id, to: '', subject: '', body: '', cc: '', bcc: '', ...prefill }],
        }));
        return id;
      },

      closeCompose: (id) => {
        set(state => {
          const windows = state.composeWindows.filter(w => w.id !== id);
          return { composeWindows: windows, composeOpen: windows.length > 0 };
        });
      },

      updateCompose: (id, fields) => {
        set(state => ({
          composeWindows: state.composeWindows.map(w => w.id === id ? { ...w, ...fields } : w),
        }));
      },

      openChat: (contact) => set({ chatOpen: true, chatContact: contact }),
      closeChat: () => set({ chatOpen: false, chatContact: null }),

      setActiveView: (view) => set({ activeView: view }),
      setSearchFocused: (val) => set({ searchFocused: val }),
      setKeyboardShortcutsVisible: (val) => set({ keyboardShortcutsVisible: val }),

      showToast: ({ message, type = 'info', duration = 4000, undoAction = null, retryAction = null }) => {
        const id = ++toastId;
        set(state => {
          const queue = state.toastQueue.slice(-2);
          return { toastQueue: [...queue, { id, message, type, duration, undoAction, retryAction, exiting: false }] };
        });
        if (duration > 0) setTimeout(() => get().dismissToast(id), duration);
        return id;
      },

      dismissToast: (id) => {
        set(state => ({ toastQueue: state.toastQueue.filter(t => t.id !== id) }));
      },

      showConfirmDialog: (config) => set({ confirmDialog: config }),
      hideConfirmDialog: () => set({ confirmDialog: null }),

      setPreference: (key, value) => {
        set(state => ({
          userPreferences: { ...state.userPreferences, [key]: value },
        }));
        if (key === 'theme') applyTheme(value as string);
        if (key === 'zoom') applyZoom(value as number);
      },

      setCustomShortcut: (actionId, key) => {
        set(state => ({
          userPreferences: {
            ...state.userPreferences,
            customShortcuts: { ...state.userPreferences.customShortcuts, [actionId]: key },
          },
        }));
      },

      resetShortcuts: () => {
        set(state => ({
          userPreferences: {
            ...state.userPreferences,
            customShortcuts: { ...DEFAULT_SHORTCUTS },
          },
        }));
      },
    }),
    {
      name: 'lucidmail-ui',
      partialize: (state) => ({
        userPreferences: state.userPreferences,
        sidebarExpanded: state.sidebarExpanded,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.userPreferences?.theme ?? 'light');
          applyZoom(state.userPreferences?.zoom ?? 100);
        }
      },
    }
  )
);

function applyTheme(value: string) {
  const root = document.documentElement;
  if (value === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

function applyZoom(value: number | string) {
  const pct = typeof value === 'number' ? value : 100;
  document.documentElement.style.fontSize = (14 * pct / 100).toFixed(2) + 'px';
}
