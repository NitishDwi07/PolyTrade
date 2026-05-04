import { create } from "zustand";
import { getWallet } from "@/lib/api";

type WalletState = {
  balance: number;
  reserved: number;
  setBalance: (amount: number) => void;
  credit: (amount: number) => void;
  debit: (amount: number) => void;
  fetchWallet: (userId: number) => Promise<void>;
};

export const useWalletStore = create<WalletState>((set) => ({
  balance: 1000,
  reserved: 180,
  setBalance: (amount) => set({ balance: amount }),
  credit: (amount) => set((state) => ({ balance: state.balance + amount })),
  debit: (amount) => set((state) => ({ balance: Math.max(0, state.balance - amount) })),
  fetchWallet: async (userId) => {
    const wallet = await getWallet(userId);
    set({ balance: wallet.balance });
  },
}));
