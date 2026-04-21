import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/type';

/**
 * Extracts a human-readable error message from an API error.
 * Handles nested backend error structures and standard Axios errors.
 * 
 * @param error - The error object to parse
 * @param fallback - A default message if no error message is found
 * @returns The extracted error message
 */
export const getErrorMessage = (error: unknown, fallback: string = 'Something went wrong'): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    
    return (
      data?.error?.message ||
      data?.message ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
