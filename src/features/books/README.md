

# Book Feature Documentation

This module implements the **Book Management** functionality in the project.

## Overview
The Book feature allows you to:
- View the list of books.
- Add new books with details such as Title, Author, ISBN, Category, Publisher, PublicationYear, TotalCopies, AvailableCopies and Description
- Update book details.
- Delete books from the system.

## File Structure
```
src/features/books/
 ├── README.md
 ├── component/
 │   ├── advance-book-details/advance-book-details.tsx
 │   ├── advance-data-table/advance-data-table.tsx
 │   ├── advance-expand-row-content/advance-expand-row-content.tsx
 │   ├── advance-table-columns-toolbar/advance-table-columns-toolbar.tsx
 │   ├── advance-table-columns/advance-table-columns.tsx
 │   ├── advance-table-filter-toolbar/advance-table-filter-toolbar.tsx
 │   ├── advance-table-view-options/advance-table-view-options.tsx
 │   ├── books-form/books-form.tsx
 │   ├── books-form/general-info-form.tsx
 │   ├── image-uploader/image-uploader.tsx
 │   └── last-updated-filter-dropdown/last-updated-filter-dropdown.tsx
 ├── graphql/
 │   ├── mutations.ts
 │   └── queries.ts
 ├── hooks/
 │   ├── use-books.ts
 │   └── use-storage.ts
 ├── services/
 │   ├── books.service.ts
 │   └── storage.service.ts
 ├── types/
 │   └── books.types.ts
 └── index.ts

```
```
src/pages/books/
 ├── book-details.tsx
 └── books.tsx
```
## Key Components
- **AdvanceDataTable** → Renders the book list with pagination, search, and filters.
- **AdvanceBookDetails** → Expanded view for a single book.
- **BookForm** → Handles adding and editing book records.

## API Integration
The feature uses GraphQL/REST to:
- **Query**: Fetch all books with pagination.
- **Mutation**: Insert, update, and delete books.

## Permissions
Actions can be controlled via RBAC:
- `books.read`
- `books.create`
- `books.update`
- `books.delete`

## Usage
To include this feature in routing:
```tsx
<Route path="/books" element={<BookPage />} />
```