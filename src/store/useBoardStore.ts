import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board } from '@/types/type';

interface BoardState {
  boards: Board[];
  isLoading: boolean;
  createBoard: (name: string, description?: string, isPrivate?: boolean) => void;
  deleteBoard: (id: string) => void;
  addPinToBoard: (boardId: string, pinId: string) => void;
  removePinFromBoard: (boardId: string, pinId: string) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      boards: [
        {
          id: 'b1',
          name: 'Home Decor',
          description: 'Ideas for my new apartment',
          pinIds: [],
          userId: 'u1',
          isPrivate: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'b2',
          name: 'Vacation Goals',
          description: 'Places to visit in 2024',
          pinIds: [],
          userId: 'u1',
          isPrivate: true,
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,

      createBoard: (name, description = '', isPrivate = false) => {
        const newBoard: Board = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          description,
          pinIds: [],
          userId: 'u1', // Assuming current user is u1
          isPrivate,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ boards: [...state.boards, newBoard] }));
      },

      deleteBoard: (id) =>
        set((state) => ({ boards: state.boards.filter((b) => b.id !== id) })),

      addPinToBoard: (boardId, pinId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, pinIds: Array.from(new Set([...b.pinIds, pinId])) }
              : b
          ),
        })),

      removePinFromBoard: (boardId, pinId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, pinIds: b.pinIds.filter((id) => id !== pinId) }
              : b
          ),
        })),

      updateBoard: (id, updates) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),
    }),
    {
      name: 'pixora-boards',
    }
  )
);
