// HCI: S7 Locus of Control — per-account sign-out, not forced all-or-nothing
// HCI: N1 Visibility — active account always shown in header
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockAccounts } from '../data/mockEmails';
import type { Account } from '../types';

interface AccountStore {
  accounts: Account[];
  activeAccountId: string;

  switchAccount: (id: string) => void;
  signOutAccount: (id: string) => void;
  addAccount: (name: string, email: string) => void;
  updateAccountName: (id: string, name: string) => void;
  getActiveAccount: () => Account;
}

export const useAccountStore = create<AccountStore>()(
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
            ? (remaining[0]?.id ?? '')
            : state.activeAccountId;
          return { accounts: remaining, activeAccountId: newActive };
        });
      },

      updateAccountName: (id, name) => {
        const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';
        set(state => ({
          accounts: state.accounts.map(a =>
            a.id === id ? { ...a, name, avatar: initials } : a
          ),
        }));
      },

      addAccount: (name, email) => {
        const COLORS = ['#6366f1','#0891b2','#059669','#d97706','#dc2626','#7c3aed','#be185d'];
        const id = `acc-${Date.now()}`;
        const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || email[0].toUpperCase();
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const account: import('../types').Account = { id, name, email, avatar: initials, color };
        set(state => ({ accounts: [...state.accounts, account], activeAccountId: id }));
      },

      getActiveAccount: () => {
        const { accounts, activeAccountId } = get();
        return accounts.find(a => a.id === activeAccountId) ?? accounts[0];
      },
    }),
    { name: 'clearmail-accounts', version: 2 }
  )
);
