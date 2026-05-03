import { create } from "zustand";

type WalletState = {
  balance: number;
  reserved: number;
  credit: (amount: number) => void;
  debit: (amount: number) => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  balance: 1000,
  reserved: 180,
  credit: (amount) => set((state) => ({ balance: state.balance + amount })),
  debit: (amount) => set((state) => ({ balance: Math.max(0, state.balance - amount) })),
}));
