import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';


export interface BoardResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const boardService = {
  createBoard: async (data: { name: string; description?: string; isPrivate?: boolean; coverImage?: File }): Promise<BoardResponse> => {
    let payload: any;
    const headers: Record<string, string> = {};

    if (data.coverImage) {
      payload = new FormData();
      payload.append('name', data.name);
      if (data.description) payload.append('description', data.description);
      if (data.isPrivate !== undefined) payload.append('isPrivate', String(data.isPrivate));
      payload.append('coverImage', data.coverImage);
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = {
        name: data.name,
        description: data.description,
        isPrivate: data.isPrivate,
      };
    }

    const response = await apiClient.post<BoardResponse>(ENDPOINTS.BOARDS.CREATE, payload, { headers });
    return response.data;
  },

  getBoards: async (page: number = 1, limit: number = 20): Promise<BoardResponse> => {
    const response = await apiClient.get<BoardResponse>(`${ENDPOINTS.BOARDS.LIST}?page=${page}&limit=${limit}`);
    return response.data;
  },

  getBoardById: async (id: string): Promise<BoardResponse> => {
    const response = await apiClient.get<BoardResponse>(ENDPOINTS.BOARDS.GET_BOARD(id));
    return response.data;
  },

  getBoardPins: async (id: string): Promise<BoardResponse> => {
    const response = await apiClient.get<BoardResponse>(ENDPOINTS.BOARDS.GET_PINS(id));
    return response.data;
  },

  updateBoard: async (id: string, data: { name?: string; description?: string; isPrivate?: boolean; coverImage?: File }): Promise<BoardResponse> => {
    let payload: any;
    const headers: Record<string, string> = {};

    if (data.coverImage) {
      payload = new FormData();
      if (data.name) payload.append('name', data.name);
      if (data.description !== undefined) payload.append('description', data.description);
      if (data.isPrivate !== undefined) payload.append('isPrivate', String(data.isPrivate));
      payload.append('coverImage', data.coverImage);
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = {
        name: data.name,
        description: data.description,
        isPrivate: data.isPrivate,
      };
    }

    const response = await apiClient.put<BoardResponse>(ENDPOINTS.BOARDS.UPDATE(id), payload, { headers });
    return response.data;
  },

  savePinToBoard: async (boardId: string, postId: string): Promise<BoardResponse> => {
    const response = await apiClient.post<BoardResponse>(ENDPOINTS.BOARDS.SAVE_PIN, { board_id: boardId, post_id: postId });
    return response.data;
  },

  removePinFromBoard: async (boardId: string, postId: string): Promise<BoardResponse> => {
    const response = await apiClient.post<BoardResponse>(ENDPOINTS.BOARDS.REMOVE_PIN, { board_id: boardId, post_id: postId });
    return response.data;
  },

  deleteBoard: async (id: string): Promise<BoardResponse> => {
    const response = await apiClient.delete<BoardResponse>(ENDPOINTS.BOARDS.DELETE(id));
    return response.data;
  },
};
