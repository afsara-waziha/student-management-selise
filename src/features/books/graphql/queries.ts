/**
 * GraphQL Queries for Books Management
 * Mirrors Students/Inventory query style
 */
export const GET_BOOKS_QUERY = `
  query Bookss($input: DynamicQueryInput) {
    Bookss(input: $input) {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        ItemId
        Title
        Author
        ISBN
        Category
        Publisher
        PublicationYear
        TotalCopies
        AvailableCopies
        Description
        CoverImageId
        CreatedBy
        CreatedDate
        LastUpdatedBy
        LastUpdatedDate
        IsDeleted
        Tags
        Language
      }
    }
  }
`;
