import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';


export interface BoardResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const boardService = {
  /**
   * Create Board Service which handles the creation of a new board
   * @param data Board data including name, description, isPrivate, and coverImage
   * @returns Promise<BoardResponse>
   */
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

  /**
   * Get Boards Service which handles the retrieval of boards
   * @param page Page number for pagination
   * @param limit Limit for pagination
   * @returns Promise<BoardResponse>
   */
  getBoards: async (page: number = 1, limit: number = 20): Promise<BoardResponse> => {
    const response = await apiClient.get<BoardResponse>(`${ENDPOINTS.BOARDS.LIST}?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * Get Board By ID Service which handles the retrieval of a board by its ID
   * @param id Board ID
   * @returns Promise<BoardResponse>
   */
  getBoardById: async (id: string): Promise<BoardResponse> => {
    const response = await apiClient.get<BoardResponse>(ENDPOINTS.BOARDS.GET_BOARD(id));
    return response.data;
  },

  /**
   * Get Board Pins Service which handles the retrieval of pins in a board
   * @param id Board ID
   * @returns Promise<BoardResponse>
   */
  getBoardPins: async (id: string): Promise<BoardResponse> => {
    const response = await apiClient.get<BoardResponse>(ENDPOINTS.BOARDS.GET_PINS(id));
    return response.data;
  },

  /**
   * Update Board Service which handles the update of a board
   * @param id Board ID
   * @param data Board data including name, description, isPrivate, and coverImage
   * @returns Promise<BoardResponse>
   */
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

  /**
   * Save Pin to Board Service which handles the saving of a pin to a board
   * @param boardId Board ID
   * @param postId Post ID
   * @returns Promise<BoardResponse>
   */
  savePinToBoard: async (boardId: string, postId: string): Promise<BoardResponse> => {
    const response = await apiClient.post<BoardResponse>(ENDPOINTS.BOARDS.SAVE_PIN, { board_id: boardId, post_id: postId });
    return response.data;
  },

  /**
   * Remove Pin from Board Service which handles the removal of a pin from a board
   * @param boardId Board ID
   * @param postId Post ID
   * @returns Promise<BoardResponse>
   */
  removePinFromBoard: async (boardId: string, postId: string): Promise<BoardResponse> => {
    const response = await apiClient.post<BoardResponse>(ENDPOINTS.BOARDS.REMOVE_PIN, { board_id: boardId, post_id: postId });
    return response.data;
  },

  /**
   * Delete Board Service which handles the deletion of a board
   * @param id Board ID
   * @returns Promise<BoardResponse>
   */
  deleteBoard: async (id: string): Promise<BoardResponse> => {
    const response = await apiClient.delete<BoardResponse>(ENDPOINTS.BOARDS.DELETE(id));
    return response.data;
  },
};
