

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
features/book/
┣ component/
┃ ┣ advance-data-table/
┃ ┣ advance-table-columns/
┃ ┣ advance-expand-row-content/
┃ ┣ ...
┣ book-page.tsx
┣ book-form.tsx
┣ index.ts

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