import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, Circle, Phone } from 'lucide-react';
import { z } from 'zod';
import { DistrictTherapists } from './DistrictTherapists';
import { StudentsTable } from './StudentsTab';
import { DistrictNotesTab } from './DistrictNotesTab';
import { ServiceTypeGroupSelect } from './ServiceTypeGroupSelect';
import { ProfileTabs } from '@/components/ProfileTabs';
import { useGetDistricts } from '@/services/DistrictService';
import { Page } from '@/layout/page';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAcademicYears, useGetServiceTypeGroups } from '@/services';

type DistrictTab = `students` | `notes` | `providers`;

const RouteIdSchema = z.coerce.number().int().positive();

function validateRouteId(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  try {
    return RouteIdSchema.parse(value);
  } catch {
    return undefined;
  }
}

const Stat: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) =>
  <div className="min-w-[110px]">
    <div className="leading-tight font-semibold text-emerald-600">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>;

const DistrictProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: academicYears } = useGetAcademicYears();
  const currentYear = useMemo(() => academicYears?.[0], [ academicYears ]);

  const [ academicYearId, setAcademicYearId ] = useState<number | undefined>(currentYear?.id);
  const [ serviceTypeGroupId, setServiceTypeGroupId ] = useState<number | undefined>(undefined);
  const [ selectedDistrictId, setSelectedDistrictId ] = useState<number | null>(null);
  const [ activeTab, setActiveTab ] = useState<DistrictTab>(`students`);

  const districtId = useMemo(() => {
    const urlDistrictId = validateRouteId(id);
    return selectedDistrictId || urlDistrictId;
  }, [ selectedDistrictId, id ]);

  const hasInvalidDistrictId = useMemo(() =>
    id && !validateRouteId(id) && !selectedDistrictId,
  [ id, selectedDistrictId ]);

  const { data: districts } = useGetDistricts();
  const { data: serviceTypeGroups } = useGetServiceTypeGroups();

  const handleYearChange = (value: string) => {
    const yearId = parseInt(value, 10);
    setAcademicYearId(isNaN(yearId) ? undefined : yearId);
  };

  const handleServiceTypeGroupChange = (newServiceTypeGroupId: string) => {
    if (newServiceTypeGroupId === `all`) {
      setServiceTypeGroupId(undefined);
    } else {
      const parsedId = parseInt(newServiceTypeGroupId, 10);
      setServiceTypeGroupId(isNaN(parsedId) ? undefined : parsedId);
    }
  };

  const handleDistrictChange = (districtIdStr: string) => {
    const newDistrictId = validateRouteId(districtIdStr);
    if (newDistrictId) {
      setSelectedDistrictId(newDistrictId);
      void navigate(`/districts/${districtIdStr}`, { replace: true });
    }
  };

  return <Page title="Districts Profile">
    <div className="space-y-4">
      {hasInvalidDistrictId &&
        <Card className="border border-red-300 bg-red-50">
          <CardContent className="px-4 pt-3 !pb-0">
            <div className="flex items-center gap-2 text-red-600">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">Invalid District ID</span>
            </div>
            <p className="mt-2 text-sm text-red-600">
              The district ID "{id}" is not valid. Please select a valid district from the dropdown below.
            </p>
          </CardContent>
        </Card>}
      <Card className="border-bg border bg-card">
        <CardContent className="px-6 pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-600" />
              <Select onValueChange={handleDistrictChange} value={districtId?.toString() || ``}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Choose a district" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {districts?.map((district) =>
                    <SelectItem key={district.id} value={district.id.toString()}>
                      {district.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <label className="flex items-center gap-2" htmlFor="year-select">
              <span className="text-sm text-muted-foreground">Year</span>
              <Select
                value={academicYearId?.toString() || ``}
                onValueChange={handleYearChange}
              >
                <SelectTrigger id="year-select" className="w-[140px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {academicYears?.map((year) =>
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </label>

            <div className="hidden items-center gap-6 md:flex">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 opacity-70" />
                <span className="font-medium">xxx-xxx-xxxx</span>
              </div>
              <div className="text-sm">
                <span className="mr-1 text-muted-foreground">Grades</span>
                <span className="font-medium">x-x</span>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2 text-xs">
              <Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />
              <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-600">X District</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Stat label="YTD Cost" value="XX$" />
            <Stat label="FTE Requested" value="X" />
            <Stat label="FTE Utilization" value="X%" />
            <Stat label="Active Students" value="X" />
            <Stat label="Case Load" value="x" />
          </div>

          <div className="mt-6 -ml-4 flex">
            <ServiceTypeGroupSelect
              selectedServiceTypeId={serviceTypeGroupId?.toString() || `0`}
              serviceTypeGroups={serviceTypeGroups}
              setSelectedServiceTypeId={handleServiceTypeGroupChange}
            />
          </div>
        </CardContent>
      </Card>

      {districtId != null &&
        <Card className="p-3">
          <CardContent className="p-0">
            <ProfileTabs<DistrictTab>
              tabs={[
                {
                  content: <StudentsTable
                    districtId={districtId}
                    academicYearId={academicYearId}
                    serviceTypeGroupId={serviceTypeGroupId}
                  />,
                  label: `Students`,
                  value: `students`,
                },
                {
                  content: districtId ? <DistrictNotesTab
                    districtId={districtId}
                    academicYearId={academicYearId}
                    serviceTypeGroupId={serviceTypeGroupId}
                  /> : null,
                  label: `Notes`,
                  value: `notes`,
                },
                {
                  content: <DistrictTherapists
                    districtId={districtId}
                    academicYearId={academicYearId}
                    serviceTypeGroupId={serviceTypeGroupId}
                  />,
                  label: `Providers`,
                  value: `providers`,
                },
              ]}
              value={activeTab}
              onValueChange={setActiveTab}
              disableOthers={false}
            />
          </CardContent>
        </Card>}
    </div>
  </Page>;
};

export default DistrictProfilePage;
