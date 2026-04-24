import { create } from 'zustand';

interface ModalState {
  currentModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  currentModal: null,
  openModal: (modalName) => set({ currentModal: modalName }),
  closeModal: () => set({ currentModal: null }),
}));
