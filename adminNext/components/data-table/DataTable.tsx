import { useState } from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "adminNext/components/ui/table"
import { DataTableToolbar } from "./DataTableToolbar.js"
import { DataTablePagination } from "./DataTablePagination.js"
import { cn } from "adminNext/lib/utils"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    totalCount?: number
    searchKey?: string
    searchPlaceholder?: string
    filterableColumns?: {
        id: string
        title: string
        options: { label: string; value: string }[]
    }[]
    onRowClick?: (row: TData) => void
    selectedId?: string | null
    getRowId?: (row: TData) => string
    isLoading?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    totalCount,
    searchKey,
    searchPlaceholder,
    filterableColumns = [],
    onRowClick,
    selectedId,
    getRowId,
    isLoading = false,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    )

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getRowId: getRowId as (row: TData) => string,
    })

    return (
        <div data-testid="data-table" className="flex flex-col gap-4">
            <DataTableToolbar
                table={table}
                searchKey={searchKey}
                searchPlaceholder={searchPlaceholder}
                filterableColumns={filterableColumns}
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const isSelected =
                                    selectedId !== undefined &&
                                    selectedId !== null &&
                                    getRowId &&
                                    getRowId(row.original) === selectedId
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            isSelected ? "selected" : undefined
                                        }
                                        className={cn(
                                            onRowClick && "cursor-pointer",
                                            isSelected && "bg-muted"
                                        )}
                                        onClick={() =>
                                            onRowClick?.(row.original)
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination
                table={table}
                totalCount={totalCount ?? data.length}
            />
        </div>
    )
}
