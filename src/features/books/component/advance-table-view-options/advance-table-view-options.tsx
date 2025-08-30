import { useState, useEffect, useMemo } from 'react';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Settings2 } from 'lucide-react';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from 'components/ui/dropdown-menu';
import { Checkbox } from 'components/ui/checkbox';
import { Label } from 'components/ui/label';

/**
 * Column visibility controller for Books tables.
 * Mirrors the Students/Inventory style, but locks Title/Author/ISBN by default.
 */

interface AdvanceTableViewOptionsProps<TData> {
  table: Table<TData>;
  disabledColumns?: string[];                // extra locked columns (cannot be toggled)
  columnVisibility?: { [key: string]: boolean }; // initial/forced visibility map
}

export function AdvanceTableViewOptions<TData>({
  table,
  disabledColumns = [],
  columnVisibility = {},
}: Readonly<AdvanceTableViewOptionsProps<TData>>) {
  const { t } = useTranslation();

  // Built-in locked columns for Books + any provided by props
  const lockedIds = useMemo(
    () => new Set<string>(['Title', 'Author', 'ISBN', ...disabledColumns]),
    [disabledColumns]
  );

  const [allChecked, setAllChecked] = useState(
    table.getAllColumns().every((column) => column.getIsVisible() || !column.getCanHide())
  );

  // Apply external visibility overrides on mount/when prop changes
  useEffect(() => {
    table.getAllColumns().forEach((column) => {
      if (columnVisibility[column.id] !== undefined) {
        column.toggleVisibility(columnVisibility[column.id]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnVisibility]);

  // Keep "Select all" checkbox in sync with table state
  useEffect(() => {
    const next = table.getAllColumns().every((column) => column.getIsVisible() || !column.getCanHide());
    if (next !== allChecked) setAllChecked(next);
  }, [table.getState().columnVisibility, table, allChecked]);

  const handleToggleAll = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    table.getAllColumns().forEach((column) => {
      if (column.getCanHide() && !lockedIds.has(column.id)) {
        column.toggleVisibility(newCheckedState);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 text-sm font-bold">
          <Settings2 />
          {t('COLUMNS')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px] p-2">
        <DropdownMenuLabel className="flex items-center gap-2 p-2">
          <Checkbox
            className="data-[state=checked]:border-none"
            checked={allChecked}
            onCheckedChange={handleToggleAll}
          />
          <Label className="text-base font-normal text-high-emphasis">{t('SELECT_ALL')}</Label>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.id !== 'select')
          .map((column) => {
            const isDisabled = lockedIds.has(column.id) || !column.getCanHide();
            const isChecked = columnVisibility[column.id] ?? column.getIsVisible();

            return (
              <div key={column.id} className="flex items-center gap-2 p-2">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
                  disabled={isDisabled}
                  className="data-[state=checked]:border-none data-[disabled]:bg-low-emphasis"
                />
                <Label
                  className={`text-base font-normal text-high-emphasis ${isDisabled && 'text-low-emphasis'}`}
                >
                  {t(String(column.columnDef.meta || column.id).toUpperCase())}
                </Label>
              </div>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AdvanceTableViewOptions;
