import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export const NoteTravelMinutes: React.FC = () => {
  const { control } = useFormContext();

  return <FormField
    control={control}
    name="travelMinutes"
    render={({ field, fieldState }) =>
      <FormItem>
        <FormLabel>Travel Minutes</FormLabel>
        <FormControl>
          <Input
            type="number"
            value={field.value ?? 0}
            onChange={(e) => {
              const val = e.target.value;
              field.onChange(val === `` ? 0 : Number(val));
            }}
            aria-invalid={!!fieldState.error}
          />
        </FormControl>
        <FormMessage />
      </FormItem>}
  />;
};
