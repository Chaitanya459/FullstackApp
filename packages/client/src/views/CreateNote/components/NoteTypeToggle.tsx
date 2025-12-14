import React from 'react';
import { Building, User } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

type NoteType = `student` | `district`;

interface NoteTypeToggleProps {
  onChange: (value: NoteType) => void;
  value: NoteType;
}

export const NoteTypeToggle: React.FC<NoteTypeToggleProps> = ({ onChange, value }) => {
  const handleChange = (v: string) => {
    if (!v || v === value) {
      return;
    }
    onChange(v as NoteType);
  };

  const getItemClassName = (itemValue: NoteType) => cn(
    `px-4 py-2`, {
      '!text-foreground hover:bg-muted dark:hover:bg-gray-700': value !== itemValue,
      'rounded-sm !bg-gray-600 !text-white dark:!bg-gray-700': value === itemValue,
    },
  );

  return <ToggleGroup
    type="single"
    value={value}
    onValueChange={handleChange}
    className="h-fit rounded-lg bg-muted px-2 py-1 shadow-sm dark:bg-gray-800"
    aria-label="Note Type"
  >
    <ToggleGroupItem value="student" aria-label="Student" className={getItemClassName(`student`)}>
      <User />
      Student
    </ToggleGroupItem>
    <ToggleGroupItem value="district" aria-label="District" className={getItemClassName(`district`)}>
      <Building />
      District
    </ToggleGroupItem>
  </ToggleGroup>;
};
