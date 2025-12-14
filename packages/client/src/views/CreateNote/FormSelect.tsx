import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormSelectProps {
  className?: string;
  fieldValue: string;
  formLabel: string;
  getOptionLabel: (option: any) => React.ReactNode;
  getOptionValue: (option: any) => string;
  options: any[];
  placeholderText: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  className = `w-[220px]`,
  fieldValue,
  formLabel,
  getOptionLabel,
  getOptionValue,
  options,
  placeholderText,
}) => {
  const methods = useFormContext();

  return <FormField
    control={methods.control}
    name={fieldValue}
    render={({ field }) =>
      <FormItem>
        <FormLabel>
          {formLabel}
          <span className="text-red-400">*</span>
        </FormLabel>
        <Select
          value={field.value == null ? `` : String(field.value)}
          onValueChange={(val) => field.onChange(val ? Number(val) : -1)}
          defaultValue={field.value == null ? `` : String(field.value)}
        >
          <FormControl>
            <SelectTrigger className={className}>
              <SelectValue placeholder={placeholderText} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) =>
              <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                {getOptionLabel(option)}
              </SelectItem>)}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>}
  />;
};
