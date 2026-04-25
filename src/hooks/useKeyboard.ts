// HCI: N7 Flexibility & Efficiency — keyboard shortcuts for power users
// HCI: S2 Enable Shortcuts — discoverable via ? overlay, customisable in Settings
import { useEffect, useRef } from 'react';
import { useUiStore } from '../stores/uiStore';
import { useEmailStore } from '../stores/emailStore';
import type { ShortcutDef } from '../types';

export function useKeyboard() {
  const { openCompose, setKeyboardShortcutsVisible, showToast, userPreferences } = useUiStore();
  const { setActiveLabel, undoLastAction, archive, trash, selectedEmailId } = useEmailStore();
  const sequenceRef = useRef('');
  const sequenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userPreferences.keyboardShortcutsEnabled) return;

    const sc = userPreferences.customShortcuts ?? {};

    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      const isEditing = tag === 'input' || tag === 'textarea' || (e.target as HTMLElement).contentEditable === 'true';

      if (e.key === 'Escape') {
        useUiStore.getState().setKeyboardShortcutsVisible(false);
        return;
      }

      if (isEditing) return;

      const key = e.key;

      if (key.toLowerCase() === sc.compose?.toLowerCase()) { e.preventDefault(); openCompose(); return; }
      if (key === sc.search) { e.preventDefault(); useUiStore.getState().setSearchFocused(true); return; }
      if (key === sc.help) { e.preventDefault(); setKeyboardShortcutsVisible(true); return; }
      if (key.toLowerCase() === sc.undo?.toLowerCase() && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const action = undoLastAction();
        if (action) showToast({ message: 'Action undone', type: 'success', duration: 2000 });
        else showToast({ message: 'Nothing to undo', type: 'info', duration: 2000 });
        return;
      }
      if (key.toLowerCase() === sc.archive?.toLowerCase()) {
        e.preventDefault();
        if (selectedEmailId) { archive([selectedEmailId]); showToast({ message: 'Archived', type: 'info', undoAction: 'archive' }); }
        return;
      }
      if (key === sc.delete) {
        e.preventDefault();
        if (selectedEmailId) { trash([selectedEmailId]); showToast({ message: 'Moved to Trash', type: 'info', undoAction: 'trash' }); }
        return;
      }

      sequenceRef.current += key.toLowerCase();
      if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
      sequenceTimerRef.current = setTimeout(() => { sequenceRef.current = ''; }, 800);

      const seq = sequenceRef.current;
      const gi = sc.goInbox  ?? 'gi';
      const gs = sc.goSent   ?? 'gs';
      const gt = sc.goTrash  ?? 'gt';
      const gd = sc.goDrafts ?? 'gd';
      if (seq.endsWith(gi)) { setActiveLabel('inbox');  sequenceRef.current = ''; }
      if (seq.endsWith(gs)) { setActiveLabel('sent');   sequenceRef.current = ''; }
      if (seq.endsWith(gt)) { setActiveLabel('trash');  sequenceRef.current = ''; }
      if (seq.endsWith(gd)) { setActiveLabel('drafts'); sequenceRef.current = ''; }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [userPreferences.keyboardShortcutsEnabled, userPreferences.customShortcuts, selectedEmailId]);
}

export const SHORTCUT_DEFS: ShortcutDef[] = [
  { id: 'compose',  category: 'Actions',       description: 'Compose new email',      defaultKey: 'c',  twoKey: false },
  { id: 'archive',  category: 'Actions',       description: 'Archive selected',        defaultKey: 'e',  twoKey: false },
  { id: 'delete',   category: 'Actions',       description: 'Delete selected',         defaultKey: '#',  twoKey: false },
  { id: 'undo',     category: 'Actions',       description: 'Undo last action',        defaultKey: 'z',  twoKey: false },
  { id: 'reply',    category: 'Actions',       description: 'Reply to email',          defaultKey: 'r',  twoKey: false },
  { id: 'forward',  category: 'Actions',       description: 'Forward email',           defaultKey: 'f',  twoKey: false },
  { id: 'goInbox',  category: 'Navigation',    description: 'Go to Inbox',             defaultKey: 'gi', twoKey: true  },
  { id: 'goSent',   category: 'Navigation',    description: 'Go to Sent',              defaultKey: 'gs', twoKey: true  },
  { id: 'goTrash',  category: 'Navigation',    description: 'Go to Trash',             defaultKey: 'gt', twoKey: true  },
  { id: 'goDrafts', category: 'Navigation',    description: 'Go to Drafts',            defaultKey: 'gd', twoKey: true  },
  { id: 'search',   category: 'Search & Help', description: 'Focus search bar',        defaultKey: '/',  twoKey: false },
  { id: 'help',     category: 'Search & Help', description: 'Show keyboard shortcuts', defaultKey: '?',  twoKey: false },
];
