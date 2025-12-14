import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DatePicker } from '@/components/ui/date-picker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export const NoteSessionDate: React.FC = () => {
  const { control } = useFormContext();

  return <FormField
    control={control}
    name="serviceDate"
    render={({ field, fieldState }) =>
      <FormItem>
        <FormLabel>
          Session Date
          <span className="text-red-400">*</span>
        </FormLabel>
        <FormControl>
          <DatePicker
            value={field.value && typeof field.value == `string` ? new Date(field.value) : undefined}
            onChange={(d: Date | undefined) => {
              field.onChange(d ? d.toISOString() : ``);
            }}
            hasError={!!fieldState.error}
          />
        </FormControl>
        <FormMessage />
      </FormItem>}
  />;
};
