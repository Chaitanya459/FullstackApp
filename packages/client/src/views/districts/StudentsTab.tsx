import React, { useCallback, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import { StudentDTO } from 'rsd';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { useGetStudents } from '@/services/StudentService';
import { cn } from '@/lib/utils';

function currency(n?: number | null) {
  if (n == null || Number.isNaN(n)) {
    return `—`;
  }
  return `$${n.toLocaleString()}`;
}

function minutes(n?: number | null) {
  return n == null ? `—` : `${n.toLocaleString()}m`;
}

export interface StudentsTableProps {
  academicYearId?: number;
  districtId?: number;
  serviceTypeGroupId?: number;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({ academicYearId, districtId, serviceTypeGroupId }) => {
  const [ isExporting, _setIsExporting ] = useState(false);

  const { data = [], isFetching } = useGetStudents({
    academicYearId,
    districtId,
    serviceTypeGroupId,
  }, Boolean(districtId));

  const calculateStatus = (s: StudentDTO): `Active` | `Discharged` => {
    const hasActiveEnrollment = s.enrollments?.some((enrollment) => !enrollment.exitDate) ?? false;

    return hasActiveEnrollment ? `Active` : `Discharged`;
  };

  const filtered = data;

  const handleExport = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log(`Export functionality not yet implemented`);
  }, []);

  const columnHelper = createColumnHelper<StudentDTO>();

  const columns = useMemo(() => [
    columnHelper.accessor(`lastName`, {
      cell: ({ row }) =>
        <div className="text-center">
          {row.original.lastName}
        </div>,
      header: `Last Name`,
      size: 120,
    }),
    columnHelper.accessor(`firstName`, {
      cell: ({ row }) =>
        <div className="text-center">
          {row.original.firstName}
        </div>,
      header: `First Name`,
      size: 120,
    }),
    // TODO: calculate current enrollment instead of just taking the first enrollment
    columnHelper.accessor(`enrollments`, {
      id: `gradeLevel`,
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue()?.[0]?.gradeLevel?.name ?? `—`}
        </div>,
      header: `Grade`,
      size: 80,
      sortingFn: (rowA, rowB) => {
        const orderA = rowA.original.enrollments?.[0]?.gradeLevel?.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = rowB.original.enrollments?.[0]?.gradeLevel?.order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      },
    }),
    columnHelper.accessor(`id`, {
      id: `status`,
      cell: ({ row }) => {
        const status = calculateStatus(row.original);
        return <span
          className={cn(`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium`, {
            'bg-gray-100 text-gray-800': status !== `Active` && status !== `Discharged`,
            'bg-green-100 text-green-800': status === `Active`,
            'bg-red-100 text-red-800': status === `Discharged`,
          })}
        >
          {status}
        </span>;
      },
      header: () =>
        <div className="text-center">
          <div>Status</div>
        </div>,
      size: 100,
    }),
    columnHelper.accessor(`serviceAssignments`, {
      cell: ({ getValue }) => {
        const assignments = getValue() || [];
        const filteredAssignments = serviceTypeGroupId ?
          assignments.filter((assignment) => assignment.serviceType?.serviceTypeGroupId === serviceTypeGroupId) :
          assignments;

        const therapistNames = filteredAssignments
          .map((assignment) => assignment.therapist?.name)
          .filter(Boolean)
          .filter((name, index, array) => array.indexOf(name) === index);

        return <div className="text-center">
          {therapistNames.length > 0 ? therapistNames.join(`, `) : `—`}
        </div>;
      },
      header: `Therapist`,
      size: 120,
    }),
    // TODO: calculate current enrollment instead of just taking the first enrollment
    columnHelper.accessor(`enrollments`, {
      id: `districtOfResidence`,
      cell: ({ getValue }) =>
        <div className="text-center break-words whitespace-normal">
          {getValue()?.[0]?.districtOfResidence?.name ?? `—`}
        </div>,
      header: () =>
        <div className="text-center">
          <div>District Of</div>
          <div>Residence</div>
        </div>,
      size: 120,
    }),
    columnHelper.accessor(`id`, {
      id: `ytdCost`,
      cell: () =>
        <div className="text-right">
          {currency(null)}
        </div>,
      header: () =>
        <div className="text-center">
          <div>YTD Total</div>
          <div>Cost</div>
        </div>,
      size: 120,
    }),
    columnHelper.accessor(`id`, {
      id: `totalMinutes`,
      cell: () =>
        <div className="text-center">
          {minutes(null)}
        </div>,
      header: () =>
        <div className="text-center">
          <div>Total</div>
          <div>Minutes</div>
        </div>,
      size: 120,
    }),
  ], [ columnHelper, serviceTypeGroupId ]);

  return <div className="w-full">
    <div className="mb-6 flex">
      <div className="flex w-1/2 flex-wrap items-center gap-8 px-6 text-sm text-muted-foreground">
        <span>{isFetching ? `Loading…` : `${filtered.length} total`}</span>
      </div>
      <div className="mx-6 flex w-1/2 justify-end">
        <Button
          color="secondary"
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? `Exporting...` : `Export`}
        </Button>
      </div>
    </div>

    <div className="px-4 pb-4">
      <div className="overflow-x-auto">
        <DataTable<StudentDTO>
          sortable
          columns={columns}
          data={filtered}
        />
      </div>
    </div>
  </div>;
};
