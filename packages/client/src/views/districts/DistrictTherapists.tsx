import React from 'react';
import { TherapistCard } from './TherapistCard';
import { useGetDistrictTherapists } from '@/services/TherapistService';

interface DistrictTherapistsProps {
  academicYearId?: number;
  districtId?: number;
  serviceTypeGroupId?: number;
}

export const DistrictTherapists: React.FC<DistrictTherapistsProps> = ({
  academicYearId,
  districtId,
  serviceTypeGroupId,
}) => {
  const { data: therapistData = [], isError, isLoading } = useGetDistrictTherapists({
    academicYearId,
    districtId,
    serviceTypeGroupId,
  }, !!districtId);

  if (isLoading) {
    return <div className="w-full p-8 text-center text-muted-foreground">
      Loading Providers...
    </div>;
  }

  if (isError) {
    return <div className="w-full p-8 text-center text-red-500">
      Error loading Providers. Please try again.
    </div>;
  }

  const therapists = therapistData.map((therapist) => ({
    caseloadStatus: therapist.caseLoadStatus ?? `Underassigned`,
    isExternalProvider: therapist.isExternalProvider,
    name: therapist.name,
    studentsAtDistrict: therapist.studentsAtDistrict,
    therapistId: therapist.id,
    title: (therapist.serviceTypes ?? []).join(`, `) || ``,
    totalStudents: therapist.totalStudents,
  }));

  if (therapists.length === 0) {
    return <div className="w-full p-8 text-center text-muted-foreground">
      No Providers found for the selected criteria.
    </div>;
  }

  return <div className="w-full">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {therapists.map((therapist) =>
        <TherapistCard
          key={therapist.therapistId}
          name={therapist.name}
          title={therapist.title}
          caseloadStatus={therapist.caseloadStatus}
          totalStudents={therapist.totalStudents}
          studentsAtDistrict={therapist.studentsAtDistrict}
          isExternalProvider={therapist.isExternalProvider}
        />)}
    </div>
  </div>;
};
