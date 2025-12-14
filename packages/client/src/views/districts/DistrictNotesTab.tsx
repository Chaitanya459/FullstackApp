import React from 'react';
import { NotesTab } from '@/components/NotesTab';
import { useGetNotes } from '@/services/NoteService';

interface DistrictNotesTabProps {
  academicYearId: number | undefined;
  districtId: number;
  serviceTypeGroupId?: number;
}

export const DistrictNotesTab: React.FC<DistrictNotesTabProps> = ({
  academicYearId,
  districtId,
  serviceTypeGroupId,
}) => {
  const { data: districtNotes, isLoading } = useGetNotes(
    { districtId, serviceTypeGroupId, yearId: academicYearId },
    !!districtId,
  );

  return <NotesTab
    notes={districtNotes ?? []}
    isLoading={isLoading}
    showDirectMinutes={false}
    sheetTitle="District Note Details"
    searchPlaceholder="Search notes or filter by date"
    noNotesMessage="No district notes available"
  />;
};
