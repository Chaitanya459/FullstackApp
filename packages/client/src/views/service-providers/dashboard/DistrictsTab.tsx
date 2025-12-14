import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { differenceInDays, isValid, parseISO, startOfDay } from 'date-fns';
import { StudentSummaryDTO } from 'rsd';
import { type ColumnDef } from '@tanstack/react-table';
import { groupBy } from 'lodash';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useGetStudentsSummary } from '@/services/StudentService';
import { useGetAcademicYears } from '@/services/AcademicYearService';
import { DataTable } from '@/components/data-table';
import { getMostRecentEnrollment } from '@/utils/getMostRecentEnrollment';

const isOverdue = (dateString: string | null) => {
  if (!dateString) {
    return true;
  }
  const d = parseISO(String(dateString));
  if (!isValid(d)) {
    return true;
  }
  return differenceInDays(new Date(), d) > 90;
};

interface DistrictGroup {
  id: number | string;
  name: string;
  students: StudentSummaryDTO[];
  totals: {
    activeStudents: number;
    totalDirectMinutes: number;
  };
}

export const DistrictsTab: React.FC = () => {
  const { data: academicYears } = useGetAcademicYears();
  const currentEducationYear = useMemo(() => {
    if (!academicYears || academicYears.length === 0) {
      return null;
    }
    return academicYears[0];
  }, [ academicYears ]);

  const { data: apiStudents = [] } = useGetStudentsSummary({
    yearId: currentEducationYear?.id?.toString(),
  }, !!currentEducationYear?.id);

  const students = useMemo(() => apiStudents.map((s) => ({
    ...s,
    recentEnrollment: getMostRecentEnrollment(s.enrollments),
  })), [ apiStudents ]);

  const groups = useMemo<DistrictGroup[]>(() => {
    interface StudentDistrictPair {
      districtId: number | string;
      districtName: string;
      student: StudentSummaryDTO;
    }
    const studentDistrictPairs: StudentDistrictPair[] = [];

    students.forEach((student) => {
      if (student.enrollments && Array.isArray(student.enrollments) && student.enrollments.length > 0) {
        student.enrollments.forEach((enrollment) => {
          if (enrollment?.billingDistrict?.id && typeof enrollment.billingDistrict.id === `number`) {
            studentDistrictPairs.push({
              districtId: enrollment.billingDistrict.id,
              districtName: String(enrollment.billingDistrict.name ?? `Unknown District`),
              student,
            });
          }
        });
      } else {
        studentDistrictPairs.push({
          districtId: `unknown`,
          districtName: `Unknown District`,
          student,
        });
      }
    });

    const grouped = groupBy(studentDistrictPairs, (pair) => pair.districtId);

    const result = Object.entries(grouped).map(([ idKey, pairs ]) => {
      const districtName = pairs[0]?.districtName ?? `Unknown District`;

      const studentMap = new Map<number, StudentSummaryDTO>();
      pairs.forEach((pair) => {
        const studentId = typeof pair.student.id === `number` ? pair.student.id : Number(pair.student.id);
        if (Number.isFinite(studentId) && !studentMap.has(studentId)) {
          studentMap.set(studentId, pair.student);
        }
      });
      const uniqueStudents = Array.from(studentMap.values());

      const activeStudents = uniqueStudents.reduce((acc, s) => acc + ((s.directMinutes || 0) > 0 ? 1 : 0), 0);
      const totalDirectMinutes = uniqueStudents.reduce((acc, s) => acc + Number(s.directMinutes || 0), 0);
      const numericId = Number(idKey);
      return {
        id: Number.isFinite(numericId) ? numericId : idKey,
        name: districtName,
        students: uniqueStudents,
        totals: {
          activeStudents,
          totalDirectMinutes,
        },
      } as DistrictGroup;
    });

    return result.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [ students ]);

  const [ openIds, setOpenIds ] = useState<Record<string | number, boolean>>({});
  const toggle = (id: string | number) => setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));

  const getColumns = (districtName: string): Array<ColumnDef<StudentSummaryDTO>> => [
    {
      id: `name`,
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: ({ getValue }) =>
        <div className="text-center font-medium">
          {getValue() as string}
        </div>,
      header: () => <div className="text-center">Student Name</div>,
    },
    {
      id: `district`,
      accessorFn: () => districtName,
      cell: () =>
        <div className="text-center">
          {districtName}
        </div>,
      header: () => <div className="text-center">District</div>,
    },
    {
      id: `lastDirectService`,
      accessorFn: (row) => {
        const v = row.lastDirectService ? String(row.lastDirectService) : ``;
        const parsed = v ? Date.parse(v) : 0;
        return Number.isFinite(parsed) ? parsed : 0;
      },
      cell: ({ row }) => {
        const original = row.original as StudentSummaryDTO & { recentEnrollment?: any };
        const lastService = original.lastDirectService;
        const overdue =
          isOverdue(lastService ? String(lastService) : null) || (Number(original.directMinutes || 0) <= 0);
        return <div className="text-center">
          <span className={overdue ? `font-medium text-red-600 dark:text-red-400` : ``}>
            {lastService ?
              (typeof lastService === `string` ?
                parseISO(lastService) :
                startOfDay(lastService)).toLocaleDateString() :
              `No Service Records`}
          </span>
        </div>;
      },
      header: () => <div className="text-center">Last Direct Service</div>,
    },
    {
      id: `directMinutes`,
      accessorKey: `directMinutes`,
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue() as number}
        </div>,
      header: () => <div className="text-center">Direct Minutes</div>,
    },
    {
      id: `actions`,
      cell: ({ row }) => {
        const { id } = row.original;
        return <div className="flex items-center justify-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/new-note?studentId=${id}`}>New Note</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="text-blue-600 hover:text-blue-700">
            <Link to={`/students/${id}`}>View</Link>
          </Button>
        </div>;
      },
      enableSorting: false,
      header: () => <div className="text-center">Actions</div>,
    },
  ];

  return <div className="space-y-6">
    {groups.map((group) =>
      <Collapsible key={group.id} open={openIds[group.id] !== false} onOpenChange={() => toggle(group.id)}>
        <div className="mb-1 rounded-t-md border border-b-0 bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CollapsibleTrigger asChild>
                <button className="flex items-center rounded px-1 py-0.5 text-sm">
                  {openIds[group.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              </CollapsibleTrigger>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{group.name}</div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-gray-700 dark:text-gray-300">
                Active Students:
                {` `}
                <span className="font-semibold">{group.totals.activeStudents}</span>
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                Total Direct Minutes:
                {` `}
                <span className="font-semibold">{group.totals.totalDirectMinutes}</span>
              </div>
            </div>
          </div>
        </div>

        <CollapsibleContent>
          <div className="rounded-b-md border p-0 dark:border-gray-700">
            <DataTable<StudentSummaryDTO>
              columns={getColumns(group.name)}
              data={group.students}
              containerClassName="rounded-none border-0"
              paginate={false}
              selectable={false}
              sortable
            />
          </div>
        </CollapsibleContent>
      </Collapsible>)}
  </div>;
};

export default DistrictsTab;
