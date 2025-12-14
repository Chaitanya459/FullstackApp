import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { StudentSummaryDTO } from 'rsd';
import { differenceInDays, isValid, parseISO, startOfDay } from 'date-fns';
import { DataTable } from '@/components/data-table';
import { useGetStudentsSummary } from '@/services/StudentService';
import { useGetAcademicYears } from '@/services/AcademicYearService';
import { Button } from '@/components/ui/button';
import { getMostRecentEnrollment } from '@/utils/getMostRecentEnrollment';

const isOverdue = (dateString: string | null) => {
  if (!dateString) {
    return true;
  }

  const serviceDate = parseISO(dateString);

  if (!isValid(serviceDate)) {
    return true;
  }

  const daysDiff = differenceInDays(new Date(), serviceDate);

  return daysDiff > 90;
};

interface StudentsTableProps {
  activeFilter?: string;
  filterQuery?: string;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({ activeFilter = `all`, filterQuery = `` }) => {
  const { data: academicYears } = useGetAcademicYears();

  const currentEducationYear = useMemo(() => {
    if (!academicYears || academicYears.length === 0) {
      return null;
    }
    return academicYears[0];
  }, [ academicYears ]);

  const { data: students = [], error, isLoading } = useGetStudentsSummary({
    yearId: currentEducationYear?.id?.toString(),
  }, !!currentEducationYear);

  const studentsWithRecentEnrollment = useMemo(() =>
    students.map((student) => ({
      ...student,
      recentEnrollment: getMostRecentEnrollment(student.enrollments),
    })), [ students ]);

  const filteredByActiveStatus = useMemo(() => {
    if (activeFilter === `active`) {
      return studentsWithRecentEnrollment.filter((student) => student.directMinutes > 0);
    }

    if (activeFilter === `no-visit`) {
      return studentsWithRecentEnrollment.filter((student) =>
        student.directMinutes <= 0 || (student.lastDirectService && isOverdue(String(student.lastDirectService))));
    }

    return studentsWithRecentEnrollment;
  }, [ studentsWithRecentEnrollment, activeFilter ]);

  const columnHelper = createColumnHelper<StudentSummaryDTO>();

  const columns = useMemo(() => [
    columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
      id: `name`,
      cell: ({ getValue }) =>
        <div className="text-center font-medium">
          {getValue()}
        </div>,
      header: `Student Name`,
    }),
    columnHelper.accessor((row: any) => (row.recentEnrollment?.billingDistrict?.name || `N/A`) as string, {
      id: `district`,
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue()}
        </div>,
      header: `District`,
    }),
    columnHelper.accessor((row: any) => (row.recentEnrollment?.building?.name || `N/A`) as string, {
      id: `building`,
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue()}
        </div>,
      header: `Building`,
    }),
    columnHelper.accessor(`lastDirectService`, {
      cell: ({ row }) => {
        const { directMinutes, lastDirectService: lastService } = row.original;
        const hasNoDirectService = directMinutes <= 0;
        const isOverdueDate = lastService && isOverdue(lastService);

        const className = hasNoDirectService ? `font-medium text-red-600 dark:text-red-400` :
          isOverdueDate ? `font-medium text-red-600 dark:text-red-400` :
            `text-gray-900 dark:text-gray-100`;

        return <div className="text-center">
          <span className={className}>
            {lastService ?
              (typeof lastService === `string` ?
                parseISO(lastService) :
                startOfDay(lastService)).toLocaleDateString() :
              `No Service Records`}
          </span>
        </div>;
      },
      header: `Last Direct Service`,
    }),
    columnHelper.accessor(`directMinutes`, {
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue()}
        </div>,
      header: `Direct Minutes`,
    }),
    columnHelper.accessor(`indirectMinutes`, {
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue()}
        </div>,
      header: `Indirect Minutes`,
    }),
    columnHelper.accessor(`travelMinutes`, {
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue()}
        </div>,
      header: `Travel Minutes`,
    }),
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
        data={filteredByActiveStatus}
        selectable
        filters={{ name: filterQuery }}
      />
    </div>
  </div>;
};
