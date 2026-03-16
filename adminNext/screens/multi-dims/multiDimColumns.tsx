import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "adminNext/components/ui/badge"
import { DataTableColumnHeader } from "adminNext/components/data-table/DataTableColumnHeader.js"

export interface MultiDimListItem {
    id: number
    catalogPath: string
    title: string
    slug: string | null
    updatedAt: string
    published: boolean
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

export const multiDimColumns: ColumnDef<MultiDimListItem>[] = [
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
                {row.getValue("title") || (
                    <span className="text-muted-foreground italic">
                        Untitled
                    </span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "slug",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Slug" />
        ),
        cell: ({ row }) => {
            const slug = row.getValue("slug") as string | null
            return (
                <span className="font-mono text-xs text-muted-foreground">
                    {slug ?? "—"}
                </span>
            )
        },
    },
    {
        accessorKey: "catalogPath",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Catalog path" />
        ),
        cell: ({ row }) => (
            <span className="max-w-[300px] truncate font-mono text-xs text-muted-foreground block">
                {row.getValue("catalogPath")}
            </span>
        ),
    },
    {
        accessorKey: "published",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const published = row.getValue("published")
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
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last updated" />
        ),
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {formatDate(row.getValue("updatedAt"))}
            </span>
        ),
    },
]
