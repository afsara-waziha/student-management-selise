import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Table } from '@tanstack/react-table';
import { AdvancedTableColumnsToolbar } from 'features/students/component/advance-table-columns-toolbar/advance-table-columns-toolbar';
import AdvanceDataTable from 'features/students/component/advance-data-table/advance-data-table';
import { createAdvanceStudentColumns } from 'features/students/component/advance-table-columns/advance-table-columns';
import { AdvanceTableFilterToolbar } from 'features/students/component/advance-table-filter-toolbar/advance-table-filter-toolbar';
import { AdvanceExpandRowContent } from 'features/students/component/advance-expand-row-content/advance-expand-row-content';
import { useGetStudents } from 'features/students/hooks/use-students';
import type { StudentItem } from 'features/students/types/students.types';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export function Students() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // columns definition (mirrors inventory pattern)
  const columns = createAdvanceStudentColumns({ t });

  const [studentsTableData, setStudentsTableData] = useState<StudentItem[]>([]);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const {
    data: studentsData,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useGetStudents({
    pageNo: paginationState.pageIndex + 1,
    pageSize: paginationState.pageSize,
  });

  const data = studentsData as { Students?: any };


  useEffect(() => {
    const result = data as
      | { StudentInfos?: { items: any[]; totalCount: number } }
      | undefined;
  
    const items = result?.StudentInfos?.items ?? [];
  
    const mapped = items.map((s: any) => ({
      ItemId: s.ItemId,                 // <-- required for details/update routes
      Name: s.Name ?? '',
      StudentId: s.StudentId ?? '',
      Email: s.Email ?? '',
      Course: s.Course ?? '',
      Section: s.Section ?? '',
      Grade: s.Grade ?? '',
      CreatedBy: s.CreatedBy ?? '',
      CreatedDate: s.CreatedDate ?? '',
      LastUpdatedBy: s.LastUpdatedBy ?? '',
      LastUpdatedDate: s.LastUpdatedDate ?? '',
      IsDeleted: Boolean(s.IsDeleted),
      Tags: s?.Tags ?? [],
      Status: s?.Status ?? '',
      Language: s?.Language ?? '',
    }));
  
    setStudentsTableData(mapped);
    setPaginationState((prev) => ({
      ...prev,
      totalCount: result?.StudentInfos?.totalCount ?? 0,
    }));
  }, [data]);
  

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


  const handleStudentDetails = (row: StudentItem) => {
    navigate(`/students/${row.ItemId}`);
  };

  const renderColumnsToolbar = (table: Table<StudentItem>) => (
    <AdvancedTableColumnsToolbar
      // lock core IDs that your student columns use (ensure these match the column `id`s)
      disabledColumns={['Name', 'Email', 'Course', 'Grade']}
      table={table}
      title="STUDENTS"
    />
  );

  const renderExpandRowContent = (rowId: string, colSpan: number) => (
    <AdvanceExpandRowContent rowId={rowId} colSpan={colSpan} data={studentsTableData} />
  );

  const renderFilterToolbar = (table: Table<StudentItem>) => (
    <AdvanceTableFilterToolbar table={table} />
  );

  return (
    <div className="flex w-full flex-col">
      <AdvanceDataTable
        data={studentsTableData}
        columns={columns}
        onRowClick={handleStudentDetails}
        isLoading={isStudentsLoading}
        error={studentsError instanceof Error ? studentsError : null}
        columnsToolbar={renderColumnsToolbar}
        filterToolbar={renderFilterToolbar}
        expandRowContent={renderExpandRowContent}
        pagination={{
          pageIndex: paginationState.pageIndex,
          pageSize: paginationState.pageSize,
          totalCount: paginationState.totalCount,
        }}
        manualPagination
        // pin the checkbox and primary identity column like inventory
        columnPinningConfig={{ left: ['select', 'Name'] }}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}

export default Students;
