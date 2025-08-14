
import { useCallback, useRef } from 'react';
import type { Column, Header, Table } from '@tanstack/react-table';
import { RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { TableRow, TableHead } from 'components/ui/table';
import { Input } from 'components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { Checkbox } from 'components/ui/checkbox';
import LastUpdatedFilterDropdown from '../last-updated-filter-dropdown/last-updated-filter-dropdown';

// Student table uses selects for these columns; others get a text input filter.
const selectFilterColumns = new Set(['course', 'section', 'grade']);

interface AdvanceTableFilterToolbarProps<TData> {
  table: Table<TData>;
}

export function AdvanceTableFilterToolbar<TData>({
  table,
}: Readonly<AdvanceTableFilterToolbarProps<TData>>) {
  const { t } = useTranslation();
  const clearLastUpdatedFilterDropdownRef = useRef<{ clearFilter: VoidFunction }>(null);

  const getCommonPinningClasses = (column: Column<TData, unknown>) => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

    return clsx(
      isPinned ? 'sticky z-[1] bg-card' : 'relative z-0',
      isLastLeftPinnedColumn && 'shadow-inset-right',
      isFirstRightPinnedColumn && 'shadow-inset-left'
    );
  };

  const resetColumnFilters = () => {
    table.resetColumnFilters();
    clearLastUpdatedFilterDropdownRef.current?.clearFilter();
  };

  const renderColumnFilter = useCallback(
    (header: Header<TData, unknown>) => {
      const { column } = header;

      if (!column.getCanFilter()) return null;

      // Course / Section / Grade -> Select from faceted values
      if (selectFilterColumns.has(column.id)) {
        const options = Array.from(column.getFacetedUniqueValues().keys()).filter(
          (option) => !!option && option !== ''
        ) as string[];

        return (
          <Select
            onValueChange={(value) => column.setFilterValue(value)}
            value={(column.getFilterValue() as string) || ''}
          >
            <SelectTrigger className="rounded-[6px]">
              <SelectValue placeholder={t('SELECT')} />
            </SelectTrigger>
            <SelectContent>
              {options.length === 0 ? (
                <div className="p-2 text-sm text-center text-low-emphasis">{t('NO_DATA_FOUND')}</div>
              ) : (
                options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        );
      }

      // Date filter for "lastUpdated" column (students variant)
      if (column.id === 'lastUpdated') {
        return (
          <LastUpdatedFilterDropdown
            ref={clearLastUpdatedFilterDropdownRef}
            setFilterValue={(value) => column.setFilterValue(value)}
          />
        );
      }

      // Default: text input filter (e.g., name, studentId, email)
      return (
        <Input
          placeholder={t('SEARCH')}
          value={(column.getFilterValue() as string) || ''}
          onChange={(e) => {
            const value = e.target.value;
            column.setFilterValue(value || undefined);
          }}
          className="rounded-[6px] h-10"
        />
      );
    },
    [t]
  );

  return (
    <TableRow className="border-b hover:bg-transparent">
      {table.getHeaderGroups()[0]?.headers.map((header, index) => {
        const { column } = header;
        return (
          <TableHead
            className={`py-3 px-4 ${column.id === 'select' && 'pl-4 pr-0'} ${getCommonPinningClasses(column)}`}
            style={{
              left: column.getIsPinned() === 'left' ? `${column.getStart('left')}px` : undefined,
              right: column.getIsPinned() === 'right' ? `${column.getAfter('right')}px` : undefined,
              width: column.getSize(),
            }}
            key={header.id}
          >
            {index === 0 ? (
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                  }
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  aria-label="Select all"
                  className="border-medium-emphasis data-[state=checked]:border-none border-2"
                />
                <RotateCcw
                  className="w-5 h-5 text-low-emphasis cursor-pointer hover:text-medium-emphasis"
                  onClick={resetColumnFilters}
                />
              </div>
            ) : (
              renderColumnFilter(header)
            )}
          </TableHead>
        );
      })}
    </TableRow>
  );
}

export default AdvanceTableFilterToolbar;
