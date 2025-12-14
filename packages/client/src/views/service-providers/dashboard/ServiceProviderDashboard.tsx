import React, { useMemo, useState } from 'react';
import { Bell, Building2, Users } from 'lucide-react';
import { StudentSummaryDTO } from 'rsd';
import { differenceInDays } from 'date-fns';
import { StudentsTab } from './StudentsTab';
import { DistrictsTab } from './DistrictsTab';
import { MonthlyViewTable } from './MonthlyViewTable';
import { StatCard } from './StatCard';
import { Page } from '@/layout/page';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetStudentsSummary } from '@/services/StudentService';
import { useGetAcademicYears } from '@/services/AcademicYearService';

const ServiceProviderDashboard: React.FC = () => {
  const [ filterQuery, setFilterQuery ] = useState(``);
  const [ activeFilter, setActiveFilter ] = useState(`all`);
  const [ activeTab, setActiveTab ] = useState(`students`);

  const { data: academicYears } = useGetAcademicYears();
  const currentEducationYear = useMemo(() => {
    if (!academicYears || academicYears.length === 0) {
      return null;
    }
    return academicYears[0];
  }, [ academicYears ]);

  const { data: students = [] } = useGetStudentsSummary({
    yearId: currentEducationYear?.id?.toString(),
  }, !!currentEducationYear?.id);

  const counts = useMemo(() => {
    const active = students.filter((student: StudentSummaryDTO) => student.directMinutes > 0).length;

    const noVisit90Days = students.filter((student: StudentSummaryDTO) => {
      const { lastDirectService, serviceAssignments } = student;

      const hasDirectServiceScheduled = serviceAssignments &&
        Array.isArray(serviceAssignments) &&
        serviceAssignments.length > 0;

      if (!hasDirectServiceScheduled) {
        return false;
      }

      if (!lastDirectService) {
        return true;
      }

      const serviceDate = new Date(String(lastDirectService));

      const daysDiff = differenceInDays(new Date(), serviceDate);

      return daysDiff > 90;
    }).length;

    const servingDistricts = new Set<number>();
    students.forEach((student: StudentSummaryDTO) => {
      if (student.enrollments && Array.isArray(student.enrollments) && student.enrollments.length > 0) {
        student.enrollments.forEach((enrollment) => {
          if (enrollment?.billingDistrict?.id && typeof enrollment.billingDistrict.id === `number`) {
            servingDistricts.add(enrollment.billingDistrict.id);
          }
        });
      }
    });

    const totalIndirectMinutes = students.reduce((sum, student) => sum + Number(student.indirectMinutes || 0), 0);
    const totalDirectMinutes = students.reduce((sum, student) => sum + Number(student.directMinutes || 0), 0);
    const totalTravelMinutes = students.reduce((sum, student) => sum + Number(student.travelMinutes || 0), 0);

    return {
      active,
      directMinutes: totalDirectMinutes,
      indirectMinutes: totalIndirectMinutes,
      noVisit90Days,
      servingDistricts: servingDistricts.size,
      travelMinutes: totalTravelMinutes,
    };
  }, [ students ]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return <Page>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Active Students"
          value={counts.active}
          icon={<Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
        />
        <StatCard
          label="Serving Districts"
          value={counts.servingDistricts}
          icon={<Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
        />
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Indirect</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{counts.indirectMinutes}</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Direct</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{counts.directMinutes}</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Travel Time</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{counts.travelMinutes}</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="monthly">Monthly View</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <StudentsTab
            filterQuery={filterQuery}
            setFilterQuery={setFilterQuery}
            activeFilter={activeFilter}
            handleFilterChange={handleFilterChange}
            noVisit90Days={counts.noVisit90Days}
          />
        </TabsContent>
        <TabsContent value="districts">
          <DistrictsTab />
        </TabsContent>
        <TabsContent value="monthly">
          <MonthlyViewTable filterQuery={filterQuery} />
        </TabsContent>
        <TabsContent value="notes">
          <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground dark:border-gray-700">
            Notes View Coming Soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </Page>;
};

export default ServiceProviderDashboard;
