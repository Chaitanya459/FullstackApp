import React from 'react';
import { NotesTab } from '@/components/NotesTab';
import { useGetNotes } from '@/services/NoteService';

interface StudentNotesTabProps {
  serviceTypeId?: number | null;
  studentId?: number | null;
}

export const StudentNotesTab: React.FC<StudentNotesTabProps> = ({ serviceTypeId = null, studentId = null }) => {
  const { data: studentNotes = [], isLoading } = useGetNotes(
    { serviceTypeGroupId: serviceTypeId ?? undefined, studentId: studentId ?? undefined },
    studentId != null && serviceTypeId != null,
  );

  return <NotesTab
    notes={studentNotes}
    isLoading={isLoading}
    sheetTitle="Student Note Details"
    noNotesMessage="No student notes available"
  />;
};
