import { create } from 'zustand';
import { Board, Pin } from '@/types/type';
import { boardService } from '@/services/boardService';
import { transformBackendPin } from './usePinStore';
import { toast } from 'sonner';

const getErrorMessage = (error: any) => {
  if (error?.response?.data?.error?.details) {
    return error.response.data.error.details.map((d: any) => `${d.field}: ${d.message}`).join(', ');
  }
  return error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || 'Something went wrong';
};

interface BoardState {
  boards: Board[];
  boardPins: Pin[];
  isLoading: boolean;
  isLoadingPins: boolean;
  fetchBoards: () => Promise<void>;
  fetchBoardPins: (boardId: string) => Promise<void>;
  fetchBoardById: (boardId: string) => Promise<void>;
  createBoard: (name: string, description?: string, isPrivate?: boolean, coverImage?: File) => Promise<string | void>;
  deleteBoard: (id: string) => Promise<void>;
  addPinToBoard: (boardId: string, pinId: string) => Promise<void>;
  removePinFromBoard: (boardId: string, pinId: string) => Promise<void>;
  updateBoard: (id: string, updates: Partial<Board>) => Promise<void>;
  hasMoreBoards: boolean;
  boardsPage: number;
  isLoadingMoreBoards: boolean;
  loadMoreBoards: () => Promise<void>;
}

const mapBackendBoard = (board: any): Board => ({
  id: board.id || board._id,
  name: board.name,
  description: board.description,
  coverImageUrl: board.cover_image_url || board.cover_image,
  pinIds: Array.isArray(board.pins) && typeof board.pins[0] === 'string' ? board.pins : (board.pins?.map((pin: any) => pin.id || pin._id) || []),
  pins: Array.isArray(board.pins) && typeof board.pins[0] === 'object' ? board.pins.map((pin: any) => ({
    id: pin.id || pin._id,
    imageUrl: pin.media_url || pin.imageUrl,
    title: pin.title
  })) : [],
  totalPins: board.totalPins || 0,
  userId: board.user_id,
  isPrivate: board.isPrivate || false,
  createdAt: board.created_at || new Date().toISOString(),
});

export const useBoardStore = create<BoardState>()((set, get) => ({
  boards: [],
  boardPins: [],
  isLoading: false,
  isLoadingPins: false,
  hasMoreBoards: false,
  boardsPage: 1,
  isLoadingMoreBoards: false,

  fetchBoards: async () => {
    set({ isLoading: true, boardsPage: 1, hasMoreBoards: false });
    try {
      const response = await boardService.getBoards(1);
      if (response.success && response.data?.boards) {
        set({ 
          boards: response.data.boards.map(mapBackendBoard),
          hasMoreBoards: response.data.pagination?.page < response.data.pagination?.totalPages,
          boardsPage: 1
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch boards:', error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoading: false });
    }
  },

  loadMoreBoards: async () => {
    const { hasMoreBoards, boardsPage, isLoadingMoreBoards } = get();
    
    if (!hasMoreBoards || isLoadingMoreBoards) return;

    set({ isLoadingMoreBoards: true });

    try {
      const nextPage = boardsPage + 1;
      const response = await boardService.getBoards(nextPage);
      
      if (response.success && response.data?.boards) {
        set((state) => ({
          boards: [...state.boards, ...response.data.boards.map(mapBackendBoard)],
          hasMoreBoards: response.data.pagination?.page < response.data.pagination?.totalPages,
          boardsPage: nextPage,
          isLoadingMoreBoards: false
        }));
      } else {
        set({ isLoadingMoreBoards: false });
      }
    } catch (error) {
      console.error('Failed to load more boards:', error);
      set({ isLoadingMoreBoards: false });
    }
  },

  fetchBoardById: async (boardId: string) => {
    set({ isLoading: true });
    try {
      const response = await boardService.getBoardById(boardId);
      if (response.success) {
        const backendBoard = response.data?.board || response.data;
        if (backendBoard && backendBoard._id || backendBoard.id) {
          const newBoard = mapBackendBoard(backendBoard);
          set((state) => {
            const boardExists = state.boards.some(board => board.id === newBoard.id);
            return {
              boards: boardExists 
                ? state.boards.map(board => board.id === newBoard.id ? newBoard : board)
                : [...state.boards, newBoard]
            };
          });
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch board:', error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBoardPins: async (boardId: string) => {
    set({ isLoadingPins: true, boardPins: [] });
    try {
      const response = await boardService.getBoardPins(boardId);
      if (response.success && response.data?.pins) {
        set({ boardPins: response.data.pins.map(transformBackendPin) });
      }
    } catch (error: any) {
      console.error('Failed to fetch board pins:', error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoadingPins: false });
    }
  },

  createBoard: async (name, description = '', isPrivate = false, coverImage?: File) => {
    try {
      const response = await boardService.createBoard({ name, description, isPrivate, coverImage });
      if (response.success && response.data) {
        const newBoard = mapBackendBoard(response.data);
        set((state) => ({ boards: [...state.boards, newBoard] }));
        toast.success(response.message || 'Board created successfully');
        return newBoard.id;
      } else {
        get().fetchBoards();
      }
    } catch (error: any) {
      console.error('Failed to create board:', error);
      toast.error(getErrorMessage(error));
    }
  },

  deleteBoard: async (id) => {
    const prev = get().boards;
    set((state) => ({ boards: state.boards.filter((board) => board.id !== id) }));
    try {
      const response = await boardService.deleteBoard(id);
      toast.success(response.message || 'Board deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete board:', error);
      set({ boards: prev });
      toast.error(getErrorMessage(error));
    }
  },

  addPinToBoard: async (boardId, pinId) => {
    try {
      const response = await boardService.savePinToBoard(boardId, pinId);
      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? { ...board, pinIds: Array.from(new Set([...board.pinIds, pinId])) } : board
        ),
      }));
      toast.success(response.message || 'Saved to board');
    } catch (error: any) {
      console.error('Failed to add pin to board:', error);
      toast.error(getErrorMessage(error));
      throw error;
    }
  },

  removePinFromBoard: async (boardId, pinId) => {
    try {
      const response = await boardService.removePinFromBoard(boardId, pinId);
      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? { ...board, pinIds: board.pinIds.filter((id) => id !== pinId) } : board
        ),
        boardPins: state.boardPins.filter((pin) => pin.id !== pinId),
      }));
      toast.success(response.message || 'Removed from board');
    } catch (error: any) {
      console.error('Failed to remove pin from board:', error);
      toast.error(getErrorMessage(error));
      throw error;
    }
  },

  updateBoard: async (id, updates) => {
    const prev = get().boards;
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === id ? { ...board, ...updates } : board
      ),
    }));
    try {
      const response = await boardService.updateBoard(id, updates);
      toast.success(response.message || 'Board updated successfully');
    } catch (error: any) {
      console.error('Failed to update board:', error);
      set({ boards: prev });
      toast.error(getErrorMessage(error));
    }
  },
}));
