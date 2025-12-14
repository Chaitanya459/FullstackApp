import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DocumentationDTO,
  DocumentationSummaryDTO,
  DocumentationSummaryRange,
  GetDocumentationDTO,
  NoteType,
} from 'rsd';
import client from '@/lib/http.config';
import { useNoteContext } from '@/contexts/NoteContext';

const BASE_URL = `/note`;

interface UpsertNoteParams {
  mode: NoteType;
  note: Partial<DocumentationDTO>;
}

class NoteService {
  public static upsert(params: UpsertNoteParams): Promise<DocumentationDTO> {
    return client.post<DocumentationDTO>(
      `${BASE_URL}`,
      params.note,
      { params: { mode: params.mode } },
    ).then((response) => response.data);
  }

  public static submit(id: string, payload: { submittedOn: Date }): Promise<DocumentationDTO> {
    return client.put<DocumentationDTO>(`${BASE_URL}/${id}/submit`, payload)
      .then((res) => res.data);
  }

  public static get(params: GetDocumentationDTO): Promise<DocumentationDTO[]> {
    return client.get<DocumentationDTO[]>(`${BASE_URL}`, { params })
      .then((res) => res.data || []);
  }

  public static getNotesSummary(serviceTypeCode: string, range: DocumentationSummaryRange):
  Promise<DocumentationSummaryDTO> {
    return client.get<DocumentationSummaryDTO>(
      `${BASE_URL}/summary/${serviceTypeCode}?range=${range}`,
    )
      .then((res) => res.data);
  }
}

export const useUpsertNote = () => {
  const qc = useQueryClient();
  const { setAutoSaveStatus, setNoteData } = useNoteContext();

  const notesKey = [ `notes` ];

  return useMutation<
    DocumentationDTO,
    Error,
    UpsertNoteParams,
    { previousNotes: DocumentationDTO[] | undefined }
  >({
    mutationFn: (params: UpsertNoteParams) => NoteService.upsert(params),
    onError: (_err, _variables, context) => {
      setAutoSaveStatus(`error`);
      if (context?.previousNotes) {
        qc.setQueryData(notesKey, context.previousNotes);
      }
    },
    onMutate: async ({ note: newNote }) => {
      await qc.cancelQueries({ queryKey: notesKey });
      setAutoSaveStatus(`saving`);

      const previousNotes = qc.getQueryData<DocumentationDTO[]>(notesKey);

      qc.setQueryData<DocumentationDTO[]>(notesKey, (old = []) => [
        ...old,
        {
          ...newNote,
          id: newNote.id ?? ``,
          billingDistrictId: newNote.billingDistrictId ?? -1,
          caseNotes: newNote.caseNotes ?? ``,
          createdAt: newNote.createdAt ?? new Date(),
          createdBy: newNote.createdBy ?? -1,
          directMinutes: newNote.directMinutes ?? 0,
          indirectMinutes: newNote.indirectMinutes ?? 0,
          selectedGoals: newNote.selectedGoals ?? [],
          serviceDate: newNote.serviceDate ?? new Date(),
          serviceTypeId: newNote.serviceTypeId ?? -1,
          studentId: newNote.studentId ?? -1,
          submittedOn: newNote.submittedOn ?? null,
          therapistId: newNote.therapistId ?? -1,
          travelMinutes: newNote.travelMinutes ?? 0,
          updatedAt: newNote.updatedAt ?? new Date(),
          updatedBy: newNote.updatedBy ?? -1,
        },
      ]);
      return { previousNotes };
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: [ `notes` ] });
    },
    onSuccess: (data) => {
      setAutoSaveStatus(`saved`);
      setNoteData(data);
    },
  });
};

export const useSubmitNote = () => {
  const qc = useQueryClient();

  const notesKey = [ `notes` ];

  return useMutation<
    DocumentationDTO,
    Error,
    { id: string, noteType: string, submittedOn: Date },
    { previousNotes: DocumentationDTO[] | undefined }
  >({
    mutationFn: ({ id, submittedOn }) => NoteService.submit(id, { submittedOn }),
    onError: (err, newNote, context) => {
      if (context?.previousNotes) {
        qc.setQueryData(notesKey, context.previousNotes);
      }
    },
    onMutate: async ({ id, submittedOn }) => {
      await qc.cancelQueries({ queryKey: notesKey });

      const previousNotes = qc.getQueryData<DocumentationDTO[]>(notesKey);

      qc.setQueryData<DocumentationDTO[]>(notesKey, (old = []) => old.map((note) =>
        note.id === id ? { ...note, submittedOn: submittedOn.toISOString() } : note));

      return { previousNotes };
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: notesKey });
    },
  });
};

export const useGetNotes = (params: GetDocumentationDTO = {}, enabled = true) =>
  useQuery<DocumentationDTO[], Error>({
    enabled,
    queryFn: () => NoteService.get(params),
    queryKey: [ `notes`, params ],
  });

export const useGetNotesSummary = (serviceTypeCode: string, range: DocumentationSummaryRange, enabled: boolean) =>
  useQuery({
    enabled,
    queryFn: () => NoteService.getNotesSummary(serviceTypeCode, range),
    queryKey: [ `summaryData`, { range, serviceTypeCode }],
  });
