import React, { useState } from 'react';
import { maxBy, sumBy } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { GetStudentByIdDTO } from 'rsd';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ServiceTypeGroupSelect } from '../districts/ServiceTypeGroupSelect';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import {
  useGetAcademicYears,
  useGetServiceTypeGroups,
  useGetStudentById,
  useGetStudents,
} from '@/services';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface StudentInfoProps {
  studentId: number;
}

const StudentCard: React.FC<StudentInfoProps> = ({ studentId }) => {
  const navigate = useNavigate();
  const { data: academicYears = [] } = useGetAcademicYears();
  const { data: serviceTypeGroups = [] } = useGetServiceTypeGroups();
  const { data: studentList, isLoading: isLoadingStudents } = useGetStudents({
    requireDocumentation: true,
    requireServiceAssignment: false,
  });

  const [ selectedYear, setSelectedYear ] = useState(``);
  const actualSelectedYear = selectedYear || academicYears[0]?.name || ``;
  const selectedYearObj = academicYears.find((y) => y.name === actualSelectedYear);

  const selectedId = studentId?.toString() || studentList?.[0]?.id?.toString() || ``;
  const selectedStudentObj = studentList?.find((s) => String(s.id) === selectedId) || null;

  const { user } = useAuth();
  const isTherapist = user?.roles?.some((role) => role.code === `THERAPIST`);

  const [ selectedServiceTypeGroupId, setSelectedServiceTypeGroupId ] = useState(() => {
    if (!isTherapist) {
      return `0`;
    }
    if (serviceTypeGroups && serviceTypeGroups.length > 0) {
      return serviceTypeGroups[0].id.toString();
    }
    return ``;
  });

  const params: GetStudentByIdDTO = selectedYearObj ? {
    endDate: new Date(selectedYearObj.endDate).toISOString(),
    startDate: new Date(selectedYearObj.startDate).toISOString(),
    ...selectedServiceTypeGroupId && selectedServiceTypeGroupId !== `0` && !isNaN(Number(selectedServiceTypeGroupId)) ?
      { serviceTypeGroupId: Number(selectedServiceTypeGroupId) } :
      {},
  } : {};

  const { data: studentDetails, isLoading } = useGetStudentById(
    studentId,
    typeof studentId === `number` && !isNaN(studentId) && studentId > 0,
    params,
  );

  const documentation = studentDetails?.documentation || [];

  const handleStudentSelect = (id: string) => {
    void navigate(`/students/${id}`);
  };

  const [ open, setOpen ] = useState(false);

  const enrollments = studentDetails?.enrollments ?? [];
  const selectedEnrollment = selectedYearObj?.id ?
    enrollments.find((e) => e.academicYearId === selectedYearObj.id) :
    undefined;

  return <Card className="w-full max-w-screen-xl border border-border bg-card p-5 !px-0 shadow-sm dark:border-border dark:bg-card">
    <CardContent>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="mb-6 grid grid-cols-5 gap-8">
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-2">
              {isLoadingStudents || !studentList ?
                <Button
                  variant="outline"
                  className="flex h-11 w-40 items-center justify-between rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  disabled
                >
                  <span className="flex items-center gap-2">
                    Loading Students
                    <Spinner className="h-5 w-5 text-gray-500 dark:text-gray-300" aria-label="Loading Students" />
                  </span>
                </Button> :
                studentList.length === 0 ?
                  <Button
                    variant="outline"
                    className="flex h-11 w-38 items-center justify-between rounded-md border border-border bg-card px-3 text-sm text-foreground dark:border-border dark:bg-card dark:text-foreground"
                    disabled
                  >
                    No Students
                  </Button> :
                  <Select
                    value={selectedStudentObj?.id?.toString() ?? ``}
                    onValueChange={handleStudentSelect}
                  >
                    <SelectTrigger className="h-11 w-40" aria-label="Select Student">
                      <SelectValue placeholder="Select Student" />
                    </SelectTrigger>
                    <SelectContent>
                      {studentList.map((student) =>
                        <SelectItem
                          key={student.id}
                          value={student.id.toString()}
                          className="w-50"
                        >
                          {student.firstName} {student.lastName}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-300">Student ID</span>
            {isLoadingStudents ?
              <Spinner className="mt-1 h-4 w-4 text-black dark:text-white" /> :
              <span className="font-medium text-black dark:text-white">{selectedStudentObj?.id ?? `-`}</span>}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-300">Billing District</span>
            {isLoading ?
              <Spinner className="mt-1 h-4 w-4 text-black dark:text-white" /> :
              <span className="font-medium text-black dark:text-white">{selectedEnrollment?.billingDistrict?.name ?? `-`}</span>}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-300">Date of Birth</span>
            {isLoading ?
              <Spinner className="mt-1 h-4 w-4 text-black dark:text-white" /> :
              <span className="font-medium text-black dark:text-white">
                {studentDetails?.dateOfBirth ?
                  new Date(studentDetails.dateOfBirth).toLocaleDateString(`en-US`) :
                  `-`}
              </span>}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-300">Most Recent Active Year</span>
            {isLoadingStudents ?
              <Spinner className="mt-1 h-4 w-4 text-black dark:text-white" /> :
              isLoading ?
                <Spinner className="mt-1 h-4 w-4 text-black dark:text-white" /> :

                <span className="font-medium text-black dark:text-white">
                  {(() => {
                    const studentEnrollments = selectedStudentObj?.enrollments ?? [];
                    if (studentEnrollments.length === 0) {
                      return `-`;
                    }
                    const mostRecent = maxBy(
                      studentEnrollments,
                      (e) => new Date(e.exitDate || e.enrollmentDate).getTime(),
                    );
                    if (!mostRecent?.academicYearId) {
                      return `-`;
                    }
                    const yearObj = academicYears.find((y) => y.id === mostRecent.academicYearId);
                    return yearObj?.name ?? `-`;
                  })()}
                </span>}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-300">School Building</span>
            {isLoading ?
              <Spinner className="mt-1 h-4 w-4 text-black dark:text-white" /> :
              <span className="font-medium text-black dark:text-white">{selectedEnrollment?.building?.name ?? `-`}</span>}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-300">School Phone</span>
            {isLoading ?
              <Spinner className="mt-1 h-4 w-4 text-black dark:text-white" /> :
              <span className="font-medium text-black dark:text-white">{selectedEnrollment?.building?.phoneNumber ?? `-`}</span>}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-300">Room Number</span>
            {isLoading ?
              <Spinner className="mt-1 h-4 w-4 text-black dark:text-white" /> :
              <span className="font-medium text-black dark:text-white">{selectedEnrollment?.roomNumber ?? `-`}</span>}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-300">Teacher</span>
            {isLoading ?
              <Spinner className="mt-1 h-4 w-4 text-black dark:text-white" /> :
              <span className="font-medium text-black dark:text-white">{selectedEnrollment?.teacherName ?? `-`}</span>}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-300">Grade</span>
            {isLoading ?
              <Spinner className="mt-1 h-4 w-4 text-black dark:text-white" /> :
              <span className="font-medium text-black dark:text-white">{selectedEnrollment?.gradeLevel?.name ?? `-`}</span>}
          </div>
        </div>
        <CollapsibleContent>
          <div className="mb-6 grid grid-cols-5 gap-8">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-300">District Representative</span>
              <span className="font-medium text-black dark:text-white">-</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-300">Referral Type</span>
              <span className="font-medium text-black dark:text-white">-</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-300">Referring District</span>
              <span className="font-medium text-black dark:text-white">-</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-300">Sessions District</span>
              <span className="font-medium text-black dark:text-white">{selectedEnrollment?.districtOfAttendance?.name ?? `-`}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-300">Home District</span>
              <span className="font-medium text-black dark:text-white">{selectedEnrollment?.districtOfResidence?.name ?? `-`}</span>
            </div>
          </div>
        </CollapsibleContent>
        <div className="mb-6 flex flex-row flex-wrap gap-4 [&>*]:gap-0">
          <div className="flex-1 rounded-lg border border-border bg-muted p-4 dark:border-border dark:bg-muted">
            <CardTitle className="mb-2 text-left text-foreground">Total Direct Time</CardTitle>
            <CardContent className="p-0 text-left text-foreground">
              {isLoading ? <Spinner className="h-4 w-4 text-black dark:text-white" /> : documentation ? sumBy(documentation, (doc) => doc.directMinutes || 0) : `-`}
            </CardContent>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-muted p-4 dark:border-border dark:bg-muted">
            <CardTitle className="mb-2 text-left text-foreground">Total Indirect Time</CardTitle>
            <CardContent className="p-0 text-left text-foreground">
              {isLoading ? <Spinner className="h-4 w-4 text-black dark:text-white" /> : documentation ? sumBy(documentation, (doc) => doc.indirectMinutes || 0) : `-`}
            </CardContent>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-muted p-4 dark:border-border dark:bg-muted">
            <CardTitle className="mb-2 text-left text-foreground">Total Travel Time</CardTitle>
            <CardContent className="p-0 text-left text-foreground">
              {isLoading ? <Spinner className="h-4 w-4 text-black dark:text-white" /> : documentation ? sumBy(documentation, (doc) => doc.travelMinutes || 0) : `-`}
            </CardContent>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-muted p-4 dark:border-border dark:bg-muted">
            <CardTitle className="mb-2 text-left text-foreground">FTE Used</CardTitle>
            <CardContent className="p-0 text-left text-foreground">
              {isLoading ? <Spinner className="h-4 w-4 text-black dark:text-white" /> : `-`}
            </CardContent>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-muted p-4 dark:border-border dark:bg-muted">
            <CardTitle className="mb-2 text-left text-foreground">Total Sessions</CardTitle>
            <CardContent className="p-0 text-left text-foreground">
              {isLoading ? <Spinner className="h-4 w-4 text-black dark:text-white" /> : documentation ? documentation.length : `-`}
            </CardContent>
          </div>
        </div>
        <CardFooter className="mt-4 flex flex-row items-center gap-2 px-0">
          <div className="flex flex-row items-center gap-2">
            {serviceTypeGroups.length > 0 &&
              <ServiceTypeGroupSelect
                className="ml-0"
                selectedServiceTypeId={selectedServiceTypeGroupId ?? ``}
                serviceTypeGroups={serviceTypeGroups}
                setSelectedServiceTypeId={setSelectedServiceTypeGroupId}
                allEnabled={!isTherapist}
              />}
            <Select
              value={actualSelectedYear}
              onValueChange={setSelectedYear}
              disabled={academicYears.length === 0}
            >
              <SelectTrigger className="h-11 w-40" aria-label="Select Year">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.length === 0 ?
                  <SelectItem value="loading" disabled className="w-50">Loading Years</SelectItem> :
                  academicYears.map((year) =>
                    <SelectItem
                      key={year.name}
                      value={year.name}
                      className="w-50"
                    >
                      {year.name}
                    </SelectItem>)}
              </SelectContent>
            </Select>
            {isLoading &&
              <Spinner className="ml-2 h-4 w-4 text-black dark:text-white" />}
          </div>
          <div className="flex flex-1 justify-end">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center text-sm text-gray-700 dark:text-gray-200"
              >
                {open ?
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Hide Details
                  </> :
                  <>
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Show More Details
                  </>}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardFooter>
      </Collapsible>
    </CardContent>
  </Card>;
};

export default StudentCard;
