import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "adminNext/components/ui/badge"
import { DataTableColumnHeader } from "adminNext/components/data-table/DataTableColumnHeader.js"

export interface NarrativeChartListItem {
    id: number
    name: string
    parent: {
        type: "chart" | "multiDim"
        title: string
        url: string | null
    }
    updatedAt: string | null
    lastEditedByUser: string | null
    chartConfigId: string
    title: string
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

export const narrativeChartColumns: ColumnDef<NarrativeChartListItem>[] = [
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
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate font-mono text-sm">
                {row.getValue("name")}
            </div>
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => (
            <div className="max-w-[350px] truncate font-medium">
                {row.getValue("title")}
            </div>
        ),
    },
    {
        id: "parentType",
        accessorFn: (row) => row.parent.type,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Parent type" />
        ),
        cell: ({ row }) => {
            const parentType = row.original.parent.type
            return (
                <Badge variant="outline" className="text-xs">
                    {parentType === "multiDim" ? "Multi-dim" : "Chart"}
                </Badge>
            )
        },
        filterFn: (row, _id, value: string[]) => {
            return value.includes(row.original.parent.type)
        },
    },
    {
        id: "parentTitle",
        accessorFn: (row) => row.parent.title,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Parent" />
        ),
        cell: ({ row }) => {
            const parent = row.original.parent
            return (
                <div className="max-w-[250px] truncate text-sm">
                    {parent.url ? (
                        <a
                            href={parent.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-blue-600 hover:underline"
                        >
                            {parent.title}
                        </a>
                    ) : (
                        parent.title
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "lastEditedByUser",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last edited by" />
        ),
        cell: ({ row }) => (
            <span className="text-sm">
                {row.getValue("lastEditedByUser")}
            </span>
        ),
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last edited" />
        ),
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {formatDate(row.getValue("updatedAt"))}
            </span>
        ),
    },
]
