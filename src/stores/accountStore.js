// HCI: S7 Locus of Control — per-account sign-out, not forced all-or-nothing
// HCI: N1 Visibility — active account always shown in header
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockAccounts } from '../data/mockEmails';

export const useAccountStore = create(
  persist(
    (set, get) => ({
      accounts: mockAccounts,
      activeAccountId: 'primary',

      switchAccount: (id) => {
        const account = get().accounts.find(a => a.id === id);
        if (account) set({ activeAccountId: id });
      },

      signOutAccount: (id) => {
        set(state => {
          const remaining = state.accounts.filter(a => a.id !== id);
          const newActive = state.activeAccountId === id
            ? (remaining[0]?.id ?? null)
            : state.activeAccountId;
          return { accounts: remaining, activeAccountId: newActive };
        });
      },

      getActiveAccount: () => {
        const { accounts, activeAccountId } = get();
        return accounts.find(a => a.id === activeAccountId) ?? accounts[0];
      },
    }),
    { name: 'clearmail-accounts' }
  )
);
