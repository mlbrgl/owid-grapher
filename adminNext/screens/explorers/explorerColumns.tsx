import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "adminNext/components/ui/badge"
import { DataTableColumnHeader } from "adminNext/components/data-table/DataTableColumnHeader.js"

export interface ExplorerListItem {
    slug: string
    title: string
    isPublished: boolean
    googleSheet: string | undefined
    grapherCount: number
    tableCount: number
    lastEditedAt: string
    lastEditedBy: string
    commitMessage: string
    tags: { id: number; name: string }[]
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

export const explorerColumns: ColumnDef<ExplorerListItem>[] = [
    {
        accessorKey: "slug",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Slug" />
        ),
        cell: ({ row }) => (
            <span className="font-mono text-xs">
                {row.getValue("slug")}
            </span>
        ),
        size: 200,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => (
            <div className="max-w-[400px]">
                <div className="truncate font-medium">
                    {row.getValue("title") || (
                        <span className="text-muted-foreground italic">
                            Untitled
                        </span>
                    )}
                </div>
                <div className="text-xs text-muted-foreground">
                    {row.original.grapherCount} grapher
                    {row.original.grapherCount !== 1 ? "s" : ""}
                    {", "}
                    {row.original.tableCount} table
                    {row.original.tableCount !== 1 ? "s" : ""}
                </div>
            </div>
        ),
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
        accessorKey: "commitMessage",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last commit" />
        ),
        cell: ({ row }) => (
            <div className="max-w-[250px] truncate text-sm text-muted-foreground">
                {row.getValue("commitMessage") || "—"}
            </div>
        ),
    },
]
