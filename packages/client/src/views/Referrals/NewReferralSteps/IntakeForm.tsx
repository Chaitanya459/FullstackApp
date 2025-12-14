import { zodResolver } from '@hookform/resolvers/zod';
import isEqual from 'lodash/isEqual';
import { ErrorMessage } from '@hookform/error-message';
import { useDebounceCallback } from '@react-hook/debounce';
import phone from 'phone';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, Resolver, useForm, useWatch } from 'react-hook-form';
import { ReferralDTO } from 'rsd';
import { z } from 'zod';
import { Boxes, Building, CalendarIcon, GraduationCap, Send } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  useGetDistricts,
  useGetGenders,
  useGetGradeLevels,
  useGetStates,
  useSubmitReferral,
  useUpsertReferral,
} from '@/services';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formatDate = (date: Date | undefined) => {
  if (!date) {
    return ``;
  }

  return date.toLocaleDateString(`en-US`, {
    day: `2-digit`,
    month: `long`,
    year: `numeric`,
  });
};

const isValidDate = (date: Date | undefined): boolean => {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
};

const referralSchema = z.object({
  id: z.coerce.number().optional(),
  billingDistrictId: z.coerce.number().min(1, `This field is required`),
  buildingAttending: z.string().min(1, `This field is required`),
  city: z.string().min(1, `City is required`),
  completedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  districtOfResidenceId: z.coerce.number().min(1, `This field is required`),
  districtOfServiceId: z.coerce.number().min(1, `This field is required`),
  districtRepresentativeName: z.string().min(1, `This field is required`),
  email: z.string().email(`Invalid email address`),
  genderId: z.coerce.number().min(1, `Gender is required`),
  gradeLevelId: z.coerce.number().min(1, `This field is required`),
  parentGuardianName: z.string().min(1, `Parent/Guardian name is required`),
  parentGuardianPhoneNumber: z.string().min(1, `Phone number is required`).refine(
    (val) => phone(val).isValid,
    { message: `Phone number must be valid` },
  ),
  personRequestingService: z.string().min(1, `This field is required`),
  phoneNumber: z.string().min(1, `Phone number is required`).refine(
    (val) => phone(val).isValid,
    { message: `Phone number must be valid` },
  ),
  stateId: z.coerce.number().min(1, `State is required`),
  studentDateOfBirth: z.coerce.date(),
  studentName: z.string().min(1, `Student name is required`),
  zipCode: z.string().min(5, `Zip code is required`).regex(/^[0-9]{5}$/, `Zip code must be 5 digits`),
});

interface IntakeFormProps {
  onSubmit: () => void;
  referralData?: Partial<ReferralDTO>;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ onSubmit, referralData }) => {
  const { control, formState: { errors }, handleSubmit, setValue } = useForm<z.infer<typeof referralSchema>>({
    mode: `onSubmit`,
    resolver: zodResolver(referralSchema) as Resolver<z.infer<typeof referralSchema>, any>,
  });

  useEffect(() => {
    if (referralData) {
      Object.entries(referralData).forEach(([ key, value ]) => {
        if (key !== `referralServiceTypes` &&
            (typeof value === `string` || typeof value === `number` || value instanceof Date || value === undefined)) {
          setValue(key as keyof z.infer<typeof referralSchema>, value as string | number | Date | undefined);
        }
      });
    }
  }, [ referralData, setValue ]);

  const [ submitError, setSubmitError ] = useState<string | null>(null);
  const [ open, setOpen ] = useState(false);
  const [ date, setDate ] = useState<Date | undefined>(new Date());
  const [ month, setMonth ] = useState<Date | undefined>(date);

  const { data: districtOptions = [] } = useGetDistricts();
  const { data: gradeLevelOptions = [] } = useGetGradeLevels();
  const { data: genderOptions = [] } = useGetGenders();
  const { data: stateOptions = [] } = useGetStates();
  const upsertReferral = useUpsertReferral();
  const submitReferral = useSubmitReferral();

  const values = useWatch({ control });

  const lastSavedRef = useRef<ReferralDTO | null>(null);

  const debouncedAutosave = useDebounceCallback(async () => {
    const response = await upsertReferral.mutateAsync(values);
    if (response && response.id) {
      setValue(`id`, response.id);
    }
  }, 1000);

  useEffect(() => {
    if (values.studentName && values.email) {
      const current = values as ReferralDTO;
      const last = lastSavedRef.current;
      if (!last || !isEqual(last, current)) {
        debouncedAutosave();
        lastSavedRef.current = current;
      }
    }
  }, [ values, debouncedAutosave ]);

  const requiredKeys = Object.keys(referralSchema.shape).filter((key) => {
    if (key === `id`) {
      return false;
    }

    const fieldSchema = (referralSchema.shape as Record<string, unknown>)[key] as {
      isNullable?: () => boolean;
      isOptional?: () => boolean;
    };

    return !(
      typeof fieldSchema.isOptional === `function` && fieldSchema.isOptional?.()
    ) &&
        !(
          typeof fieldSchema.isNullable === `function` && fieldSchema.isNullable?.()
        );
  });

  const filledCount = requiredKeys.filter((field) => {
    const fieldValue = (values as Record<string, any>)?.[field];

    return fieldValue !== undefined && fieldValue !== `` && fieldValue !== null;
  }).length;

  const progress = Math.round((filledCount / requiredKeys.length) * 100);

  const handleFormSubmit = (referral: ReferralDTO) => {
    setSubmitError(null);

    const referralId = referral.id !== undefined && referral.id !== null ? String(referral.id) : ``;

    submitReferral.mutate(referralId, {
      onError: (error) => {
        setSubmitError(error.message || `Failed to submit referral`);
      },
      onSuccess: () => {
        onSubmit();
      },
    });
  };

  return <div>
    <div className="mb-8 px-5 pb-4">
      {Object.entries(errors).map(([ key, error ]) =>
        key !== `root` && error?.message ?
          <Alert key={key} variant="destructive" className="mb-4">
            <AlertTitle>{key}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert> :
          null)}
      {submitError &&
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>}
      <div className="mt-8 text-center">
        <div className="sticky top-0 z-20 rounded-b-full bg-background pt-8 pb-2 shadow-lg">
          <div className="mx-auto mb-5 max-w-[1500px] justify-center">
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium text-foreground">
                Please complete
                {` `}
                <strong>ALL</strong>
                {` `}
                sections of the form
              </span>
              <span className="text-sm font-medium text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 w-full rounded-full" />
          </div>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-full space-y-4">
          <Card className="border-black-300 mx-auto my-[20px] max-w-[1500px] space-y-6 rounded-lg p-[30px] shadow-[0_0_20px_rgba(0,0,0,0.1)]">
            <div>
              <div className="flex items-center space-x-2">
                <Boxes />
                <h2 className="text-left text-xl font-bold">Service</h2>
              </div>
              <p className="text-left text-sm text-gray-500">
                <small>Select the services you want</small>
              </p>
            </div>
            <div className="flex space-y-2 space-x-[100px]">
              <div className="w-2/5">
                <Label htmlFor="studentName" className="mb-4 block text-left">Name of Student</Label>
                <Controller
                  name="studentName"
                  control={control}
                  render={({ field }) => <Input {...field} id="studentName" value={field.value ?? ``} />}
                />
                <ErrorMessage
                  errors={errors}
                  name="studentName"
                  render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                />
              </div>
              <div className="mb-6 w-2/5">
                <Label htmlFor="email" className="mb-4 block text-left">Email Address</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Please enter your email address"
                    />}
                />
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                />
              </div>
            </div>
          </Card>
          <Card className="border-black-300 mx-auto my-[20px] max-w-[1500px] space-y-4 rounded-lg p-[30px] shadow-[0_0_20px_rgba(0,0,0,0.1)]">
            <div className="mb-6 flex items-center space-x-2">
              <Building />
              <h2 className="text-left text-xl font-bold">District Information</h2>
            </div>
            <div className="mb-0 flex space-x-[100px]">
              <div className="w-2/5">
                <Label htmlFor="personRequestingService" className="mb-4 block text-left">Person(s) Requesting Service(s)</Label>
                <Controller
                  name="personRequestingService"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      id="personRequestingService"
                      value={field.value ?? ``}
                    />}
                />
                <ErrorMessage
                  errors={errors}
                  name="personRequestingService"
                  render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                />
              </div>
              <div className="mb-6 w-2/5">
                <Label htmlFor="phoneNumber" className="mb-4 block text-left">Phone Number</Label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      id="phoneNumber"
                      placeholder="(123) 456-7890"
                    />}
                />
                <ErrorMessage
                  errors={errors}
                  name="phoneNumber"
                  render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                />
              </div>
            </div>
            <div className="mb-0 flex space-x-[100px]">
              <div className="w-2/5">
                <Label htmlFor="districtOfServiceId" className="mb-4 block text-left">District of Service</Label>
                <Controller
                  name="districtOfServiceId"
                  control={control}
                  render={({ field }) =>
                    <div>
                      <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value ?? ``)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a district" className="w-full" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(districtOptions) && districtOptions.map((opt) =>
                            <SelectItem key={opt.id} value={String(opt.id)}>
                              {opt.name}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        errors={errors}
                        name="districtOfServiceId"
                        render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                      />
                    </div>}
                />
              </div>
              <div className="mb-6 w-2/5">
                <Label htmlFor="districtRepresentativeName" className="mb-4 block text-left">District Representative Name</Label>
                <Controller
                  name="districtRepresentativeName"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      id="districtRepresentativeName"
                      value={field.value ?? ``}
                    />}
                />
                <ErrorMessage
                  errors={errors}
                  name="districtRepresentativeName"
                  render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                />
              </div>
            </div>
            <div className="mb-0 flex space-x-[100px]">
              <div className="mb-6 w-2/5">
                <Label htmlFor="districtOfResidenceId" className="mb-4 block text-left">District of Residence</Label>
                <Controller
                  name="districtOfResidenceId"
                  control={control}
                  render={({ field }) =>
                    <div>
                      <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value ?? ``)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a district" className="w-full" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(districtOptions) && districtOptions.map((opt) =>
                            <SelectItem key={opt.id} value={String(opt.id)}>
                              {opt.name}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        errors={errors}
                        name="districtOfResidenceId"
                        render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                      />
                    </div>}
                />
              </div>
              <div className="w-2/5">
                <Label htmlFor="buildingAttending" className="mb-4 block text-left">Building Attending</Label>
                <Controller
                  name="buildingAttending"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      id="buildingAttending"
                      value={field.value ?? ``}
                    />}
                />
                <ErrorMessage
                  errors={errors}
                  name="buildingAttending"
                  render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                />
              </div>
            </div>
            <div className="mb-0 flex space-x-[100px]">
              <div className="mb-6 w-2/5">
                <Label htmlFor="billingDistrictId" className="mb-4 block text-left">Billing District</Label>
                <Controller
                  name="billingDistrictId"
                  control={control}
                  render={({ field }) =>
                    <div>
                      <Select
                        value={String(field.value ?? ``)}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a district" className="w-full" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(districtOptions) && districtOptions.map((opt) =>
                            <SelectItem key={opt.id} value={String(opt.id)}>
                              {opt.name}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        errors={errors}
                        name="billingDistrictId"
                        render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                      />
                    </div>}
                />
              </div>
            </div>
          </Card>
          <Card className="border-black-300 mx-auto my-[20px] max-w-[1500px] space-y-4 rounded-lg p-[30px] shadow-[0_0_20px_rgba(0,0,0,0.1)]">
            <div className="flex items-center space-x-2">
              <GraduationCap />
              <h2 className="text-left text-xl font-bold">Student Information</h2>
            </div>
            <div className="mb-0 flex space-x-[100px]">
              <div className="mb-6 w-2/5">
                <Label htmlFor="gradeLevelId" className="mb-4 block text-left">Grade</Label>
                <Controller
                  name="gradeLevelId"
                  control={control}
                  render={({ field }) =>
                    <div>
                      <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value ?? ``)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a grade" className="w-full" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(gradeLevelOptions) && gradeLevelOptions.map((opt) =>
                            <SelectItem key={opt.id} value={String(opt.id)}>
                              {opt.name}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        errors={errors}
                        name="gradeLevelId"
                        render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                      />
                    </div>}
                />
              </div>
            </div>
            <div className="flex space-x-[100px]">
              <div className="w-2/5">
                <Label htmlFor="studentDateOfBirth" className="mb-4 block text-left">Date of Birth</Label>
                <Controller
                  name="studentDateOfBirth"
                  control={control}
                  render={({ field }) =>
                    <div className="relative flex gap-2">
                      <Input
                        id="studentDateOfBirth"
                        value={field.value ? formatDate(new Date(field.value)) : ``}
                        placeholder="Select date"
                        className="bg-background pr-10"
                        onChange={(e) => {
                          const inputDate = new Date(e.target.value);
                          if (isValidDate(inputDate)) {
                            field.onChange(inputDate.toISOString());
                            setDate(inputDate);
                            setMonth(inputDate);
                          } else {
                            field.onChange(``);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === `ArrowDown`) {
                            e.preventDefault();
                            setOpen(true);
                          }
                        }}
                      />
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            id="studentDateOfBirth"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                          >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Select date</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="overflow-hidden p-4"
                          align="end"
                          alignOffset={-8}
                          sideOffset={10}
                        >
                          <Calendar
                            className="w-full"
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(selectedDate) => {
                              if (isValidDate(selectedDate)) {
                                if (selectedDate) {
                                  field.onChange(selectedDate.toISOString());
                                  setDate(selectedDate);
                                  setMonth(selectedDate);
                                } else {
                                  field.onChange(``);
                                }
                              } else {
                                field.onChange(``);
                              }
                              setOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>}
                />
                <ErrorMessage
                  errors={errors}
                  name="studentDateOfBirth"
                  render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                />
              </div>
              <div className="w-2/5">
                <Label htmlFor="genderId" className="mb-4 block text-left">Gender</Label>
                <Controller
                  name="genderId"
                  control={control}
                  render={({ field }) =>
                    <div>
                      <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value ?? ``)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" className="w-full" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(genderOptions) && genderOptions.map((opt) =>
                            <SelectItem key={opt.id} value={String(opt.id)}>
                              {opt.name}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        errors={errors}
                        name="genderId"
                        render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                      />
                    </div>}
                />
              </div>
            </div>
            <h2 className="mb-0 text-left text-lg font-semibold">Home Address</h2>
            <div className="flex space-x-[100px]">
              <div className="w-2/5">
                <Label htmlFor="city" className="mb-4 block text-left">City</Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      id="city"
                      value={field.value ?? ``}
                    />}
                />
                <ErrorMessage
                  errors={errors}
                  name="city"
                  render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                />
              </div>
              <div className="w-1/6">
                <Label htmlFor="zipCode" className="mb-4 block text-left">Zip Code</Label>
                <Controller
                  name="zipCode"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      id="zipCode"
                      maxLength={5}
                    />}
                />
                <ErrorMessage
                  errors={errors}
                  name="zipCode"
                  render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                />
              </div>
            </div>
            <div className="flex space-x-[100px]">
              <div className="w-2/5 !overflow-visible">
                <Label htmlFor="stateId" className="mb-4 text-left">State</Label>
                <Controller
                  name="stateId"
                  control={control}
                  render={({ field }) =>
                    <div>
                      <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value ?? ``)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" className="w-full" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(stateOptions) && stateOptions.map((opt) =>
                            <SelectItem key={opt.id} value={String(opt.id)}>
                              {opt.name}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        errors={errors}
                        name="stateId"
                        render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                      />
                    </div>}
                />
              </div>
            </div>
            <div className="mb-2 flex space-x-[100px]">
              <div className="mb-6 w-2/5">
                <Label htmlFor="parentGuardianName" className="mb-4 block text-left">Parent / Guardian Name</Label>
                <Controller
                  name="parentGuardianName"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      id="parentGuardianName"
                      value={field.value ?? ``}
                    />}
                />
                <ErrorMessage
                  errors={errors}
                  name="parentGuardianName"
                  render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                />
              </div>
              <div className="w-2/5">
                <Label htmlFor="parentGuardianPhoneNumber" className="mb-4 block text-left">Parent / Guardian Phone Number</Label>
                <Controller
                  name="parentGuardianPhoneNumber"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      id="parentGuardianPhoneNumber"
                      placeholder="(123) 456-7890"
                    />}
                />
                <ErrorMessage
                  errors={errors}
                  name="parentGuardianPhoneNumber"
                  render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                />
              </div>
            </div>
            <Button type="submit" className="mb-6 flex w-3/8 rounded-lg border-2 border-blue-500 bg-blue-50 px-4 py-6 text-lg text-blue-700 shadow-xl hover:bg-blue-100 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900">
              <Send size={25} className="mr-2" />
              Submit
            </Button>
          </Card>
        </form>
      </div>
    </div>
  </div>;
};
