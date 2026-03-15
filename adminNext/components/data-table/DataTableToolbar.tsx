import { type Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Input } from "adminNext/components/ui/input"
import { Button } from "adminNext/components/ui/button"
import { DataTableFacetedFilter } from "./DataTableFacetedFilter.js"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    searchKey?: string
    searchPlaceholder?: string
    filterableColumns?: {
        id: string
        title: string
        options: { label: string; value: string }[]
    }[]
}

export function DataTableToolbar<TData>({
    table,
    searchKey,
    searchPlaceholder = "Search...",
    filterableColumns = [],
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div
            data-testid="data-table-toolbar"
            className="flex items-center justify-between gap-2"
        >
            <div className="flex flex-1 items-center gap-2">
                {searchKey && (
                    <Input
                        data-testid="data-table-search"
                        placeholder={searchPlaceholder}
                        value={
                            (table
                                .getColumn(searchKey)
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn(searchKey)
                                ?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-[250px]"
                    />
                )}
                {filterableColumns.map(
                    (column) =>
                        table.getColumn(column.id) && (
                            <DataTableFacetedFilter
                                key={column.id}
                                column={table.getColumn(column.id)}
                                title={column.title}
                                options={column.options}
                            />
                        )
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 size-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
