import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Papa from 'papaparse';
import { Download, Plus } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { AdvanceTableViewOptions } from '../advance-table-view-options/advance-table-view-options';
import { Button } from 'components/ui/button';

/**
 * A toolbar component for managing table columns, displaying selected row information,
 * and providing export and item addition functionalities — Books variant.
 *
 * Mirrors the students/inventory toolbar style/props, with Books-specific defaults.
 */

interface AdvancedTableColumnsToolbarProps<TData> {
  table: Table<TData>;
  title?: string;
  disabledColumns?: string[];
  columnVisibility?: { [key: string]: boolean };
}

export function AdvancedTableColumnsToolbar<TData>({
  table,
  title = 'BOOKS',
  disabledColumns,
  columnVisibility,
}: Readonly<AdvancedTableColumnsToolbarProps<TData>>) {
  const { t } = useTranslation();
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedLength = selectedRows.length;

  /**
   * Exports the selected rows as a CSV file.
   * If no rows are selected, the function returns early.
   */
  const exportCSV = () => {
    if (selectedRows.length === 0) return;

    const data = selectedRows.map((row) => row.original);
    const csv = Papa.unparse(data);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'books.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center text-base text-high-emphasis">
        <h3 className="text-2xl font-bold tracking-tight">{t(title)}</h3>
      </div>
      <div className="flex items-center gap-4">
        {selectedLength ? (
          <div className="flex items-center gap-4">
            <p className="text-medium-emphasis text-sm font-normal">
              {selectedLength} {t('ITEM')}
              {selectedLength > 1 ? '(s)' : ''} {t('SELECTED')}
            </p>
            <Button size="sm" className="text-sm font-bold" onClick={exportCSV}>
              <Download />
              {t('EXPORT_CSV')}
            </Button>
          </div>
        ) : (
          <AdvanceTableViewOptions
            disabledColumns={disabledColumns}
            columnVisibility={columnVisibility}
            table={table}
          />
        )}
        <Link to="/books/add">
          <Button size="sm" className="text-sm font-bold">
            <Plus />
            {t('ADD_BOOK')}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default AdvancedTableColumnsToolbar;
