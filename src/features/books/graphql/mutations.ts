
export const INSERT_BOOK_MUTATION = `
  mutation InsertBook($input: BooksInsertInput!) {
    insertBooks(input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const UPDATE_BOOK_MUTATION = `
  mutation UpdateBook($filter: String!, $input: BooksUpdateInput!) {
    updateBooks(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const DELETE_BOOK_MUTATION = `
  mutation DeleteBook($filter: String!, $input: BooksDeleteInput!) {
    deleteBooks(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;
