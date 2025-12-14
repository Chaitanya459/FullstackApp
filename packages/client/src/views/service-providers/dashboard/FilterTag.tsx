import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FilterTagProps {
  active?: boolean;
  count?: number;
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  selectable?: boolean;
}

export const FilterTag: React.FC<FilterTagProps> = ({
  active = false,
  count,
  icon,
  label,
  onClick,
  selectable = true,
}) =>
  <Button
    variant="ghost"
    onClick={selectable ? onClick : undefined}
    className={cn(
      `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors`,
      {
        'bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white': active,
        'cursor-default text-gray-500 dark:text-gray-500': !active && !selectable,
        // eslint-disable-next-line @stylistic/max-len
        'cursor-pointer text-gray-600 hover:bg-white hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white': !active && selectable,
      },
    )}
  >
    {icon}
    {label}
    {count !== undefined &&
      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
        ({count})
      </span>}
  </Button>;
