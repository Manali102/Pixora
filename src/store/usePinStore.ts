import React from 'react';
import { create } from 'zustand';
import { Pin } from '../mock/data';
import { mockFetchPins } from '../mock/api';

interface PinState {
  pins: Pin[];
  isLoading: boolean;
  searchQuery: string;
  selectedPin: Pin | null;
  fetchPins: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedPin: (pin: Pin | null) => void;
  addPin: (pin: Pin) => void;
  deletePin: (id: string) => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
}

export const usePinStore = create<PinState>()((set, get) => ({
  pins: [],
  isLoading: false,
  searchQuery: '',
  selectedPin: null,

  fetchPins: async () => {
    set({ isLoading: true });
    const data = await mockFetchPins();
    set({ pins: data, isLoading: false });
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setSelectedPin: (pin: Pin | null) => set({ selectedPin: pin }),

  addPin: (pin: Pin) =>
    set((state) => ({ pins: [pin, ...state.pins] })),

  deletePin: (id: string) =>
    set((state) => ({ pins: state.pins.filter((p) => p.id !== id) })),

  toggleLike: (id: string) =>
    set((state) => {
      const updatedPins = state.pins.map((p) =>
        p.id === id
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      );
      
      const updatedSelectedPin = state.selectedPin?.id === id
        ? updatedPins.find(p => p.id === id) || null
        : state.selectedPin;

      return {
        pins: updatedPins,
        selectedPin: updatedSelectedPin
      };
    }),

  toggleSave: (id: string) =>
    set((state) => {
      const updatedPins = state.pins.map((p) =>
        p.id === id ? { ...p, isSaved: !p.isSaved } : p
      );

      const updatedSelectedPin = state.selectedPin?.id === id
        ? updatedPins.find(p => p.id === id) || null
        : state.selectedPin;

      return {
        pins: updatedPins,
        selectedPin: updatedSelectedPin
      };
    }),
}));

// Selector: filtered pins derived from store state
export const useFilteredPins = () => {
  const pins = usePinStore((state) => state.pins);
  const searchQuery = usePinStore((state) => state.searchQuery);

  return React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return pins;

    return pins.filter(
      (pin) =>
        pin.title.toLowerCase().includes(q) ||
        pin.category.toLowerCase().includes(q) ||
        pin.description.toLowerCase().includes(q)
    );
  }, [pins, searchQuery]);
};
