import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useGetStudentsSummary } from '@/services/StudentService';
import { useGetAcademicYears } from '@/services/AcademicYearService';

interface DistrictSummary {
  districtId: number;
  districtName: string;
  studentsTotal: number;
  totalMinutes: number;
}

interface DistrictsTableProps {
  filterQuery?: string;
  therapistId?: number;
}

export const DistrictsTable: React.FC<DistrictsTableProps> = ({ filterQuery = ``, therapistId }) => {
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

  const districtsData = useMemo(() => {
    const districtMap = new Map<number, {
      districtId: number;
      districtName: string;
      studentIds: Set<number>;
      totalMinutes: number;
    }>();

    students.forEach((student) => {
      if (!student.enrollments || student.enrollments.length === 0) {
        return;
      }

      const studentTotalMinutes = Number(student.directMinutes || 0) +
        Number(student.indirectMinutes || 0) +
        Number(student.travelMinutes || 0);

      student.enrollments.forEach((enrollment) => {
        const district = enrollment.billingDistrict;
        if (!district || !district.id) {
          return;
        }

        if (!districtMap.has(district.id)) {
          districtMap.set(district.id, {
            districtId: district.id,
            districtName: district.name || `Unknown District`,
            studentIds: new Set(),
            totalMinutes: 0,
          });
        }

        const districtData = districtMap.get(district.id)!;
        districtData.studentIds.add(student.id);
        districtData.totalMinutes += studentTotalMinutes;
      });
    });

    return Array.from(districtMap.values()).map((data) => ({
      districtId: data.districtId,
      districtName: data.districtName,
      studentsTotal: data.studentIds.size,
      totalMinutes: data.totalMinutes,
    })).sort((a, b) => a.districtName.localeCompare(b.districtName));
  }, [ students ]);

  const filteredDistricts = useMemo(() => {
    if (!filterQuery.trim()) {
      return districtsData;
    }

    const query = filterQuery.toLowerCase();
    return districtsData.filter((district) =>
      district.districtName.toLowerCase().includes(query));
  }, [ districtsData, filterQuery ]);

  const columnHelper = createColumnHelper<DistrictSummary>();

  const columns = useMemo(() => [
    columnHelper.accessor(`districtName`, {
      id: `districtName`,
      cell: ({ getValue }) =>
        <div className="text-center font-medium">
          {getValue()}
        </div>,
      enableSorting: true,
      header: `District`,
    }),
    columnHelper.accessor(`studentsTotal`, {
      id: `studentsTotal`,
      cell: ({ getValue }) =>
        <div className="text-center">
          {getValue()}
        </div>,
      enableSorting: true,
      header: () => <div className="text-center">Students</div>,
    }),
    columnHelper.accessor(`totalMinutes`, {
      id: `totalMinutes`,
      cell: ({ getValue }) =>
        <div className="text-center font-medium">
          {getValue().toLocaleString()}
        </div>,
      enableSorting: true,
      header: () => <div className="text-center">Total Minutes</div>,
    }),
  ], [ columnHelper ]);

  if (isLoading) {
    return <div className="w-full p-8 text-center">Loading districts...</div>;
  }

  if (error) {
    return <div className="w-full p-8 text-center text-red-600 dark:text-red-400">Error loading districts: {error.message}</div>;
  }

  return <div className="w-full">
    <div>
      <DataTable<DistrictSummary>
        columns={columns}
        data={filteredDistricts}
      />
    </div>
  </div>;
};
