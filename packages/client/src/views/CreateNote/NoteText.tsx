import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RichTextEditor } from '@/components/richTextEditor';

export const NoteTextField = () => {
  const { control } = useFormContext();
  return <FormField
    control={control}
    name="caseNotes"
    render={({ field, fieldState }) => <FormItem>
      <FormLabel>
        Case Notes
        <span className="text-red-400">*</span>
      </FormLabel>
      <FormControl>
        <RichTextEditor
          id="create-note"
          value={field.value ?? ``}
          onChange={field.onChange}
          height={310}
          aria-invalid={!!fieldState.error}
        />
      </FormControl>
      <FormMessage />
    </FormItem>}
  />;
};
