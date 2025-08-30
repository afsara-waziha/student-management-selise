import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Table } from '@tanstack/react-table';

import { AdvancedTableColumnsToolbar } from 'features/books/component/advance-table-columns-toolbar/advance-table-columns-toolbar';
import AdvanceDataTable from 'features/books/component/advance-data-table/advance-data-table';

import { createAdvanceBookColumns } from 'features/books/component/advance-table-columns/advance-table-columns';
import { AdvanceTableFilterToolbar } from 'features/books/component/advance-table-filter-toolbar/advance-table-filter-toolbar';
import { AdvanceExpandRowContent } from 'features/books/component/advance-expand-row-content/advance-expand-row-content';

import { useGetBooks } from 'features/books/hooks/use-books';
import type { BookItem } from 'features/books/types/books.types';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export function Books() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // columns definition (mirrors inventory/students pattern)
  const columns = createAdvanceBookColumns({ t });

  const [booksTableData, setBooksTableData] = useState<BookItem[]>([]);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const {
    data: booksData,
    isLoading: isBooksLoading,
    error: booksError,
  } = useGetBooks({
    pageNo: paginationState.pageIndex + 1,
    pageSize: paginationState.pageSize,
  });

  useEffect(() => {
    const result = booksData as
      | { Bookss?: { items: any[]; totalCount: number } }
      | undefined;

    const items = result?.Bookss?.items ?? [];

    const mapped: BookItem[] = items.map((b: any) => ({
      ItemId: b.ItemId,
      Title: b.Title ?? '',
      Author: b.Author ?? '',
      ISBN: b.ISBN ?? '',
      Category: b.Category ?? '',
      Publisher: b.Publisher ?? '',
      PublicationYear: b.PublicationYear ?? '',
      TotalCopies: b.TotalCopies ?? 0,
      AvailableCopies: b.AvailableCopies ?? 0,
      Description: b.Description ?? '',
      CoverImageId: b.CoverImageId ?? '',
      CreatedBy: b.CreatedBy ?? '',
      CreatedDate: b.CreatedDate ?? '',
      LastUpdatedBy: b.LastUpdatedBy ?? '',
      LastUpdatedDate: b.LastUpdatedDate ?? '',
      IsDeleted: Boolean(b.IsDeleted),
      Tags: b?.Tags ?? [],
      Status: b?.Status ?? '',
      Language: b?.Language ?? '',
    }));

    setBooksTableData(mapped);
    setPaginationState((prev) => ({
      ...prev,
      totalCount: result?.Bookss?.totalCount ?? 0,
    }));
  }, [booksData]);

  const handlePaginationChange = useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      }));
    },
    []
  );

  const handleBookDetails = (row: BookItem) => {
    navigate(`/books/${row.ItemId}`);
  };

  const renderColumnsToolbar = (table: Table<BookItem>) => (
    <AdvancedTableColumnsToolbar
      // lock core IDs that your book columns use (ensure these match the column `id`s)
      disabledColumns={['Title', 'Author', 'ISBN']}
      table={table}
      title="BOOKS"
    />
  );

  const renderExpandRowContent = (rowId: string, colSpan: number) => (
    <AdvanceExpandRowContent rowId={rowId} colSpan={colSpan} data={booksTableData} />
  );

  const renderFilterToolbar = (table: Table<BookItem>) => (
    <AdvanceTableFilterToolbar table={table} />
  );

  return (
    <div className="flex w-full flex-col">
      <AdvanceDataTable
        data={booksTableData}
        columns={columns}
        onRowClick={handleBookDetails}
        isLoading={isBooksLoading}
        error={booksError instanceof Error ? booksError : null}
        columnsToolbar={renderColumnsToolbar}
        filterToolbar={renderFilterToolbar}
        expandRowContent={renderExpandRowContent}
        pagination={{
          pageIndex: paginationState.pageIndex,
          pageSize: paginationState.pageSize,
          totalCount: paginationState.totalCount,
        }}
        manualPagination
        // pin the checkbox and primary identity column like inventory/students
        columnPinningConfig={{ left: ['select', 'Title'] }}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}

export default Books;
