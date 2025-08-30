
import { useGlobalQuery, useGlobalMutation } from 'state/query-client/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from 'hooks/use-error-handler';

import { AddBookParams, UpdateBookParams } from '../types/books.types';
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from '../services/books.service';

/**
 * GraphQL Books Hooks
 *
 * Mirrors the Students hooks file in structure and options.
 */

interface BooksQueryParams {
  pageNo: number;
  pageSize: number;
}

/**
 * Hook to fetch books with pagination
 */


export const useGetBooks = (params: BooksQueryParams) => {
  return useGlobalQuery({
    queryKey: ['books', params],
    queryFn: getBooks,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to insert a new book
 * @example
 * const { mutate: insertBook, isPending } = useAddBook();
 * insertBook({ input: bookData });
 */
export const useAddBook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useGlobalMutation({
    mutationFn: (params: AddBookParams) => addBook(params),
    onSuccess: (data: any) => {
      // exactly like students
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'books' });
      queryClient.refetchQueries({ predicate: (q) => q.queryKey[0] === 'books', type: 'active' });

      if (data.insertBooks?.acknowledged) {
        toast({
          variant: 'success',
          title: t('BOOK_ADDED'),
          description: t('BOOK_SUCCESSFULLY_CREATED'),
        });
      }
    },
    onError: (error) => {
      throw error;
    },
  });
};

/**
 * Hook to update an existing book
 * @example
 * const { mutate: updateBookMut, isPending } = useUpdateBook();
 * updateBookMut({ filter: '{"_id":"<ItemId>"}', input: { Title: 'Updated' } });
 */
export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: (params: UpdateBookParams) => updateBook(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'books' });
      queryClient.refetchQueries({ predicate: (q) => q.queryKey[0] === 'books', type: 'active' });

      if (data.updateBooks?.acknowledged) {
        toast({
          variant: 'success',
          title: t('BOOK_UPDATED'),
          description: t('BOOK_SUCCESSFULLY_UPDATED'),
        });
      } else {
        handleError(
          { error: { title: 'UNABLE_UPDATE_BOOK', message: t('UNABLE_UPDATE_BOOK') } },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};

/**
 * Hook to delete a book by filter (e.g., itemId)
 * @example
 * const { mutate: deleteBookMut, isPending } = useDeleteBook();
 * deleteBookMut({ filter: '{"_id":"<ItemId>"}', input: { isHardDelete: true } });
 */
export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: ({ filter, input }: { filter: string; input: { isHardDelete: boolean } }) =>
      deleteBook(filter, input),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'books' });
      queryClient.refetchQueries({ predicate: (q) => q.queryKey[0] === 'books', type: 'active' });

      if (data.deleteBooks?.acknowledged) {
        toast({
          variant: 'success',
          title: t('BOOK_DELETED'),
          description: t('BOOK_SUCCESSFULLY_DELETED'),
        });
      } else {
        handleError(
          { error: { title: 'UNABLE_DELETE_BOOK', message: t('UNABLE_DELETE_BOOK') } },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};
