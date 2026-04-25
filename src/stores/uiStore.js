// HCI: S7 Locus of Control — user preferences persist across sessions
// HCI: N1 Visibility of System Status — toast queue and chat state always reflect reality
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

let toastId = 0;

export const useUiStore = create(
  persist(
    (set, get) => ({
      sidebarExpanded: false,   // compact (68px) vs expanded (220px)
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
        zoom: 'default',          // 'small' | 'default' | 'large'
        keyboardShortcutsEnabled: true,
        customShortcuts: {
          compose: 'c',
          search: '/',
          help: '?',
          undo: 'z',
          delete: '#',
          goInbox: 'gi',
          goSent: 'gs',
          goTrash: 'gt',
          goDrafts: 'gd',
          reply: 'r',
          forward: 'f',
        },
      },

      // ── Sidebar ──────────────────────────────────────────
      toggleSidebar: () => set(s => ({ sidebarExpanded: !s.sidebarExpanded })),

      // ── Compose ──────────────────────────────────────────
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

      // ── Chat ─────────────────────────────────────────────
      openChat: (contact) => set({ chatOpen: true, chatContact: contact }),
      closeChat: () => set({ chatOpen: false, chatContact: null }),

      // ── UI state ─────────────────────────────────────────
      setActiveView: (view) => set({ activeView: view }),
      setSearchFocused: (val) => set({ searchFocused: val }),
      setKeyboardShortcutsVisible: (val) => set({ keyboardShortcutsVisible: val }),

      // ── Toasts ───────────────────────────────────────────
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

      // ── Confirm dialog ───────────────────────────────────
      showConfirmDialog: (config) => set({ confirmDialog: config }),
      hideConfirmDialog: () => set({ confirmDialog: null }),

      // ── Preferences ──────────────────────────────────────
      setPreference: (key, value) => {
        set(state => ({
          userPreferences: { ...state.userPreferences, [key]: value },
        }));
        if (key === 'theme') applyTheme(value);
        if (key === 'zoom') applyZoom(value);
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
            customShortcuts: {
              compose: 'c', search: '/', help: '?', undo: 'z',
              delete: '#', goInbox: 'gi', goSent: 'gs',
              goTrash: 'gt', goDrafts: 'gd', reply: 'r', forward: 'f',
            },
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
          applyZoom(state.userPreferences?.zoom ?? 'default');
        }
      },
    }
  )
);

function applyTheme(value) {
  const root = document.documentElement;
  if (value === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

function applyZoom(value) {
  const sizes = { small: '12px', default: '14px', large: '16px' };
  document.documentElement.style.fontSize = sizes[value] ?? '14px';
}
