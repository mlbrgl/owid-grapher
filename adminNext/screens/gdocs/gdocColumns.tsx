import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "adminNext/components/ui/badge"
import { DataTableColumnHeader } from "adminNext/components/data-table/DataTableColumnHeader.js"
import { type OwidGdocIndexItem, OwidGdocType } from "@ourworldindata/types"

export type GdocRow = OwidGdocIndexItem & {
    publicationStatus: "published" | "draft"
}

export function deriveGdocRow(item: OwidGdocIndexItem): GdocRow {
    return {
        ...item,
        publicationStatus: item.published ? "published" : "draft",
    }
}

const GDOC_TYPE_LABELS: Record<string, string> = {
    [OwidGdocType.Article]: "Article",
    [OwidGdocType.TopicPage]: "Topic Page",
    [OwidGdocType.LinearTopicPage]: "Linear Topic Page",
    [OwidGdocType.Fragment]: "Fragment",
    [OwidGdocType.DataInsight]: "Data Insight",
    [OwidGdocType.Homepage]: "Homepage",
    [OwidGdocType.AboutPage]: "About Page",
    [OwidGdocType.Author]: "Author",
    [OwidGdocType.Announcement]: "Announcement",
    [OwidGdocType.Profile]: "Profile",
}

function formatGdocType(type: OwidGdocType | undefined): string {
    if (!type) return "Unknown"
    return GDOC_TYPE_LABELS[type] ?? type
}

function formatDate(dateStr: string | Date | null): string {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

export const gdocColumns: ColumnDef<GdocRow>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => (
            <div className="max-w-[400px] truncate font-medium">
                {row.getValue("title") || (
                    <span className="italic text-muted-foreground">
                        Untitled
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
                {formatGdocType(row.getValue("type"))}
            </Badge>
        ),
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "publicationStatus",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("publicationStatus") as string
            return (
                <Badge
                    variant={status === "published" ? "default" : "secondary"}
                    className="text-xs capitalize"
                >
                    {status}
                </Badge>
            )
        },
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "authors",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Authors" />
        ),
        cell: ({ row }) => {
            const authors = row.getValue("authors") as string[]
            return (
                <span className="text-sm">
                    {authors?.join(", ") || ""}
                </span>
            )
        },
    },
    {
        accessorKey: "slug",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Slug" />
        ),
        cell: ({ row }) => (
            <span className="max-w-[200px] truncate font-mono text-xs text-muted-foreground">
                {row.getValue("slug")}
            </span>
        ),
    },
    {
        accessorKey: "publishedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Published" />
        ),
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {formatDate(row.getValue("publishedAt"))}
            </span>
        ),
    },
]
