import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const goals = [
  { id: `iep`, label: `IEP` },
  { id: `withdraw`, label: `Withdraw` },
  { id: `eval`, label: `Evaluation` },
];

export const NoteSelectedGoals: React.FC = () => {
  const { control } = useFormContext();

  return <FormField
    control={control}
    name="selectedGoals"
    render={({ field, fieldState }) =>
      <FormItem>
        <FormLabel>Note Goals</FormLabel>
        <FormControl>
          <ToggleGroup
            type="multiple"
            value={Array.isArray(field.value) ? field.value : []}
            onValueChange={field.onChange}
            className="flex flex-wrap items-center gap-1"
            aria-invalid={!!fieldState.error}
          >
            {goals.map((goal) =>
              <ToggleGroupItem
                key={goal.id}
                value={goal.id}
                className={
                  Array.isArray(field.value) && field.value.includes(goal.id) ?
                    // eslint-disable-next-line @stylistic/max-len
                    `border border-primary bg-primary px-3 text-primary-foreground hover:bg-primary/90 dark:border-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100` :
                    // eslint-disable-next-line @stylistic/max-len
                    `border border-input bg-transparent px-3 text-foreground hover:bg-accent hover:text-accent-foreground dark:border-gray-600 dark:hover:bg-gray-700`
                }
              >
                {goal.label}
              </ToggleGroupItem>)}
          </ToggleGroup>
        </FormControl>
        <FormMessage />
      </FormItem>}
  />;
};
