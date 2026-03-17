import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "adminNext/components/ui/badge"
import { DataTableColumnHeader } from "adminNext/components/data-table/DataTableColumnHeader.js"

export interface DatasetListItem {
    id: number
    name: string
    shortName: string
    namespace: string
    description: string
    dataEditedAt: string
    dataEditedByUserName: string
    metadataEditedAt: string
    metadataEditedByUserName: string
    tags: { id: number; name: string }[]
    isPrivate: boolean
    nonRedistributable: boolean
    version: string
    numCharts: number
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

export const datasetColumns: ColumnDef<DatasetListItem>[] = [
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
            <div className="max-w-[400px] truncate font-medium">
                {row.getValue("name")}
                {row.original.shortName && (
                    <span className="ml-1 text-muted-foreground">
                        ({row.original.shortName})
                    </span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "namespace",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Namespace" />
        ),
        cell: ({ row }) => (
            <Badge variant="outline" className="text-xs">
                {row.getValue("namespace")}
            </Badge>
        ),
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "numCharts",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Charts" />
        ),
        cell: ({ row }) => {
            const count = row.getValue("numCharts") as number
            return (
                <span className="text-sm text-muted-foreground">
                    {count ?? 0}
                </span>
            )
        },
    },
    {
        accessorKey: "dataEditedByUserName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Data edited by" />
        ),
        cell: ({ row }) => (
            <span className="text-sm">
                {row.getValue("dataEditedByUserName")}
            </span>
        ),
    },
    {
        accessorKey: "dataEditedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Data edited" />
        ),
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {formatDate(row.getValue("dataEditedAt"))}
            </span>
        ),
    },
    {
        accessorKey: "tags",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tags" />
        ),
        cell: ({ row }) => {
            const tags = row.original.tags
            if (!tags || tags.length === 0) return null
            return (
                <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 3).map((tag) => (
                        <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs"
                        >
                            {tag.name}
                        </Badge>
                    ))}
                    {tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                            +{tags.length - 3}
                        </Badge>
                    )}
                </div>
            )
        },
        enableSorting: false,
    },
]
