import React, { useCallback, useMemo, useState } from 'react';
import { CalendarDays, Download } from 'lucide-react';
import { format, parseISO, startOfDay } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { DistrictSummaryDTO } from 'rsd';
import { createColumnHelper, Row } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ServiceTypeGroupSelect } from './ServiceTypeGroupSelect';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Page } from '@/layout/page';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table';
import {
  useExportDistricts,
  useGetAcademicYears,
  useGetDistrictSummaryList,
  useGetServiceTypeGroups,
} from '@/services';

function getDefaultSchoolYearDates() {
  const now = new Date();
  const year = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const startDate = `${year}-08-01`;
  const endDate = `${year + 1}-07-31`;
  return { endDate, startDate, year: `${year}-${year + 1}` };
}

const { endDate: defaultEndDate, startDate: defaultStartDate, year: defaultYear } = getDefaultSchoolYearDates();

const DistrictList: React.FC = () => {
  const [ selectedYear, setSelectedYear ] = useState<string>(defaultYear);
  const [ startDate, setStartDate ] = useState<string>(defaultStartDate);
  const [ endDate, setEndDate ] = useState<string>(defaultEndDate);
  const [ selectedServiceTypeId, setSelectedServiceTypeId ] = useState<string>(`0`);
  const [ districtFilter, setDistrictFilter ] = useState(``);
  const [ startCalendarOpen, setStartCalendarOpen ] = useState(false);
  const [ endCalendarOpen, setEndCalendarOpen ] = useState(false);
  const [ selectedRows, setSelectedRows ] = useState<Array<Row<DistrictSummaryDTO>>>([]);

  const { data: serviceTypeGroups } = useGetServiceTypeGroups();
  const { data: academicYears } = useGetAcademicYears();
  const { data: districts, isLoading } = useGetDistrictSummaryList({
    endDate,
    serviceTypeGroupId: selectedServiceTypeId === `0` ? undefined : Number(selectedServiceTypeId),
    startDate,
  });
  const { isPending: isExporting, mutateAsync: exportDistricts } = useExportDistricts();

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date ? format(date, `yyyy-MM-dd`) : defaultStartDate);
    setStartCalendarOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date ? format(date, `yyyy-MM-dd`) : defaultEndDate);
    setEndCalendarOpen(false);
  };

  const handleYearChange = (yearName: string) => {
    setSelectedYear(yearName);
    const yearObj = academicYears?.find((y) => y.name === yearName);
    setStartDate(yearObj?.startDate ? format(startOfDay(yearObj.startDate), `yyyy-MM-dd`) : defaultStartDate);
    setEndDate(yearObj?.endDate ? format(startOfDay(yearObj.endDate), `yyyy-MM-dd`) : defaultEndDate);
  };

  const handleSelectionChange = useCallback((rows: Array<Row<DistrictSummaryDTO>>) => {
    setSelectedRows(rows);
  }, []);

  const handleExport = async () => {
    try {
      const districtIds = selectedRows.length > 0 ?
        selectedRows.map((row) => row.original.id) :
        [];
      await exportDistricts({
        districtIds,
        endDate,
        serviceTypeGroupId: selectedServiceTypeId === `0` ? undefined : Number(selectedServiceTypeId),
        startDate,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `An unexpected error occurred.`;
      toast(`Export failed`, {
        description: errorMessage,
      });
    }
  };

  if (!selectedYear && academicYears?.length) {
    const [ mostRecent ] = academicYears;
    setSelectedYear(mostRecent.name);
    setStartDate(
      mostRecent.startDate ?
        format(startOfDay(mostRecent.startDate), `yyyy-MM-dd`) :
        defaultStartDate,
    );
    setEndDate(mostRecent.endDate ? format(startOfDay(mostRecent.endDate), `yyyy-MM-dd`) : defaultEndDate);
  }

  const columnHelper = createColumnHelper<DistrictSummaryDTO>();

  const columns = useMemo(() => [
    columnHelper.accessor(`name`, {
      enableSorting: true,
      header: `District`,
    }),
    columnHelper.accessor(`activeStudents`, {
      header: `Active Students`,
    }),
    columnHelper.accessor(`assignedTherapistCount`, {
      cell: ({ getValue }) =>
        <span className="block text-center">{getValue() || `0`}</span>,
      header: `Assigned Therapists`,
    }),
    columnHelper.accessor(`fteUsed`, {
      cell: ({ getValue }) =>
        <span className="block text-center">{getValue() || `-`}</span>,
      header: `FTE Used`,
    }),
    columnHelper.accessor(`fteRequested`, {
      cell: ({ getValue }) =>
        <span className="block text-center">{getValue() || `-`}</span>,
      header: `FTE Requested`,
    }),
    columnHelper.accessor(`fteProjected`, {
      cell: ({ getValue }) =>
        <span className="block text-center">{getValue() || `-`}</span>,
      header: `FTE Projected`,
    }),
    columnHelper.accessor(`caseLoad`, {
      cell: ({ getValue }) =>
        <span className="block text-center">{getValue() || `-`}</span>,
      header: `Case Load`,
    }),
    columnHelper.accessor(`totalStudentServed`, {
      cell: ({ getValue }) =>
        <span className="block text-center">{getValue() || `-`}</span>,
      header: `Total Students Served`,
    }),
    columnHelper.accessor(`ytdCost`, {
      cell: ({ getValue }) =>
        <span className="block text-center">{getValue() || `-`}</span>,
      header: `YTD Cost`,
    }),
    columnHelper.accessor(`id`, {
      cell: ({ getValue }) =>
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            className="text-blue-600 hover:text-blue-700"
            asChild
          >
            <Link to={`/districts/${getValue()}`}>
              View
            </Link>
          </Button>
        </div>,
      enableSorting: false,
      header: `Actions`,
    }),
  ], [ columnHelper ]);

  return <Page>
    <div className="p-0">
      <div className="w-full">
        <div className="flex w-full flex-row items-end gap-6">
          <div className="flex flex-col">
            <div className="mb-2 text-sm font-medium text-muted-foreground">Academic Year</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-center rounded-sm bg-muted text-base text-foreground hover:bg-muted/80 dark:hover:bg-gray-700"
                >
                  {selectedYear}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {academicYears?.map((year) =>
                  <DropdownMenuItem
                    key={year.name}
                    onClick={() => handleYearChange(year.name)}
                  >
                    {year.name}
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col">
            <div className="mb-2 text-sm font-medium text-muted-foreground">Start Date</div>
            <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="start-date-picker"
                  variant="outline"
                  className="justify-center p-0 text-center font-normal"
                >
                  {startDate ? format(startOfDay(parseISO(startDate)), `M/d/yyyy`) : <span>Pick a Date</span>}
                  <CalendarDays className="!h-5 !w-5" strokeWidth={2} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate ? startOfDay(parseISO(startDate)) : undefined}
                  defaultMonth={startDate ? startOfDay(parseISO(startDate)) : undefined}
                  captionLayout="dropdown"
                  onSelect={handleStartDateSelect}
                  disabled={(date) => endDate ? date > startOfDay(parseISO(endDate)) : false}
                  endMonth={new Date(new Date().getFullYear() + 2, 0)}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col">
            <div className="mb-2 text-sm font-medium text-muted-foreground">End Date</div>
            <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="end-date-picker"
                  variant="outline"
                  className="justify-center p-0 text-center font-normal"
                >
                  {endDate ? format(startOfDay(parseISO(endDate)), `M/d/yyyy`) : <span>Pick a Date</span>}
                  <CalendarDays className="!h-5 !w-5" strokeWidth={2} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate ? startOfDay(parseISO(endDate)) : undefined}
                  captionLayout="dropdown"
                  defaultMonth={endDate ? startOfDay(parseISO(endDate)) : undefined}
                  onSelect={handleEndDateSelect}
                  disabled={(date) => startDate ? date < startOfDay(parseISO(startDate)) : false}
                  endMonth={new Date(new Date().getFullYear() + 2, 0)}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button className="ml-auto hidden w-auto bg-gray-600 text-white hover:bg-blue-700">
            + New School District
          </Button>
        </div>
        <div className="mt-4 flex w-full flex-row items-center justify-between gap-4">
          <div className="flex w-full flex-row items-center gap-4">
            <Input
              id="district-search"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              placeholder="Filter Districts..."
              className="w-55"
            />
            <ServiceTypeGroupSelect
              selectedServiceTypeId={selectedServiceTypeId}
              serviceTypeGroups={serviceTypeGroups}
              setSelectedServiceTypeId={setSelectedServiceTypeId}
            />
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="ml-auto bg-gray-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? `Exporting...` : selectedRows.length > 0 ? `Export Selected` : `Export`}
          </Button>
        </div>
        <div className="mt-5 w-full">
          <DataTable<DistrictSummaryDTO>
            isLoading={isLoading}
            sortable
            noItemsText="No Districts Found"
            selectable
            sortBy={[{ id: `name`, desc: false }]}
            columns={columns}
            data={districts || []}
            filters={{ name: districtFilter }}
            onSelectionChange={handleSelectionChange}
          />
        </div>
      </div>
    </div>
  </Page>;
};

export default DistrictList;
