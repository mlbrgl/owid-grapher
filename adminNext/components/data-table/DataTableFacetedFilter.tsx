import { type Column } from "@tanstack/react-table"
import { Check } from "lucide-react"
import { cn } from "adminNext/lib/utils"
import { Badge } from "adminNext/components/ui/badge"
import { Button } from "adminNext/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "adminNext/components/ui/popover"
import { Separator } from "adminNext/components/ui/separator"

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title?: string
    options: {
        label: string
        value: string
    }[]
}

export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options,
}: DataTableFacetedFilterProps<TData, TValue>) {
    const facets = column?.getFacetedUniqueValues()
    const selectedValues = new Set(column?.getFilterValue() as string[])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-dashed"
                    data-testid={`filter-${title?.toLowerCase()}`}
                >
                    {title}
                    {selectedValues.size > 0 && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="mx-2 h-4"
                            />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal"
                            >
                                {selectedValues.size}
                            </Badge>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2" align="start">
                <div className="space-y-1">
                    {options.map((option) => {
                        const isSelected = selectedValues.has(option.value)
                        return (
                            <button
                                key={option.value}
                                onClick={() => {
                                    const next = new Set(selectedValues)
                                    if (isSelected) {
                                        next.delete(option.value)
                                    } else {
                                        next.add(option.value)
                                    }
                                    const filterValues = Array.from(next)
                                    column?.setFilterValue(
                                        filterValues.length
                                            ? filterValues
                                            : undefined
                                    )
                                }}
                                className={cn(
                                    "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
                                    "hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex size-4 items-center justify-center rounded-sm border",
                                        isSelected
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-muted-foreground/25"
                                    )}
                                >
                                    {isSelected && (
                                        <Check className="size-3" />
                                    )}
                                </div>
                                <span>{option.label}</span>
                                {facets?.get(option.value) !== undefined && (
                                    <span className="ml-auto text-xs text-muted-foreground">
                                        {facets.get(option.value)}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                    {selectedValues.size > 0 && (
                        <>
                            <Separator />
                            <button
                                onClick={() =>
                                    column?.setFilterValue(undefined)
                                }
                                className="flex w-full items-center justify-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                            >
                                Clear filters
                            </button>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
