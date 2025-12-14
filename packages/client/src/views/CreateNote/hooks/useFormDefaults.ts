import { useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { useNoteContext } from '@/contexts/NoteContext';

type NoteType = `student` | `district`;

export const useFormDefaults = (noteTab: NoteType) => {
  const [ searchParams ] = useSearchParams();
  const { user } = useAuth();
  const { noteData } = useNoteContext();

  const studentIdFromUrl = searchParams.get(`studentId`);
  const studentIdValue = studentIdFromUrl && !isNaN(Number(studentIdFromUrl)) ?
      parseInt(studentIdFromUrl, 10) :
    noteData?.studentId ?? -1;

  const baseDefaults = {
    id: noteData.id ?? uuidv4(),
    billingDistrictId: noteData.billingDistrictId ?? -1,
    caseNotes: noteData.caseNotes ?? ``,
    directMinutes: noteData.directMinutes ?? 0,
    indirectMinutes: noteData.indirectMinutes ?? 0,
    ...(noteData?.serviceDate ? { serviceDate: new Date(noteData.serviceDate) } : {}),
    therapistId: noteData.therapistId ?? (user?.id ? Number(user.id) : -1),
    travelMinutes: noteData.travelMinutes ?? 0,
  };

  if (noteTab === `student`) {
    return {
      ...baseDefaults,
      noteType: `student` as const,
      serviceTypeId: noteData?.serviceTypeId ?? -1,
      studentId: studentIdValue,
    };
  }

  return {
    ...baseDefaults,
    noteType: `district` as const,
  };
};
