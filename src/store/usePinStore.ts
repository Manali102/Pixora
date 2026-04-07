import { create } from 'zustand';
import { Pin } from '../mock/data';
import { mockFetchPins } from '../mock/api';

interface PinState {
  pins: Pin[];
  isLoading: boolean;
  searchQuery: string;
  // Derived (computed inline via selector)
  fetchPins: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  addPin: (pin: Pin) => void;
  deletePin: (id: string) => void;
  toggleLike: (id: string) => void;
}

export const usePinStore = create<PinState>()((set, get) => ({
  pins: [],
  isLoading: false,
  searchQuery: '',

  fetchPins: async () => {
    set({ isLoading: true });
    const data = await mockFetchPins();
    set({ pins: data, isLoading: false });
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  addPin: (pin: Pin) =>
    set((state) => ({ pins: [pin, ...state.pins] })),

  deletePin: (id: string) =>
    set((state) => ({ pins: state.pins.filter((p) => p.id !== id) })),

  toggleLike: (id: string) =>
    set((state) => ({
      pins: state.pins.map((p) =>
        p.id === id
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      ),
    })),
}));

// Selector: filtered pins derived from store state (memoized by Zustand)
export const useFilteredPins = () =>
  usePinStore((state) => {
    const q = state.searchQuery.toLowerCase();
    if (!q) return state.pins;
    return state.pins.filter(
      (pin) =>
        pin.title.toLowerCase().includes(q) ||
        pin.category.toLowerCase().includes(q) ||
        pin.description.toLowerCase().includes(q)
    );
  });
