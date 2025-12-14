import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

type Mode = `scrollable` | `line`;

export interface ProfileTab<T extends string = string> {
  content?: React.ReactNode | null;
  label: string;
  value: T;
}

interface ProfileTabsProps<T extends string = string> {
  defaultValue?: T;
  disableOthers?: boolean;
  mode?: Mode;
  onValueChange?: (value: T) => void;
  rightSlot?: React.ReactNode;
  tabs: ReadonlyArray<ProfileTab<T>>;
  value?: T;
}

export const ProfileTabs = <T extends string>({
  defaultValue,
  disableOthers = true,
  mode = `scrollable`,
  onValueChange,
  rightSlot,
  tabs,
  value,
}: ProfileTabsProps<T>) => {
  if (mode === `line`) {
    return <div className="relative">
      {rightSlot ? <div className="absolute top-1 right-0">{rightSlot}</div> : null}
      <Separator />
    </div>;
  }

  return <div className="relative">
    {rightSlot ? <div className="absolute top-1.5 right-0">{rightSlot}</div> : null}
    <Tabs value={value} defaultValue={defaultValue} onValueChange={onValueChange as (value: string) => void}>
      <ScrollArea className="w-full">
        <TabsList className="h-9 w-max gap-6 border-b bg-transparent p-2">
          {tabs.map((t) =>
            <TabsTrigger
              key={t.value}
              value={t.value}
              disabled={disableOthers && t.value !== (value ?? defaultValue)}
              className="relative rounded-none bg-transparent px-0 text-sm font-medium text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-[-1px] data-[state=active]:after:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-primary data-[state=active]:after:content-['']"
            >
              {t.label}
            </TabsTrigger>)}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="p-3">
        {tabs.map((t) => <TabsContent key={t.value} value={t.value}>
          {t.content}
        </TabsContent>)}
      </div>
    </Tabs>
  </div>;
};
