import { useEffect, useRef } from 'react';
import { useDebounceCallback } from '@react-hook/debounce';
import { UseFormReturn, useWatch } from 'react-hook-form';
import duration from 'parse-duration';
import isEqual from 'lodash/isEqual';
import { DocumentationDTO } from 'rsd';
import { useNoteContext } from '@/contexts/NoteContext';
import { useUpsertNote } from '@/services/NoteService';
import { FormSchema } from '@/views/CreateNote';

type NoteType = `student` | `district`;

export const useAutoSave = (
  methods: UseFormReturn<any>,
  noteTab: NoteType,
) => {
  const { formState } = methods;
  const { setAutoSaveStatus, setNoteData } = useNoteContext();
  const { mutate: upsertNote } = useUpsertNote();
  const lastSaved = useRef<FormSchema | null>(null);
  const watchedValues = useWatch({ control: methods.control }) as FormSchema;

  const debouncedUpsert = useDebounceCallback((data: Partial<DocumentationDTO>) => {
    if (!formState.isDirty || !formState.isValid || isEqual(lastSaved.current, data)) {
      return;
    }

    setAutoSaveStatus(`saving`);
    upsertNote({ mode: noteTab, note: data }, {
      onError: () => setAutoSaveStatus(`error`),
      onSuccess: () => {
        setAutoSaveStatus(`saved`);
        lastSaved.current = data as FormSchema;
      },
    });
  }, duration(`1s`) ?? undefined);

  useEffect(() => {
    if (watchedValues.noteType !== noteTab) {
      return;
    }
    const normalizedData: Partial<DocumentationDTO> = {
      ...watchedValues,
      billingDistrictId: watchedValues.billingDistrictId ? Number(watchedValues.billingDistrictId) : undefined,
      directMinutes: watchedValues.directMinutes !== undefined && watchedValues.directMinutes !== null ?
          Number(watchedValues.directMinutes) : 0,
      indirectMinutes: watchedValues.indirectMinutes !== undefined && watchedValues.indirectMinutes !== null ?
          Number(watchedValues.indirectMinutes) : 0,
      noteType: watchedValues.noteType,
      serviceDate: watchedValues?.serviceDate ? new Date(watchedValues.serviceDate) : undefined,
      serviceTypeId: watchedValues?.serviceTypeId ? Number(watchedValues.serviceTypeId) : undefined,
      studentId: watchedValues?.studentId ? Number(watchedValues.studentId) : undefined,
      therapistId: watchedValues.therapistId ? Number(watchedValues.therapistId) : undefined,
      travelMinutes: watchedValues.travelMinutes !== undefined && watchedValues.travelMinutes !== null ?
          Number(watchedValues.travelMinutes) : 0,
    };

    setNoteData(normalizedData);
    debouncedUpsert(normalizedData);
  }, [ watchedValues, setNoteData, debouncedUpsert, noteTab ]);

  return { lastSaved };
};
