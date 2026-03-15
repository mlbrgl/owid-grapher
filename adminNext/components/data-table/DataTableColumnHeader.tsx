import { type Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { cn } from "adminNext/lib/utils"
import { Button } from "adminNext/components/ui/button"

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    const sorted = column.getIsSorted()

    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn("-ml-3 h-8", className)}
            onClick={() => column.toggleSorting(sorted === "asc")}
        >
            {title}
            {sorted === "desc" ? (
                <ArrowDown className="ml-2 size-4" />
            ) : sorted === "asc" ? (
                <ArrowUp className="ml-2 size-4" />
            ) : (
                <ArrowUpDown className="ml-2 size-4" />
            )}
        </Button>
    )
}
