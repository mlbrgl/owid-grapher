import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "adminNext/components/ui/badge"
import { DataTableColumnHeader } from "adminNext/components/data-table/DataTableColumnHeader.js"
import type { FeaturedMetricIncomeGroup } from "@ourworldindata/types"

export interface FeaturedMetricListItem {
    id: number
    url: string
    parentTagId: number
    parentTagName: string
    ranking: number
    incomeGroup: FeaturedMetricIncomeGroup
}

const INCOME_GROUP_LABELS: Record<string, string> = {
    default: "Default",
    high: "High",
    "upper-middle": "Upper-middle",
    "lower-middle": "Lower-middle",
    low: "Low",
}

export const INCOME_GROUP_OPTIONS = Object.entries(INCOME_GROUP_LABELS).map(
    ([value, label]) => ({ value, label })
)

export const featuredMetricColumns: ColumnDef<FeaturedMetricListItem>[] = [
    {
        accessorKey: "url",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="URL" />
        ),
        cell: ({ row }) => (
            <div className="max-w-[400px] truncate font-mono text-xs">
                {row.getValue("url")}
            </div>
        ),
    },
    {
        accessorKey: "parentTagName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Topic" />
        ),
        cell: ({ row }) => (
            <span className="text-sm">{row.getValue("parentTagName")}</span>
        ),
    },
    {
        accessorKey: "incomeGroup",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Income Group" />
        ),
        cell: ({ row }) => {
            const group = row.getValue("incomeGroup") as string
            return (
                <Badge variant="outline" className="text-xs">
                    {INCOME_GROUP_LABELS[group] ?? group}
                </Badge>
            )
        },
        filterFn: (row, id, value: string[]) => {
            return value.includes(String(row.getValue(id)))
        },
    },
    {
        accessorKey: "ranking",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ranking" />
        ),
        cell: ({ row }) => (
            <span className="text-sm tabular-nums">
                {row.getValue("ranking")}
            </span>
        ),
    },
]
