import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { StudentEnrollmentDTO, StudentMonthlySummaryDTO } from 'rsd';
import { format } from 'date-fns';
import { DataTable } from '@/components/data-table';
import { useGetStudentsMonthlySummary } from '@/services/StudentService';
import { useGetAcademicYears } from '@/services/AcademicYearService';
import { Button } from '@/components/ui/button';
import { getMostRecentEnrollment } from '@/utils/getMostRecentEnrollment';

interface MonthlyViewTableProps {
  filterQuery?: string;
}

const MONTHS_IN_ORDER = [ 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5 ];
const getMonthLabel = (monthNum: number) =>
  format(new Date(2000, monthNum, 1), `MMM`).toUpperCase();

export const MonthlyViewTable: React.FC<MonthlyViewTableProps> = ({ filterQuery = `` }) => {
  const { data: academicYears } = useGetAcademicYears();

  const currentEducationYear = useMemo(() => {
    if (!academicYears || academicYears.length === 0) {
      return null;
    }
    return academicYears[0];
  }, [ academicYears ]);

  const { data: apiStudents = [], isError, isLoading } = useGetStudentsMonthlySummary({
    yearId: currentEducationYear?.id?.toString(),
  }, !!currentEducationYear);

  const studentsWithRecentEnrollment = useMemo(() =>
    apiStudents.map((student) => ({
      ...student,
      recentEnrollment: getMostRecentEnrollment(student.enrollments),
    })), [ apiStudents ]);

  const columnHelper = createColumnHelper<StudentMonthlySummaryDTO & { recentEnrollment: StudentEnrollmentDTO }>();

  const columns = useMemo(() => [
    columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
      id: `name`,
      cell: ({ getValue }) =>
        <div className="text-center font-medium">
          {getValue()}
        </div>,
      header: `Student Name`,
    }),
    columnHelper.accessor((row) => row.recentEnrollment?.billingDistrict?.name || `N/A`, {
      id: `district`,
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue()}
        </div>,
      header: `District`,
    }),
    ...MONTHS_IN_ORDER.map((monthNum) =>
      columnHelper.accessor(
        (row) => {
          const monthData = row.monthlySummary?.find((m) => m.month === monthNum);
          return monthData?.totalDirectMinutes ?? 0;
        },
        {
          id: `month_${monthNum}`,
          cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
          header: getMonthLabel(monthNum),
        },
      )),
    columnHelper.accessor(`id`, {
      cell: ({ getValue }) =>
        <div className="flex items-center justify-center gap-2">
          <Button
            asChild
            variant="outline"
          >
            <Link to={`/new-note?studentId=${getValue()}`}>
              <span className="text-blue-600 hover:text-blue-700">New Note</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            className="text-blue-600 hover:text-blue-700"
            asChild
          >
            <Link to={`/students/${getValue()}`}>
              View
            </Link>
          </Button>
        </div>,
      enableColumnFilter: false,
      enableHiding: false,
      enableResizing: false,
      enableSorting: false,
      header: () => <div className="text-center font-medium text-gray-700">Actions</div>,
    }),
  ], [ columnHelper ]);

  return <DataTable<StudentMonthlySummaryDTO & { recentEnrollment: any }>
    columns={columns}
    data={studentsWithRecentEnrollment}
    selectable
    filters={{ name: filterQuery }}
    isLoading={isLoading}
    noItemsText={isError ? `Error loading students` : `No data found.`}
  />;
};
