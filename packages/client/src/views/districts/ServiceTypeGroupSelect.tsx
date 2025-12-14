import React from 'react';
import { ServiceTypeGroupDTO } from 'rsd';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

interface Props {
  allEnabled?: boolean;
  className?: string;
  selectedServiceTypeId: string;
  serviceTypeGroups?: ServiceTypeGroupDTO[];
  setSelectedServiceTypeId: (id: string) => void;
}

export const ServiceTypeGroupSelect: React.FC<Props> = ({
  allEnabled = true,
  className,
  selectedServiceTypeId,
  serviceTypeGroups,
  setSelectedServiceTypeId,
}) =>
  <ToggleGroup
    type="single"
    value={selectedServiceTypeId}
    onValueChange={setSelectedServiceTypeId}
    aria-label="Service Type Group"
    className={cn(
      `ml-4 rounded-lg bg-muted px-2 py-1 shadow-sm dark:bg-gray-800`,
      className,
    )}
  >
    {allEnabled &&
      <ToggleGroupItem
        value="0"
        aria-label="All"
        className={cn(
          `px-2 py-2`,
          selectedServiceTypeId === `0` ?
            `rounded-sm !bg-gray-600 !text-white dark:!bg-gray-700` :
            `!text-foreground hover:bg-muted dark:!text-gray-200 dark:hover:bg-gray-700`,
        )}
      >
        All
      </ToggleGroupItem>}
    {serviceTypeGroups?.map((group) =>
      <ToggleGroupItem
        key={group.id}
        value={String(group.id)}
        aria-label={group.name}
        className={cn(
          `px-4 py-2`,
          selectedServiceTypeId === String(group.id) ?
            `rounded-sm !bg-gray-600 !text-white dark:!bg-gray-700` :
            `!text-foreground hover:bg-muted dark:!text-gray-200 dark:hover:bg-gray-700`,
        )}
      >
        {group.name}
      </ToggleGroupItem>)}
  </ToggleGroup>;
