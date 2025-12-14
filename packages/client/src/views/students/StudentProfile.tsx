import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { StudentNotesTab } from './StudentNotesTab';
import { ServiceProviderCard } from './ServiceProviderCard';
import StudentInfo from './StudentInfo';
import { ProfileTabs } from '@/components/ProfileTabs';
import { useGetStudentById } from '@/services';
import { Card, CardContent } from '@/components/ui/card';
import { Page } from '@/layout/page';

type StudentTab = `notes`;

const RouteIdSchema = z.coerce.number().int().positive();

function validateRouteId(value: string | undefined): number | null {
  if (!value) {
    return null;
  }
  try {
    return RouteIdSchema.parse(value);
  } catch {
    return null;
  }
}

const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const studentId = useMemo(() => validateRouteId(id), [ id ]);
  const [ activeTab, setActiveTab ] = useState<StudentTab>(`notes`);

  const { data: studentInfo } = useGetStudentById(studentId, studentId != null);
  const serviceAssignments = studentInfo?.serviceAssignments ?? [];

  const hasInvalidStudentId = id && !studentId;

  return <Page title="Student Profile">
    <div className="flex w-full flex-col space-y-4 p-4 md:p-6 lg:flex-row lg:space-y-0 lg:space-x-4">
      <div className="w-full space-y-4 lg:w-3/4">
        {hasInvalidStudentId &&
          <Card className="border border-red-300 bg-red-50">
            <CardContent className="px-4 pt-3 !pb-0">
              <div className="flex items-center gap-2 text-red-600">
                <span className="text-sm font-medium">Invalid Student ID</span>
              </div>
              <p className="mt-2 text-sm text-red-600">
                The student ID "{id}" is not valid.
              </p>
            </CardContent>
          </Card>}

        {studentId != null && <StudentInfo studentId={studentId} />}

        {studentId != null &&
          <Card className="p-3">
            <CardContent className="p-0">
              <ProfileTabs<StudentTab>
                tabs={[
                  {
                    content: <StudentNotesTab studentId={studentId} />,
                    label: `Notes`,
                    value: `notes`,
                  },
                ]}
                value={activeTab}
                onValueChange={setActiveTab}
                disableOthers={false}
              />
            </CardContent>
          </Card>}
      </div>
      <div className="w-full lg:w-1/4">
        <ServiceProviderCard serviceAssignments={serviceAssignments} />
      </div>
    </div>
  </Page>;
};

export default StudentProfilePage;
