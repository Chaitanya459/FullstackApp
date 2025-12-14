import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  disabled?: boolean;
  hasError?: boolean;
  onChange?: (d: Date | undefined) => void;
  placeholder?: string;
  value?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  disabled,
  hasError,
  onChange,
  placeholder = `Pick a date`,
  value,
}) => {
  const [ internal, setInternal ] = React.useState<Date | undefined>(value);
  const [ open, setOpen ] = React.useState(false);

  React.useEffect(() => {
    if (value?.getTime() !== internal?.getTime()) {
      setInternal(value);
    }
  }, [ value, internal ]);

  const selected = value ?? internal;

  const handleSelect = (d?: Date) => {
    setInternal(d);
    onChange?.(d);
    setOpen(false);
  };

  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        type="button"
        variant="outline"
        data-empty={!selected}
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={cn(
          `w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground`,
          { 'border-destructive ring-destructive/20 dark:ring-destructive/40 ring-[3px]': hasError },
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {selected ? format(selected, `PPP`) : <span>{placeholder}</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        initialFocus
      />
    </PopoverContent>
  </Popover>;
};
