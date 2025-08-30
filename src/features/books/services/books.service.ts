
import { graphqlClient } from 'lib/graphql-client';
import {
  AddBookResponse,
  AddBookParams,
  UpdateBookResponse,
  UpdateBookParams,
  DeleteBookResponse,
} from '../types/books.types';
import { GET_BOOKS_QUERY } from '../graphql/queries';
import {
  INSERT_BOOK_MUTATION,
  UPDATE_BOOK_MUTATION,
  DELETE_BOOK_MUTATION,
} from '../graphql/mutations';

/**
 * Fetches paginated books with filtering and sorting
 * (identical pattern to getStudents)
 */
export const getBooks = async (context: {
  queryKey: [string, { pageNo: number; pageSize: number }];
}) => {
  const [, { pageNo, pageSize }] = context.queryKey;
  return graphqlClient.query({
    query: GET_BOOKS_QUERY,
    variables: {
      input: {
        filter: '{}',
        sort: '{}',
        pageNo,
        pageSize,
      },
    },
  });
};

/**
 * Inserts a new book (GraphQL)
 * Signature matches addStudent: variables is the params object
 * where params = { input: BookInfoInsertInput }
 */
export const addBook = async (params: AddBookParams): Promise<AddBookResponse> => {
  const response = await graphqlClient.mutate<AddBookResponse>({
    query: INSERT_BOOK_MUTATION,
    variables: params,
  });
  return response;
};

/**
 * Updates an existing book
 * Signature matches updateStudent: variables is the params object
 * where params = { filter: string, input: BookInfoUpdateInput }
 */
export const updateBook = async (
  params: UpdateBookParams
): Promise<UpdateBookResponse> => {
  const response = await graphqlClient.mutate<UpdateBookResponse>({
    query: UPDATE_BOOK_MUTATION,
    variables: params,
  });
  return response;
};

/**
 * Deletes a book by ID (filter = JSON string)
 * Signature matches deleteStudent
 */
export const deleteBook = async (
  filter: string,
  input: { isHardDelete: boolean }
): Promise<DeleteBookResponse> => {
  const response = await graphqlClient.mutate<DeleteBookResponse>({
    query: DELETE_BOOK_MUTATION,
    variables: { filter, input },
  });
  return response;
};
