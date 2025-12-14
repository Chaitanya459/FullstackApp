import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, Resolver, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { FormSelect } from './CreateNote/FormSelect';
import { NoteDirectMinutes } from './CreateNote/DirectMinute';
import { NoteIndirectMinutes } from './CreateNote/IndirectMinute';
import { NoteTravelMinutes } from './CreateNote/TravelMinute';
import { NoteSessionDate } from './CreateNote/SessionDate';
import { NoteSelectedGoals } from './CreateNote/SelectedGoals';
import { NoteTextField } from './CreateNote/NoteText';
import { AutoSaveStatus } from './CreateNote/components/AutoSaveStatus';
import { NoteTypeToggle } from './CreateNote/components/NoteTypeToggle';
import { PreviousNotesCard } from './CreateNote/components/PreviousNotesCard';
import { useAutoSave } from './CreateNote/hooks/useAutoSave';
import { useNoteContext } from '@/contexts/NoteContext';
import { useAuth } from '@/contexts/AuthContext';
import { useGetNotes, useSubmitNote, useUpsertNote } from '@/services/NoteService';
import { useGetStudentById, useGetStudents } from '@/services/StudentService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Page } from '@/layout/page';
import { useGetDistricts } from '@/services/DistrictService';

const NoteType = z.enum([ `student`, `district` ]);
type NoteType = z.infer<typeof NoteType>;

const BaseNoteFormSchema = z.object({
  id: z.string().optional(),
  billingDistrictId: z.coerce.number().refine((val) => !isNaN(val) && val > -1, { message: `DistrictId is required.` }),
  caseNotes: z.string().min(1, `Case notes are required`).trim(),
  directMinutes: z.number({ message: `Direct minutes required` }).min(0, `Direct minutes required`),
  indirectMinutes: z.number({ message: `Indirect minutes required` }).min(0, `Indirect minutes required`),
  serviceDate: z.coerce.date({
    error: (issue) => issue.input === undefined ?
      `Session date is required.` :
      `Not a date`,
  }).refine((d) => !isNaN(d.getTime()), `Select a valid session date.`),
  therapistId: z.coerce.number().refine((val) => !isNaN(val) && val > -1, { message: `Therapist id is required.` }),
  travelMinutes: z.number({ message: `Travel minutes required` }).min(0, `Travel minutes required`),
});

const StudentNoteFormSchema = BaseNoteFormSchema.extend({
  noteType: z.literal(`student`),
  serviceTypeId: z.coerce.number().int().min(1, `ServiceType is required.`),
  studentId: z.coerce.number().int().min(1, `Student is required.`),
});

const DistrictNoteFormSchema = BaseNoteFormSchema.extend({
  noteType: z.literal(`district`),
  serviceTypeId: z.coerce.number().int().optional(),
  studentId: z.coerce.number().int().optional(),
});

export const FormSchema = z.discriminatedUnion(`noteType`, [
  StudentNoteFormSchema,
  DistrictNoteFormSchema,
]);

export type FormSchema = z.infer<typeof FormSchema>;
const defaultsFor = (mode: NoteType) =>
  mode === `student` ?
    ({ noteType: `student` } as const) :
    ({ noteType: `district` } as const);

export const CreateNote: React.FC = () => {
  const [ searchParams ] = useSearchParams();
  const studentIdFromUrl = searchParams.get(`studentId`);
  const { mutate: submitNote } = useSubmitNote();
  const { mutate: upsertNote } = useUpsertNote();
  const { setAutoSaveStatus } = useNoteContext();
  const [ noteTab, setNoteTab ] = useState<NoteType>(`student`);
  const {
    autoSaveStatus,
    lastSavedAt,
    noteData,
    setNoteData,
  } = useNoteContext();
  const { user } = useAuth();

  const methods = useForm<FormSchema>({
    defaultValues: {
      ...defaultsFor(noteTab),
      id: noteData.id ?? uuidv4(),
      billingDistrictId: noteData.billingDistrictId ?? -1,
      caseNotes: noteData.caseNotes ?? ``,
      directMinutes: noteData.directMinutes ?? 0,
      indirectMinutes: noteData.indirectMinutes ?? 0,
      ...noteData?.serviceDate ? { serviceDate: new Date(noteData.serviceDate) } : {},
      noteType: noteTab,
      therapistId: noteData.therapistId ?? (user?.id ? Number(user.id) : -1),
      ...noteTab === `student` ?
        {
          serviceTypeId: noteData?.serviceTypeId ?? -1,
          studentId:
            studentIdFromUrl && !isNaN(Number(studentIdFromUrl)) ?
              parseInt(studentIdFromUrl, 10) :
              noteData?.studentId ?? -1,
        } :
        {},
      travelMinutes: noteData.travelMinutes ?? 0,
    },
    resolver: zodResolver(FormSchema) as Resolver<FormSchema, any>,
  });

  const { formState, getValues, handleSubmit, reset, setValue } = methods;
  const studentId = getValues(`studentId`);
  const therapistId = getValues(`therapistId`);
  const billingDistrictId = getValues(`billingDistrictId`);
  const serviceTypeId = getValues(`serviceTypeId`);
  const noteId = getValues(`id`);

  useEffect(() => {
    if (!noteId) {
      setValue(`id`, uuidv4());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ noteId ]);

  useEffect(() => {
    if ((!therapistId || therapistId === -1) && user?.id) {
      setValue(`therapistId`, Number(user?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ therapistId, user?.id ]);

  const { data: students = [] } = useGetStudents();
  const { data: districts = [] } = useGetDistricts();

  const studentNum: number | null =
    studentIdFromUrl && !isNaN(Number(studentIdFromUrl)) ?
      parseInt(studentIdFromUrl, 10) :
      studentId && studentId > -1 ? Number(studentId) : null;

  const serviceTypeValue: number | null = serviceTypeId && serviceTypeId > -1 ? Number(serviceTypeId) : null;

  const { data: studentData } = useGetStudentById(studentNum, studentNum !== undefined);
  const { data: studentNotes = [] } = useGetNotes(
    { serviceTypeId: serviceTypeValue || undefined, studentId: studentNum || undefined },
    noteTab === `student` && studentNum !== undefined && serviceTypeValue !== undefined,
  );

  const billingDistrict = studentData?.enrollments &&
    studentData.enrollments.length > 0 ? studentData.enrollments[0].billingDistrict : null;

  const serviceTypes = useMemo(() => {
    if (studentData?.serviceAssignments && studentData?.serviceAssignments.length > 0) {
      const uniqueServiceTypes = new Map(
        studentData.serviceAssignments
          .filter((sa) => sa.serviceType !== undefined)
          .map((sa) => [ sa.serviceType?.id, sa.serviceType ]),
      );
      return Array.from(uniqueServiceTypes.values());
    }
    return [];
  }, [ studentData ]);

  useEffect(() => {
    if (studentId && serviceTypes?.length === 1 && serviceTypes[0]) {
      setValue(`serviceTypeId`, serviceTypes[0]?.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ studentId, serviceTypes ]);

  useEffect(() => {
    if (studentId && (!billingDistrictId || billingDistrictId === -1) && billingDistrict?.id) {
      setValue(`billingDistrictId`, Number(billingDistrict?.id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ studentId, billingDistrict ]);

  const { data: districtNotes = [] } = useGetNotes(
    { districtId: billingDistrictId },
    noteTab === `district` && !!billingDistrictId,
  );

  const notes = noteTab === `student` ? studentNotes : districtNotes;
  const { lastSaved } = useAutoSave(methods, noteTab);

  const combinedOptions = useMemo(() => {
    const studentOptions = students.map((student) => ({
      id: student.id,
      label: `Student: ${student.firstName} ${student.lastName}`,
      type: `student` as const,
      value: `student-${student.id}`,
    }));
    const districtOptions = districts.map((district) => ({
      id: district.id,
      label: `District: ${district.name}`,
      type: `district` as const,
      value: `district-${district.id}`,
    }));
    return [ ...studentOptions, ...districtOptions ];
  }, [ students, districts ]);

  const handleCombinedSelection = (value: string) => {
    const [ type, id ] = value.split(`-`);
    const numericId = parseInt(id, 10);

    if (type === `student`) {
      setNoteTab(`student`);
      setValue(`noteType`, `student`);
      setValue(`studentId`, numericId);
      setValue(`serviceTypeId`, -1);
    } else if (type === `district`) {
      setNoteTab(`district`);
      setValue(`noteType`, `district`);
      setValue(`billingDistrictId`, numericId);
      setValue(`studentId`, -1);
      setValue(`serviceTypeId`, -1);
    }
  };

  const currentCombinedValue = useMemo(() => {
    if (noteTab === `student` && studentId && studentId > -1) {
      return `student-${studentId}`;
    }
    if (noteTab === `district` && billingDistrictId && billingDistrictId > -1) {
      return `district-${billingDistrictId}`;
    }
    return ``;
  }, [ noteTab, studentId, billingDistrictId ]);

  const onSubmit = (data: FormSchema) => {
    if (formState.isDirty && formState.isValid) {
      upsertNote({
        mode: noteTab,
        note: {
          ...data,
          submittedOn: new Date().toISOString(),
        },
      }, {
        onError: () => setAutoSaveStatus(`error`),
        onSuccess: () => {
          setAutoSaveStatus(`saved`);
          lastSaved.current = data;
        },
      });

      setTimeout(() => {
        submitNote({ ...data, id: noteId ?? ``, noteType: noteTab, submittedOn: new Date() });
        setNoteData({});
        reset();
        setAutoSaveStatus(`idle`);
      }, 1000);
    }
  };

  const handleNoteTypeChange = (newType: NoteType) => {
    setNoteTab(newType);
    setNoteData({ noteType: newType });
    if (newType === `student`) {
      reset({
        ...defaultsFor(`student`),
        noteType: `student`,
        serviceTypeId: undefined,
        studentId: undefined,
      });
    } else {
      reset({
        ...defaultsFor(`district`),
        noteType: `district`,
        serviceTypeId: undefined,
        studentId: undefined,
      });
    }
  };

  return <Page title="Create Note">
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mb-6 flex flex-col gap-6">
        <div className="h-1/3 flex-none">
          <Card className="flex h-full min-h-0 p-6">
            <div className="flex min-h-0 w-full flex-col gap-4 overflow-auto md:gap-4">
              <div className="flex w-full flex-row items-start justify-between gap-4">
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="max-w-sm flex-1 md:hidden">
                    <FormItem>
                      <FormLabel>
                        Select Student or District
                        <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={currentCombinedValue}
                          onValueChange={handleCombinedSelection}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Student or District" />
                          </SelectTrigger>
                          <SelectContent>
                            {combinedOptions.map((option) =>
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </div>
                  <div className="hidden max-w-sm flex-1 md:block">
                    {noteTab === `student` ?
                      <FormSelect
                        fieldValue="studentId"
                        formLabel="Student Assignee"
                        placeholderText="Select a Student"
                        options={students}
                        getOptionValue={(u) => String(u.id)}
                        getOptionLabel={(u) => `${u.firstName} ${u.lastName}`}
                        className="w-full"
                      /> :
                      <FormSelect
                        fieldValue="billingDistrictId"
                        formLabel="District Assignee"
                        placeholderText="Select a District"
                        options={districts}
                        getOptionValue={(d) => String(d.id)}
                        getOptionLabel={(d) => String(d.name)}
                        className="w-full"
                      />}
                  </div>
                  <div className="m-4 hidden md:block">
                    <NoteTypeToggle
                      value={noteTab}
                      onChange={handleNoteTypeChange}
                    />
                  </div>
                  {noteTab === `student` &&
                    <div className="hidden min-w-[130px] flex-col gap-2 rounded px-2 md:flex">
                      <FormLabel>Billing District</FormLabel>
                      <div className="text-[14px] leading-[20px] font-normal text-gray-500">
                        {billingDistrict ? billingDistrict.name : `—`}
                      </div>
                    </div>}
                  {noteTab === `student` &&
                    <div className="max-w-sm">
                      {serviceTypes.length > 1 ?
                        <FormSelect
                          fieldValue="serviceTypeId"
                          formLabel="Service Type"
                          placeholderText="Select a Service Type"
                          options={serviceTypes}
                          getOptionValue={(t) => String(t.id)}
                          getOptionLabel={(t) => `${t.name}`}
                        /> :
                        null}
                    </div>}
                </div>
                <AutoSaveStatus
                  status={autoSaveStatus}
                  lastSavedAt={lastSavedAt}
                  noteId={noteId}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 lg:grid-cols-4">
                <NoteDirectMinutes />
                <NoteIndirectMinutes />
                <NoteTravelMinutes />
              </div>
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4 md:gap-6">
                <NoteSessionDate />
                <NoteSelectedGoals />
                <div className="hidden items-center justify-end md:flex">
                  <Button
                    variant="default"
                    type="submit"
                    className="h-10 px-5 md:min-w-[130px]"
                  >
                    <Send size={18} />
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex flex-1 flex-col">
          <NoteTextField />
        </div>
        <div className="flex justify-center md:hidden">
          <Button
            variant="default"
            type="submit"
            className="h-12 w-full max-w-xs px-8 text-base"
          >
            <Send size={20} />
            Submit
          </Button>
        </div>
      </form>
      <div className="hidden md:block">
        <PreviousNotesCard notes={notes} />
      </div>
    </FormProvider>
  </Page>;
};

export default CreateNote;
