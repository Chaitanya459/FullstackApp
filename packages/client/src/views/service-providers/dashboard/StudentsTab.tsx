import React from 'react';
import { Printer, Users } from 'lucide-react';
import { StudentsTable } from './StudentsTable';
import { FilterTag } from './FilterTag';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StudentsTabProps {
  activeFilter: string;
  filterQuery: string;
  handleFilterChange: (filter: string) => void;
  noVisit90Days: number;
  setFilterQuery: (value: string) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  activeFilter,
  filterQuery,
  handleFilterChange,
  noVisit90Days,
  setFilterQuery,
}) => <>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        <Input
          placeholder="Filter"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-48 border-0 bg-white shadow-none focus-visible:ring-0 dark:bg-gray-700"
        />
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
        <FilterTag
          label="Active Students"
          icon={<Users className="h-4 w-4 text-green-600 dark:text-green-400" />}
          active={activeFilter === `active`}
          onClick={() => handleFilterChange(`active`)}
          selectable
        />
        <FilterTag
          label="No visit in 90 Days"
          count={noVisit90Days}
          icon={<div className="flex h-4 w-4 items-center justify-center rounded-full border border-red-500 bg-white text-red-500 dark:border-red-400 dark:bg-gray-800 dark:text-red-400">
            <span className="text-xs font-bold">!</span>
          </div>}
          active={activeFilter === `no-visit`}
          onClick={() => handleFilterChange(`no-visit`)}
          selectable
        />
        <FilterTag
          label="All"
          active={activeFilter === `all`}
          onClick={() => handleFilterChange(`all`)}
          selectable
        />
      </div>
    </div>
    <Button
      variant="outline"
      size="sm"
    >
      <Printer className="mr-2 h-4 w-4" />
      Print Caseload
    </Button>
  </div>

  <StudentsTable filterQuery={filterQuery} activeFilter={activeFilter} />
</>;
