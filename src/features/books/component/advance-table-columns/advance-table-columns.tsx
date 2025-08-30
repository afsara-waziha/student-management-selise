
import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';
import { CustomtDateFormat } from 'lib/custom-date-formatter';
import type { BookItem } from '../../types/books.types';

/**
 * Creates column definitions for an advanced books table.
 */
interface AdvanceTableColumnProps {
  t: (key: string) => string;
}

export const createAdvanceBookColumns = ({
  t,
}: AdvanceTableColumnProps): ColumnDef<BookItem>[] => [
  {
    id: 'select',
    header: () => <span className="text-xs font-medium">{t('ACTION')}</span>,
    accessorKey: 'select',
    meta: 'ACTION',
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
    size: 80,
  },
  {
    id: 'Title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('TITLE')} />
    ),
    meta: 'TITLE',
    accessorFn: (row) => `${row.Title || ''}`.trim(),
    size: 220,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate font-medium">{row.original.Title}</span>
      </div>
    ),
  },
  {
    id: 'Author',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('AUTHOR')} />
    ),
    meta: 'AUTHOR',
    accessorFn: (row) => `${row.Author || ''}`.trim(),
    size: 180,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate">{row.original.Author}</span>
      </div>
    ),
  },
  {
    id: 'ISBN',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('ISBN')} />
    ),
    meta: 'ISBN',
    accessorFn: (row) => `${row.ISBN || ''}`.trim(),
    size: 160,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate">{row.original.ISBN}</span>
      </div>
    ),
  },
  {
    id: 'Category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('CATEGORY')} />
    ),
    meta: 'CATEGORY',
    accessorFn: (row) => `${row.Category || ''}`.trim(),
    size: 160,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate">{row.original.Category}</span>
      </div>
    ),
  },
  {
    id: 'Publisher',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('PUBLISHER')} />
    ),
    meta: 'PUBLISHER',
    accessorFn: (row) => `${row.Publisher || ''}`.trim(),
    size: 180,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate">{row.original.Publisher}</span>
      </div>
    ),
  },
  {
    id: 'PublicationYear',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('PUBLICATION_YEAR')} />
    ),
    meta: 'PUBLICATION_YEAR',
    accessorFn: (row) => `${row.PublicationYear ?? ''}`,
    size: 120,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate">{row.original.PublicationYear ?? '-'}</span>
      </div>
    ),
  },
  {
    id: 'TotalCopies',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('TOTAL_COPIES')} />
    ),
    meta: 'TOTAL_COPIES',
    accessorFn: (row) => `${row.TotalCopies ?? 0}`,
    size: 120,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate">{row.original.TotalCopies ?? 0}</span>
      </div>
    ),
  },
  {
    id: 'AvailableCopies',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('AVAILABLE_COPIES')} />
    ),
    meta: 'AVAILABLE_COPIES',
    accessorFn: (row) => `${row.AvailableCopies ?? 0}`,
    size: 130,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate">{row.original.AvailableCopies ?? 0}</span>
      </div>
    ),
  },
  {
    id: 'lastUpdated',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('LAST_UPDATED')} />
    ),
    meta: 'LAST_UPDATED',
    accessorFn: (row) =>
      row.LastUpdatedDate ? format(new Date(row.LastUpdatedDate), 'yyyy-MM-dd') : '',
    cell: ({ row }) => {
      const lastUpdated = row.original.LastUpdatedDate;
      const date = lastUpdated
        ? CustomtDateFormat(lastUpdated, { showTime: false })
        : '-';

      return (
        <div className="flex items-center min-w-[160px]">
          <span className="truncate">{date}</span>
        </div>
      );
    },
    filterFn: (
      row: Row<BookItem>,
      columnId: string,
      filterValue: { type?: string; date?: string; from?: string; to?: string }
    ) => {
      if (!filterValue) return true;
      const rowDate = String(row.getValue(columnId));
      const { type, date, from, to } = filterValue;
      const formattedDate = date ? format(new Date(date), 'yyyy-MM-dd') : null;
      const formattedFrom = from ? format(new Date(from), 'yyyy-MM-dd') : null;
      const formattedTo = to ? format(new Date(to), 'yyyy-MM-dd') : null;
      const today = format(new Date(), 'yyyy-MM-dd');

      const filterStrategies: Record<string, () => boolean> = {
        today: () => rowDate === today,
        date: () => formattedDate !== null && rowDate === formattedDate,
        after: () => formattedDate !== null && rowDate > formattedDate,
        before: () => formattedDate !== null && rowDate < formattedDate,
        date_range: () =>
          formattedFrom !== null &&
          formattedTo !== null &&
          rowDate >= formattedFrom &&
          rowDate <= formattedTo,
        no_entry: () => rowDate === '',
      };

      return filterStrategies[type as keyof typeof filterStrategies]?.() ?? true;
    },
  },
];
