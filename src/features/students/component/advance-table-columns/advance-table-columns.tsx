import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';
import { CustomtDateFormat } from 'lib/custom-date-formatter';
import { StudentStatus, StudentItem } from '../../types/students.types';

/**
 * Creates column definitions for an advanced students table.
 * @returns {ColumnDef<StudentItem>[]} An array of column definitions for the table.
 */
interface AdvanceTableColumnProps {
  t: (key: string) => string;
}

export const createAdvanceStudentColumns = ({
  t,
}: AdvanceTableColumnProps): ColumnDef<StudentItem>[] => [
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
    id: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('NAME')} />, 
    meta: 'NAME',
    accessorFn: (row) => `${row.Name || ''}`.trim(),
    size: 180,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate font-medium">{row.original.Name}</span>
      </div>
    ),
  },
  {
    id: 'studentId',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('STUDENT_ID')} />, 
    meta: 'STUDENT_ID',
    accessorFn: (row) => `${row.StudentId || ''}`.trim(),
    size: 140,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate">{row.original.StudentId}</span>
      </div>
    ),
  },
  {
    id: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('EMAIL')} />, 
    meta: 'EMAIL',
    accessorFn: (row) => `${row.Email || ''}`.trim(),
    size: 200,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate">{row.original.Email}</span>
      </div>
    ),
  },
  {
    id: 'course',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('COURSE')} />, 
    meta: 'COURSE',
    accessorFn: (row) => `${row.Course || ''}`.trim(),
    size: 160,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate">{row.original.Course}</span>
      </div>
    ),
  },
  {
    id: 'section',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('SECTION')} />, 
    meta: 'SECTION',
    accessorFn: (row) => `${row.Section || ''}`.trim(),
    size: 100,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate">{row.original.Section}</span>
      </div>
    ),
  },
  {
    id: 'grade',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('GRADE')} />, 
    meta: 'GRADE',
    accessorFn: (row) => `${row.Grade || ''}`.trim(),
    size: 100,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate">{row.original.Grade || '-'}</span>
      </div>
    ),
  },
  {
    id: 'lastUpdated',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('LAST_UPDATED')} />, 
    meta: 'LAST_UPDATED',
    accessorFn: (row) => row.LastUpdatedDate ? format(new Date(row.LastUpdatedDate), 'yyyy-MM-dd') : '',
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
      row: Row<StudentItem>,
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