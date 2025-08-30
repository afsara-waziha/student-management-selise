

/**
 * GraphQL Types for Books Management
 *
 * Schema name: Books
 * Query root (list): Bookss
 * Mutations: insertBooks / updateBooks / deleteBooks
 */

export interface BookItem {
  ItemId: string;
  Title: string;
  Author: string;
  ISBN: string;
  Category: string;
  Publisher: string;
  PublicationYear?: number;   // GraphQL Int
  TotalCopies?: number;       // GraphQL Int
  AvailableCopies?: number;   // GraphQL Int
  Description?: string;
  CoverImageId?: string;

  CreatedBy?: string;
  CreatedDate?: string;
  LastUpdatedBy?: string;
  LastUpdatedDate?: string;
  IsDeleted?: boolean;
}

/** List (paged) response */
export interface GetBooksResponse {
  Bookss: {
    items: BookItem[];
    totalCount: number;
  };
}

/** Single item (when fetched via list + filter) */
export interface GetBookItemResponse {
  Bookss: {
    items: BookItem[];
    totalCount: number;
  };
}

/** Create */
export interface AddBookInput {
  Title: string;
  Author: string;
  ISBN: string;
  Category: string;
  Publisher: string;
  PublicationYear?: number;
  TotalCopies?: number;
  AvailableCopies?: number;
  Description?: string;
  CoverImageId?: string;
}
export interface AddBookParams {
  input: AddBookInput;
}
export interface AddBookResponse {
  insertBooks: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}

/** Update */
//export interface UpdateBookInput extends Partial<AddBookInput> {}
export type UpdateBookInput = Partial<AddBookInput>;
export interface UpdateBookParams {
  /** JSON-stringified filter, e.g. JSON.stringify({ _id: "<ItemId>" }) */
  filter: string;
  input: UpdateBookInput;
}
export interface UpdateBookResponse {
  updateBooks: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}

/** Delete */
export interface DeleteBookResponse {
  deleteBooks: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}

/** UI helpers */
export const categoryOptions: string[] = [
  'Computer Science',
  'Software Engineering',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Mathematics',
  'Physics',
  'Biology',
  'Medicine',
  'Business',
  'Economics',
  'History',
  'Philosophy',
  'Psychology',
  'Arts',
  'Literature',
  'Education',
  'Children',
  'Reference',
  'Comics & Graphic Novels',
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Fantasy',
  'Thriller',
  'Romance',
  'Self-Help',
  'Health & Fitness',
  'Travel',
  'Cooking',
];
