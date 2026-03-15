import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "adminNext/components/ui/badge"
import { DataTableColumnHeader } from "adminNext/components/data-table/DataTableColumnHeader.js"

export interface ChartListItem {
    id: number
    title: string
    slug: string
    type?: string
    internalNotes: string
    variantName: string
    isPublished: boolean
    tab: string
    hasChartTab: boolean
    hasMapTab: boolean
    lastEditedAt: string
    lastEditedByUserId: number
    lastEditedBy: string
    publishedAt: string
    publishedByUserId: number
    publishedBy: string
    grapherViewsPerDay: number
    narrativeChartsCount: number
    referencesCount: number
    tags?: { id: number; name: string }[]
}

function formatDate(dateStr: string): string {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

function formatChartType(type: string | undefined): string {
    if (!type) return "—"
    const typeMap: Record<string, string> = {
        LineChart: "Line",
        DiscreteBar: "Bar",
        StackedArea: "Stacked Area",
        StackedBar: "Stacked Bar",
        ScatterPlot: "Scatter",
        SlopeChart: "Slope",
        Marimekko: "Marimekko",
    }
    return typeMap[type] ?? type
}

export const chartColumns: ColumnDef<ChartListItem>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground">
                {row.getValue("id")}
            </span>
        ),
        size: 70,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => (
            <div className="max-w-[400px] truncate font-medium">
                {row.getValue("title")}
                {row.original.variantName && (
                    <span className="ml-1 text-muted-foreground">
                        — {row.original.variantName}
                    </span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row }) => (
            <Badge variant="outline" className="text-xs">
                {formatChartType(row.getValue("type"))}
            </Badge>
        ),
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "isPublished",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const published = row.getValue("isPublished")
            return (
                <Badge
                    variant={published ? "default" : "secondary"}
                    className="text-xs"
                >
                    {published ? "Published" : "Draft"}
                </Badge>
            )
        },
        filterFn: (row, id, value: string[]) => {
            return value.includes(String(row.getValue(id)))
        },
    },
    {
        accessorKey: "lastEditedBy",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last edited by" />
        ),
        cell: ({ row }) => (
            <span className="text-sm">{row.getValue("lastEditedBy")}</span>
        ),
    },
    {
        accessorKey: "lastEditedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last edited" />
        ),
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {formatDate(row.getValue("lastEditedAt"))}
            </span>
        ),
    },
    {
        accessorKey: "grapherViewsPerDay",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Views/day" />
        ),
        cell: ({ row }) => {
            const views = row.getValue("grapherViewsPerDay") as number
            return (
                <span className="text-sm text-muted-foreground">
                    {views ? views.toLocaleString() : "—"}
                </span>
            )
        },
    },
]
