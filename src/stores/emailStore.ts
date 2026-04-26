// HCI: S5 Permit Easy Reversal — undo stack for all destructive actions
// HCI: S3 Informative Feedback — state changes trigger UI updates
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockEmails, mockLabels } from '../data/mockEmails';
import type { Email, Label, UndoAction } from '../types';

const MAX_UNDO = 10;

interface EmailStore {
  emails: Email[];
  selectedEmailId: string | null;
  selectedThreadId: string | null;
  searchQuery: string;
  activeLabel: string;
  activeAccount: string | null;
  undoStack: UndoAction[];
  customLabels: Label[];

  setSelectedEmail: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setActiveLabel: (label: string) => void;
  setActiveAccount: (accountId: string | null) => void;

  markRead: (ids: string[], isRead?: boolean) => void;
  toggleStar: (id: string) => void;
  archive: (ids: string[]) => void;
  trash: (ids: string[]) => void;
  permanentDelete: (ids: string[]) => void;
  restoreToInbox: (ids: string[]) => void;
  moveToLabel: (ids: string[], label: string) => void;
  addLabel: (ids: string[], label: string) => void;
  removeLabel: (ids: string[], label: string) => void;
  undoLastAction: () => UndoAction | null;

  sendEmail: (email: Partial<Email>) => void;
  saveDraft: (draft: Email) => void;
  deleteDraft: (id: string) => void;

  createLabel: (label: Label) => void;
  deleteLabel: (id: string) => void;
  reorderLabels: (newOrder: Label[]) => void;

  getEmailsByLabel: (label: string, accountId?: string | null) => Email[];
  getUnreadCount: (label: string) => number;
}

export const useEmailStore = create<EmailStore>()(
  persist(
    (set, get) => ({
      emails: mockEmails,
      selectedEmailId: null,
      selectedThreadId: null,
      searchQuery: '',
      activeLabel: 'inbox',
      activeAccount: null,
      undoStack: [],
      customLabels: mockLabels.filter(l => !l.system),

      setSelectedEmail: (id) => set({
        selectedEmailId: id,
        selectedThreadId: id ? get().emails.find(e => e.id === id)?.threadId ?? null : null,
      }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setActiveLabel: (label) => set({ activeLabel: label, selectedEmailId: null }),
      setActiveAccount: (accountId) => set({ activeAccount: accountId }),

      markRead: (ids, isRead = true) => {
        const prev = get().emails.filter(e => ids.includes(e.id)).map(e => ({ ...e }));
        set(state => ({
          emails: state.emails.map(e => ids.includes(e.id) ? { ...e, isRead } : e),
          undoStack: [
            { type: 'markRead', emails: prev, isRead: !isRead },
            ...state.undoStack.slice(0, MAX_UNDO - 1),
          ],
        }));
      },

      toggleStar: (id) => {
        set(state => ({
          emails: state.emails.map(e => e.id === id ? { ...e, isStarred: !e.isStarred } : e),
        }));
      },

      // ── Core location transitions ──────────────────────────
      // Rule: an email can only be in ONE "location" at a time
      // (inbox, archived, or trash). Custom labels are always preserved.
      // 'sent', 'drafts', 'spam' are also preserved as metadata.

      archive: (ids) => {
        const prev = get().emails.filter(e => ids.includes(e.id)).map(e => ({ ...e }));
        set(state => ({
          emails: state.emails.map(e => ids.includes(e.id)
            // Remove both inbox and trash (works from inbox, trash, or anywhere)
            ? { ...e, labels: [...e.labels.filter(l => l !== 'inbox' && l !== 'trash'), 'archived'] }
            : e),
          selectedEmailId: null,
          undoStack: [
            { type: 'archive', emails: prev },
            ...state.undoStack.slice(0, MAX_UNDO - 1),
          ],
        }));
      },

      trash: (ids) => {
        const prev = get().emails.filter(e => ids.includes(e.id)).map(e => ({ ...e }));
        set(state => ({
          emails: state.emails.map(e => ids.includes(e.id)
            // Remove inbox and archived (works from inbox, archive, or anywhere)
            ? { ...e, labels: [...e.labels.filter(l => l !== 'inbox' && l !== 'archived'), 'trash'] }
            : e),
          selectedEmailId: null,
          undoStack: [
            { type: 'trash', emails: prev },
            ...state.undoStack.slice(0, MAX_UNDO - 1),
          ],
        }));
      },

      permanentDelete: (ids) => {
        set(state => ({
          emails: state.emails.filter(e => !ids.includes(e.id)),
          selectedEmailId: null,
        }));
      },

      // Restore email from trash OR archive back to inbox
      restoreToInbox: (ids) => {
        const prev = get().emails.filter(e => ids.includes(e.id)).map(e => ({ ...e }));
        set(state => ({
          emails: state.emails.map(e => ids.includes(e.id)
            ? { ...e, labels: [...e.labels.filter(l => l !== 'trash' && l !== 'archived'), 'inbox'] }
            : e),
          selectedEmailId: null,
          undoStack: [
            { type: 'move', emails: prev, label: 'inbox' },
            ...state.undoStack.slice(0, MAX_UNDO - 1),
          ],
        }));
      },

      moveToLabel: (ids, label) => {
        const prev = get().emails.filter(e => ids.includes(e.id)).map(e => ({ ...e }));
        set(state => ({
          emails: state.emails.map(e => ids.includes(e.id)
            ? { ...e, labels: [...new Set([...e.labels.filter(l => l !== 'inbox' && l !== 'trash'), label])] }
            : e),
          undoStack: [
            { type: 'move', emails: prev, label },
            ...state.undoStack.slice(0, MAX_UNDO - 1),
          ],
        }));
      },

      addLabel: (ids, label) => {
        set(state => ({
          emails: state.emails.map(e => ids.includes(e.id)
            ? { ...e, labels: [...new Set([...e.labels, label])] }
            : e),
        }));
      },

      removeLabel: (ids, label) => {
        set(state => ({
          emails: state.emails.map(e => ids.includes(e.id)
            ? { ...e, labels: e.labels.filter(l => l !== label) }
            : e),
        }));
      },

      undoLastAction: () => {
        const { undoStack } = get();
        if (undoStack.length === 0) return null;
        const [action, ...rest] = undoStack;
        if (action.type === 'archive' || action.type === 'trash' || action.type === 'move') {
          set(state => ({
            emails: state.emails.map(e => {
              const restored = action.emails.find(r => r.id === e.id);
              return restored || e;
            }),
            undoStack: rest,
          }));
        } else if (action.type === 'markRead') {
          set(state => ({
            emails: state.emails.map(e => {
              const restored = action.emails.find(r => r.id === e.id);
              return restored ? { ...e, isRead: action.isRead ?? e.isRead } : e;
            }),
            undoStack: rest,
          }));
        }
        return action;
      },

      sendEmail: (email) => {
        const newEmail: Email = {
          id: `sent-${Date.now()}`,
          threadId: `t-sent-${Date.now()}`,
          timestamp: new Date().toISOString(),
          isRead: true,
          isStarred: false,
          labels: ['sent'],
          from: email.from ?? { name: 'Me', email: 'me@lucidmail.app', avatar: 'ME', color: '#6366f1' },
          to: email.to ?? [],
          subject: email.subject ?? '',
          preview: email.preview ?? '',
          body: email.body ?? '',
          account: email.account ?? 'primary',
          attachments: email.attachments ?? [],
        };
        set(state => ({ emails: [newEmail, ...state.emails] }));
      },

      saveDraft: (draft) => {
        const existing = get().emails.find(e => e.id === draft.id);
        if (existing) {
          set(state => ({ emails: state.emails.map(e => e.id === draft.id ? { ...e, ...draft } : e) }));
        } else {
          set(state => ({ emails: [{ ...draft, labels: ['drafts'], isRead: true }, ...state.emails] }));
        }
      },

      deleteDraft: (id) => {
        set(state => ({ emails: state.emails.filter(e => e.id !== id) }));
      },

      createLabel: (label) => {
        set(state => ({ customLabels: [...state.customLabels, label] }));
      },

      deleteLabel: (id) => {
        set(state => ({
          customLabels: state.customLabels.filter(l => l.id !== id),
          emails: state.emails.map(e => ({ ...e, labels: e.labels.filter(l => l !== id) })),
        }));
      },

      reorderLabels: (newOrder) => {
        set({ customLabels: newOrder });
      },

      getEmailsByLabel: (label, accountId = null) => {
        const { emails } = get();
        return emails.filter(e => {
          const inTrash  = e.labels.includes('trash');
          const inSpam   = e.labels.includes('spam');
          const inLabel =
            label === 'allmail'
              ? !inTrash && !inSpam
              : label === 'inbox'
              ? e.labels.includes('inbox') && !inTrash
              : label === 'starred'
              // Starred: not in trash or spam
              ? (e.isStarred) && !inTrash && !inSpam
              : label === 'archived'
              ? e.labels.includes('archived') && !inTrash
              : label === 'sent'
              ? e.labels.includes('sent') && !inTrash
              : label === 'trash'
              ? inTrash
              : label === 'spam'
              ? inSpam
              : e.labels.includes(label) && !inTrash;

          // allmail shows all accounts; inbox/archive filter by active account
          const inAccount = (label === 'allmail' || label === 'trash' || label === 'spam')
            ? true
            : !accountId || e.account === accountId;
          return inLabel && inAccount;
        });
      },

      getUnreadCount: (label) => {
        const { emails } = get();
        if (label === 'inbox') {
          return emails.filter(e =>
            e.labels.includes('inbox') && !e.labels.includes('trash') && !e.isRead
          ).length;
        }
        if (label === 'archived') {
          return emails.filter(e =>
            e.labels.includes('archived') && !e.labels.includes('trash') && !e.isRead
          ).length;
        }
        return emails.filter(e => e.labels.includes(label) && !e.isRead).length;
      },
    }),
    {
      name: 'clearmail-emails',
      partialize: (state) => ({
        emails: state.emails.filter(e => e.labels.includes('drafts')),
        customLabels: state.customLabels,
      }),
    }
  )
);
