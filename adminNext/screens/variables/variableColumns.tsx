import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "adminNext/components/ui/badge"
import { DataTableColumnHeader } from "adminNext/components/data-table/DataTableColumnHeader.js"

export interface VariableListItem {
    id: number
    name: string
    catalogPath?: string
    datasetId: number
    datasetName: string
    isPrivate: boolean
    nonRedistributable: boolean
    uploadedAt: string
    uploadedBy: string
    namespace?: string
    version?: string
    dataset?: string
    table?: string
    shortName?: string
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

export const variableColumns: ColumnDef<VariableListItem>[] = [
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
            </div>
        ),
    },
    {
        accessorKey: "namespace",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Namespace" />
        ),
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.getValue("namespace") ?? ""}
            </span>
        ),
    },
    {
        accessorKey: "dataset",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Dataset" />
        ),
        cell: ({ row }) => (
            <span className="max-w-[200px] truncate text-sm text-muted-foreground">
                {row.getValue("dataset") ?? ""}
            </span>
        ),
    },
    {
        accessorKey: "isPrivate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Access" />
        ),
        cell: ({ row }) => {
            const isPrivate = row.getValue("isPrivate")
            return (
                <Badge
                    variant={isPrivate ? "secondary" : "default"}
                    className="text-xs"
                >
                    {isPrivate ? "Private" : "Public"}
                </Badge>
            )
        },
        filterFn: (row, id, value: string[]) => {
            return value.includes(String(row.getValue(id)))
        },
    },
    {
        accessorKey: "uploadedBy",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Uploaded by" />
        ),
        cell: ({ row }) => (
            <span className="text-sm">{row.getValue("uploadedBy")}</span>
        ),
    },
    {
        accessorKey: "uploadedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated" />
        ),
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {formatDate(row.getValue("uploadedAt"))}
            </span>
        ),
    },
]
