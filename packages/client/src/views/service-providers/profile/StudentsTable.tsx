import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { StudentSummaryDTO } from 'rsd';
import { DataTable } from '@/components/data-table';
import { useGetStudentsSummary } from '@/services/StudentService';
import { useGetAcademicYears } from '@/services/AcademicYearService';
import { Button } from '@/components/ui/button';
import { getMostRecentEnrollment } from '@/utils/getMostRecentEnrollment';

interface StudentsTableProps {
  filterQuery?: string;
  therapistId: number;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  filterQuery = ``,
  therapistId,
}) => {
  const { data: academicYears } = useGetAcademicYears();

  const currentEducationYear = useMemo(() => {
    if (!academicYears || academicYears.length === 0) {
      return null;
    }
    return academicYears[0];
  }, [ academicYears ]);

  const { data: students = [], error, isLoading } = useGetStudentsSummary({
    therapistId,
    yearId: currentEducationYear?.id?.toString(),
  }, !!currentEducationYear);

  const studentsWithRecentEnrollment = useMemo(() =>
    students.map((student) => ({
      ...student,
      recentEnrollment: getMostRecentEnrollment(student.enrollments),
    })), [ students ]);

  const columnHelper = createColumnHelper<StudentSummaryDTO>();

  const columns = useMemo(() => [
    columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
      id: `name`,
      cell: ({ getValue }) =>
        <div className="text-center font-medium">
          {getValue()}
        </div>,
      enableSorting: true,
      header: () => <div className="text-center">Student Name</div>,
    }),
    columnHelper.accessor((row: any) => (row.recentEnrollment?.billingDistrict?.name || `-`) as string, {
      id: `district`,
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue()}
        </div>,
      enableSorting: true,
      header: () => <div className="text-center">District</div>,
    }),
    columnHelper.accessor(() => 0, {
      id: `ytdCost`,
      cell: () => <div className="text-center font-medium">-</div>,
      enableSorting: true,
      header: () => <div className="text-center">YTD Total Cost</div>,
    }),
    columnHelper.accessor(`directMinutes`, {
      id: `directMinutes`,
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue().toLocaleString()}
        </div>,
      enableSorting: true,
      header: () => <div className="text-center">Direct Minutes</div>,
    }),
    columnHelper.accessor(`indirectMinutes`, {
      id: `indirectMinutes`,
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue().toLocaleString()}
        </div>,
      enableSorting: true,
      header: () => <div className="text-center">Indirect Minutes</div>,
    }),
    columnHelper.accessor(`travelMinutes`, {
      id: `travelMinutes`,
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue().toLocaleString()}
        </div>,
      enableSorting: true,
      header: () => <div className="text-center">Travel Minutes</div>,
    }),
    columnHelper.accessor((row) =>
      Number(row.directMinutes || 0) +
      Number(row.indirectMinutes || 0) +
      Number(row.travelMinutes || 0), {
      id: `totalMinutes`,
      cell: ({ getValue }) => <div className="text-center font-medium">{getValue().toLocaleString()}</div>,
      enableSorting: true,
      header: () => <div className="text-center">Total Minutes</div>,
    }),
    columnHelper.accessor(() => null, {
      id: `fteUsage`,
      cell: () => <div className="text-center">-</div>,
      enableSorting: false,
      header: () => <div className="text-center">FTE Usage</div>,
    }),
    columnHelper.display({
      id: `status`,
      cell: () => <div className="text-center">-</div>,
      enableSorting: false,
      header: () => <div className="text-center">Status</div>,
    }),
    columnHelper.accessor(`id`, {
      id: `actions`,
      cell: ({ getValue }) =>
        <div className="flex items-center justify-center gap-2">
          <Button
            asChild
            variant="outline"
            className="text-blue-600 hover:text-blue-700"
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

  if (isLoading) {
    return <div className="w-full p-8 text-center">Loading students...</div>;
  }

  if (error) {
    return <div className="w-full p-8 text-center text-red-600 dark:text-red-400">Error loading students: {error.message}</div>;
  }

  return <div className="w-full">
    <div>
      <DataTable<StudentSummaryDTO>
        columns={columns}
        data={studentsWithRecentEnrollment}
        filters={{ name: filterQuery }}
      />
    </div>
  </div>;
};
