"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, GripVertical, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { PiKnifeFill } from "react-icons/pi";
import { TbFilter, TbFilterX } from "react-icons/tb";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ActionButton from "./ActionButton";
import TableBodySkeleton from "./TableBodySkeleton";

type WithId<T> = T & { _id: string | { toString(): string } };
export type FilterOption = { label: string; value: string };

export type FilterConfig = {
  key: string;
  label: string;
  options: FilterOption[];
};

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant='ghost'
      size='icon'
      className='text-muted-foreground size-7 cursor-grabbing hover:bg-transparent'
    >
      <GripVertical className='text-muted-foreground size-3' />
      <span className='sr-only'>Drag to reorder</span>
    </Button>
  );
}

function DraggableRow<T>({ row, draggable }: { row: Row<WithId<T>>; draggable: boolean }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original._id.toString()
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition
      }}
    >
      {draggable && (
        <TableCell>
          <DragHandle id={row.original._id.toString()} />
        </TableCell>
      )}
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  );
}

export default function DataTable<T>({
  data: initialData,
  columns,
  pagination: showPagination = true,
  searchable = false,
  searchPlaceholder = "Search...",
  onSortEnd,
  total = 0,
  isLoading,
  filters = [],
  noFoundMessage = "No data found!"
}: {
  data: WithId<T>[];
  columns: ColumnDef<WithId<T>>[];
  pagination?: boolean;
  filters?: FilterConfig[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSortEnd?: (sortedIds: string[]) => Promise<any>;
  total?: number;
  isLoading?: boolean;
  noFoundMessage?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const getFilterValues = () => {
    const values: Record<string, string> = {};
    filters.forEach(({ key }) => {
      values[key] = searchParams.get(key) || "";
    });
    return values;
  };

  const [filterValues, setFilterValues] = useState<Record<string, string>>(getFilterValues);

  useEffect(() => {
    setFilterValues(getFilterValues());
  }, [searchParams]);
  // Change handleFilterChange to strip the sentinel:
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const realValue = value === "__all__" ? "" : value;
    if (realValue) {
      params.set(key, realValue);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentLimit = Number(searchParams.get("limit")) || 10;
  const currentSearch = searchParams.get("search") || "";

  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchValue, setSearchValue] = useState(currentSearch);
  const sortableId = useId();
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));
  const dataIds = useMemo<UniqueIdentifier[]>(() => data?.map(({ _id }) => _id.toString()) || [], [data]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Sync search input with URL
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  // Handle scroll for fade effect
  const handleScroll = () => {
    if (scrollRef.current) {
      // const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // const bottomOffset = 50;
      // setIsAtBottom(scrollTop + clientHeight >= scrollHeight - bottomOffset);
    }
  };

  const totalPages = Math.ceil(total / currentLimit);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting
    },
    getRowId: row => row._id.toString(),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(), // <-- ADD THIS
    manualPagination: true,
    pageCount: totalPages
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    let newData: WithId<T>[] = [];
    if (active && over && active.id !== over.id) {
      setData(data => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        newData = arrayMove(data, oldIndex, newIndex);
        return newData;
      });

      if (onSortEnd) {
        const sortedIds = newData.map(item => item._id.toString());
        onSortEnd(sortedIds).catch((error: any) => {
          toast.error("Failed to save sort order:", error?.message);
        });
      }
    }
  }

  const draggable = !!onSortEnd;

  const updateURL = (newParams: { page?: number; limit?: number; search?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newParams.page !== undefined) {
      params.set("page", newParams.page.toString());
    }

    if (newParams.limit !== undefined) {
      params.set("limit", newParams.limit.toString());
      // Reset to page 1 when limit changes
      params.set("page", "1");
    }

    if (newParams.search !== undefined) {
      if (newParams.search) {
        params.set("search", newParams.search);
      } else {
        params.delete("search");
      }
      // Reset to page 1 when search changes
      params.set("page", "1");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage });
    // Scroll to top of table when page changes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const handleLimitChange = (newLimit: string) => {
    updateURL({ limit: Number(newLimit) });
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      updateURL({ search: searchValue.trim() });
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateURL({ search: "" });
  };

  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;
  const [isFilterOpen, setIsFilterOpen] = useState(() => Object.values(getFilterValues()).some(Boolean));

  return (
    <div className='relative flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          {searchable && (
            <form onSubmit={handleSearchSubmit} className='flex flex-1 items-center gap-2 lg:max-w-max'>
              <div className='relative max-w-md flex-1 lg:w-80'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={e => handleSearch(e.target.value)}
                  className={`bg-background border-primary pr-9 pl-9 text-white!`}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    {searchValue && (
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        className='absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 hover:text-black!'
                        onClick={handleClearSearch}
                      >
                        <PiKnifeFill className='h-4 w-4 hover:text-black' />
                      </Button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-black'>Search Killer</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button className='cool cursor-pointer' type='submit'>
                Search
              </Button>
            </form>
          )}
          <div className='flex-1'>
            {filters.length > 0 && (
              <ActionButton
                className='h-9'
                icon={isFilterOpen ? <TbFilterX /> : <TbFilter />}
                tooltip={isFilterOpen ? "Close Filter" : "Open Filter"}
                onClick={() => setIsFilterOpen(prev => !prev)}
              />
            )}
          </div>
        </div>
        <div
          style={{
            maxHeight: isFilterOpen ? "300px" : "0px",
            opacity: isFilterOpen ? 1 : 0,
            overflow: "hidden",
            transition: isFilterOpen
              ? "max-height 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease"
              : "max-height 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms ease"
          }}
        >
          <div className='rounded-lg border p-4'>
            <div className='flex flex-wrap items-center gap-4'>
              <p className='text-muted-foreground text-sm font-medium'>Filters:</p>
              {filters.map(filter => (
                <div key={filter.key} className='flex items-center gap-2'>
                  <Label className='text-sm whitespace-nowrap'>{filter.label}:</Label>
                  <Select
                    value={filterValues[filter.key] || "__all__"} // ← sentinel when empty
                    onValueChange={val => handleFilterChange(filter.key, val)}
                  >
                    <SelectTrigger size='sm' className='border-primary w-36'>
                      <SelectValue placeholder='All' />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="__all__">All</SelectItem> */}
                      {filter.options.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            {/* Active Filter Badges */}
            {Object.values(filterValues).some(Boolean) && (
              <div className='flex flex-wrap items-center gap-4 pt-2'>
                <span className='text-muted-foreground text-xs font-medium'>Active Filters:</span>
                {filters.map(filter => {
                  const val = filterValues[filter.key];
                  if (!val) return null;
                  const label = filter.options.find(o => o.value === val)?.label ?? val;
                  return (
                    <span
                      key={filter.key}
                      className='bg-foundation-red/10 text-primary p-text-14 inline-flex items-center gap-1 rounded-full px-2.5 py-2 font-medium'
                    >
                      {filter.label}: {label}
                      <button
                        type='button'
                        onClick={() => handleFilterChange(filter.key, "__all__")}
                        className='hover:text-primary ml-0.5 rounded-full transition-colors'
                      >
                        <X className='size-5' />
                      </button>
                    </span>
                  );
                })}
                <button
                  type='button'
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    filters.forEach(({ key }) => params.delete(key));
                    params.set("page", "1");
                    router.push(`?${params.toString()}`, { scroll: false });
                  }}
                  className='text-destructive hover:text-destructive/70 bg-foundation-red/20 p-text-14 rounded-full px-4 py-2 font-medium transition-colors'
                >
                  Reset All ↺
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='relative border'>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className='scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 overflow-y-auto'
        >
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className='bg-muted/70 sticky! top-0! z-10 rounded-t-lg backdrop-blur-sm'>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {draggable && <TableHead>{null}</TableHead>}
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className='**:data-[slot=table-cell]:first:w-8'>
                {isLoading ? (
                  <TableBodySkeleton columns={table.getHeaderGroups()[0].headers.length + (draggable ? 1 : 0)} rows={currentLimit} />
                ) : table?.getRowModel().rows?.length ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table?.getRowModel().rows.map(row => (
                      <DraggableRow key={row.id} row={row} draggable={draggable} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + (draggable ? 1 : 0)} className='bg-card h-24 text-center'>
                      <div className='flex items-center justify-center'>
                        <img src='/images/shared/data-not-found.png' alt='Data not found' className='h-[400px] w-[400px]' />
                      </div>
                      <p className='mt-2 text-base'>
                        {currentSearch ? (
                          <span>
                            🔍 No results found for <span className='text-primary font-bold'>"{currentSearch}"</span>
                          </span>
                        ) : (
                          <span className='text-primary'>{noFoundMessage}</span>
                        )}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>
      {/* Pagination */}
      {showPagination && (
        <div className='flex items-center justify-between px-4'>
          <div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
            Showing {data?.length === 0 ? 0 : (currentPage - 1) * currentLimit + 1} to {Math.min(currentPage * currentLimit, total)} of{" "}
            {total} row(s)
            {currentSearch && ` (Filtered by "${currentSearch}")`}
          </div>
          <div className='flex w-full items-center gap-8 lg:w-fit'>
            <div className='hidden items-center gap-2 lg:flex'>
              <Label htmlFor='rows-per-page' className='text-sm font-medium'>
                Rows per page
              </Label>
              <Select value={currentLimit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger size='sm' className='border-primary w-20' id='rows-per-page'>
                  <SelectValue placeholder={currentLimit} />
                </SelectTrigger>
                <SelectContent side='top'>
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex w-fit items-center justify-center text-sm font-medium'>
              Page {currentPage} of {totalPages || 1}
            </div>
            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => handlePageChange(1)}
                disabled={!canPreviousPage}
              >
                <span className='sr-only'>Go to first page</span>
                <ChevronsLeft />
              </Button>

              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!canPreviousPage}
              >
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeft />
              </Button>

              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!canNextPage}
              >
                <span className='sr-only'>Go to next page</span>
                <ChevronRight />
              </Button>

              <Button
                variant='outline'
                className='hidden size-8 lg:flex'
                size='icon'
                onClick={() => handlePageChange(totalPages)}
                disabled={!canNextPage}
              >
                <span className='sr-only'>Go to last page</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
