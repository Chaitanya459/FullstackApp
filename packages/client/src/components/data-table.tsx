import React, { useEffect, useState } from 'react';
import ResponsivePagination from 'react-responsive-pagination';
import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  GroupingState,
  PaginationState,
  Row,
  RowSelectionState,
  type Table as RTTable,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { MoveDown, MoveUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { buttonVariants } from '@/components/variants/buttonVariants';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface DataTableProps<TData, TValue> {
  className?: string;
  columns: Array<ColumnDef<TData, TValue>>;
  containerClassName?: string;
  data: TData[];
  dataProps?: { [key: string]: any };
  defaultGroupBy?: GroupingState;
  defaultPageSize?: number;
  filters?: { [columnsFilter: string]: string };
  getRowProps?: (row: Row<TData>) => { [key: string]: any };
  isLoading?: boolean;
  noItemsText?: React.ReactNode;
  onSelectionChange?: (selectedRows: Array<Row<TData>>) => void;
  paginate?: boolean;
  selectable?: boolean;
  sortable?: boolean;
  sortBy?: SortingState;
  startingPage?: number;
}

export const DataTable = <TData, TValue = any>({
  // misc
  className,
  columns,
  containerClassName,
  data,
  dataProps,
  defaultGroupBy = [],
  defaultPageSize = 15,
  filters,
  getRowProps,
  // Searching / UX
  isLoading = false,
  noItemsText = `No results.`,
  onSelectionChange,
  // Pagination
  paginate = true,
  // Selecting
  selectable = false,
  // Sorting
  sortable = true,
  sortBy = [],
  startingPage = 0,
}: DataTableProps<TData, TValue>) => {
  const [ sorting, setSorting ] = useState<SortingState>(sortBy ?? []);
  const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([]);
  const [ grouping, setGrouping ] = useState<GroupingState>(defaultGroupBy);
  const [ expanded, setExpanded ] = useState<ExpandedState>({});
  const [ rowSelection, setRowSelection ] = useState<RowSelectionState>({});
  const [ pagination, setPagination ] = useState<PaginationState>({
    pageIndex: startingPage,
    pageSize: defaultPageSize,
  });

  const selectionColumn = selectable ?
    {
      id: `selection`,
      cell: ({ row }: { row: Row<TData> }) =>
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onClick={row.getToggleSelectedHandler()}
        />,
      enableSorting: false,
      header: ({ table }: { table: RTTable<TData> }) =>
        <Checkbox
          checked={table.getIsAllRowsSelected() ? true : table.getIsSomeRowsSelected() ? `indeterminate` : false}
          onClick={table.getToggleAllRowsSelectedHandler()}
        />,
      size: 40,
    } :
    undefined;

  const cols: Array<ColumnDef<TData, TValue>> = selectionColumn ?
    ([ selectionColumn as unknown as ColumnDef<TData, TValue>, ...columns ] as Array<
      ColumnDef<TData, TValue>
    >) :
    columns;

  const table = useReactTable({
    autoResetExpanded: false,
    columns: cols,
    data,
    defaultColumn: {
      // @ts-expect-error TS is mad but this works
      size: `auto`,
    },
    enableRowSelection: selectable,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getPaginationRowModel: paginate ? getPaginationRowModel() : undefined,
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpanded,
    onGroupingChange: setGrouping,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      expanded,
      grouping,
      pagination,
      rowSelection,
      sorting,
    },
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: startingPage }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dataProps ]);

  useEffect(() => {
    if (!filters) {
      return;
    }
    for (const columnKey in filters) {
      table.getColumn(columnKey)?.setFilterValue(filters[columnKey]);
    }
  }, [ filters, table ]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(table.getSelectedRowModel().rows);
    }
  }, [ onSelectionChange, rowSelection, table ]);

  const pageCount = paginate ? table.getPageCount() : 0;
  const currentPage = table.getState().pagination?.pageIndex ?? 0;

  const wrapperClass = cn(
    `flex w-full flex-col`,
    className,
  );

  return <div className={wrapperClass}>
    <div className={cn(
      `w-full overflow-scroll`,
      containerClassName ?? `rounded-md border dark:border-gray-700`,
    )}
    >
      {!!defaultGroupBy.length &&
        <div className="p-2">
          <Button onClick={() => table.toggleAllRowsExpanded()}>
            {table.getIsAllRowsExpanded() ? `Collapse` : `Expand`} All
          </Button>
        </div>}
      <Table className="min-w-full table-auto">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) =>
            <TableRow key={headerGroup.id} className="bg-gray-50 dark:bg-gray-800">
              {headerGroup.headers.map((header) =>
                <TableHead
                  key={header.id}
                  className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : sortable && header.column.getCanSort() ?
                    <Button
                      variant="ghost"
                      onClick={header.column.getToggleSortingHandler()}
                      className="h-auto w-full p-0 font-medium text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span className="sort-arrows inline-flex items-center gap-0 whitespace-nowrap">
                        {{
                          asc: <>
                            <MoveUp className="h-3 w-3 text-gray-900" />
                            <MoveDown className="-ml-2 h-3 w-3 text-gray-400" />
                          </>,
                          desc: <>
                            <MoveUp className="h-3 w-3 text-gray-400" />
                            <MoveDown className="-ml-2 h-3 w-3 text-gray-900" />
                          </>,
                        }[header.column.getIsSorted() as string] ?? <>
                          <MoveUp className="h-3 w-3 text-gray-400" />
                          <MoveDown className="-ml-2 h-3 w-3 text-gray-400" />
                        </>}
                      </span>
                    </Button> :
                    <div className="h-auto w-full p-0 font-medium text-foreground">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>}
                </TableHead>)}
            </TableRow>)}
        </TableHeader>
        <TableBody>
          {isLoading ?
            <TableRow>
              <TableCell colSpan={table.getVisibleFlatColumns().length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow> :
            table.getRowModel().rows?.length ?
              table.getRowModel().rows.map((row, idx) =>
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && `selected`}
                  className={idx % 2 === 0 ? `bg-white dark:bg-gray-900` : `bg-gray-50 dark:bg-gray-800`}
                  {...(getRowProps ? getRowProps(row) : {})}
                >
                  {row.getVisibleCells().map((cell) =>
                    <TableCell key={cell.id} className="px-4 py-3 text-gray-900 dark:text-gray-100" style={{ width: `${cell.column.getSize()}px` }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>)}
                </TableRow>) :
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center dark:text-gray-400">
                  {noItemsText}
                </TableCell>
              </TableRow>}
        </TableBody>
      </Table>
    </div>

    {paginate &&
      <div className="mt-4 flex items-center justify-end gap-3">
        <div className="flex-1 text-sm text-gray-600" />
        <div className="flex items-center gap-2">
          <Pagination className="mx-0 justify-end">
            <PaginationContent>
              <PaginationItem>
                <ResponsivePagination
                  current={currentPage + 1}
                  total={pageCount}
                  onPageChange={(page) => table.setPageIndex(page - 1)}
                  className="flex gap-1"
                  pageItemClassName={buttonVariants({ size: `icon`, variant: `ghost` })}
                  activeItemClassName={buttonVariants({ size: `icon`, variant: `outline` })}
                  disabledItemClassName="opacity-50 pointer-events-none"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div>
            <Select value={`${pagination.pageSize}`} onValueChange={(v) => table.setPageSize(Number(v))}>
              <SelectTrigger className="flex h-8 w-[120px] items-center text-sm">
                <SelectValue placeholder={`Show ${defaultPageSize}`} />
              </SelectTrigger>
              <SelectContent>
                {[ 5, 15, 25, 35, 45, 55 ].map((s) =>
                  <SelectItem key={s} value={`${s}`}>
                    Show {s}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>}
  </div>;
};
