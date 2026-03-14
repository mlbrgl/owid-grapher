import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "adminNext/components/ui/badge"
import { DataTableColumnHeader } from "adminNext/components/data-table/DataTableColumnHeader.js"
import {
    type OwidGdocDataInsightIndexItem,
    type GrapherChartOrMapType,
} from "@ourworldindata/types"

type DataInsightRow = OwidGdocDataInsightIndexItem & {
    /** Derived field for table filtering: "published" | "scheduled" | "draft" */
    publicationStatus: string
}

export type { DataInsightRow }

function formatChartType(type: GrapherChartOrMapType | undefined): string {
    if (!type) return "—"
    const typeMap: Record<string, string> = {
        LineChart: "Line",
        DiscreteBar: "Bar",
        StackedArea: "Stacked Area",
        StackedBar: "Stacked Bar",
        ScatterPlot: "Scatter",
        SlopeChart: "Slope",
        Marimekko: "Marimekko",
        WorldMap: "Map",
    }
    return typeMap[type] ?? type
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

function getPublicationStatus(
    item: OwidGdocDataInsightIndexItem
): "published" | "scheduled" | "draft" {
    if (!item.published) return "draft"
    if (item.publishedAt && new Date(item.publishedAt) > new Date())
        return "scheduled"
    return "published"
}

export function deriveDataInsightRow(
    item: OwidGdocDataInsightIndexItem
): DataInsightRow {
    return {
        ...item,
        publicationStatus: getPublicationStatus(item),
    }
}

export const dataInsightColumns: ColumnDef<DataInsightRow>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => {
            const item = row.original
            const isPublished =
                item.publicationStatus === "published" && item.slug
            return (
                <div className="max-w-[350px]">
                    {isPublished ? (
                        <a
                            href={`/admin/gdocs/${item.id}/preview`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            {item.title}
                        </a>
                    ) : (
                        <span className="font-medium">{item.title}</span>
                    )}
                </div>
            )
        },
        filterFn: "includesString",
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
                    {authors.join(", ")}
                    {row.original.approvedBy &&
                        ` (approved by ${row.original.approvedBy})`}
                </span>
            )
        },
        filterFn: (row, _id, filterValue: string) => {
            const authors = row.original.authors
            return authors.some((a) =>
                a.toLowerCase().includes(filterValue.toLowerCase())
            )
        },
    },
    {
        accessorKey: "chartType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Chart type" />
        ),
        cell: ({ row }) => {
            const chartType = row.getValue(
                "chartType"
            ) as GrapherChartOrMapType
            return (
                <Badge variant="outline" className="text-xs">
                    {formatChartType(chartType)}
                </Badge>
            )
        },
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: "tags",
        accessorFn: (row) => row.tags?.map((t) => t.name).join(", ") ?? "",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Topic tags" />
        ),
        cell: ({ row }) => {
            const tags = row.original.tags ?? []
            if (tags.length === 0) return <span className="text-muted-foreground">—</span>
            return (
                <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                        <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs"
                        >
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            )
        },
        filterFn: (row, _id, value: string[]) => {
            const tags = row.original.tags ?? []
            return value.some((v) => tags.some((t) => t.name === v))
        },
    },
    {
        accessorKey: "publicationStatus",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("publicationStatus") as string
            const publishedAt = row.original.publishedAt
            const variant =
                status === "published"
                    ? "default"
                    : status === "scheduled"
                      ? "outline"
                      : "secondary"
            return (
                <div className="flex flex-col gap-0.5">
                    <Badge variant={variant} className="text-xs capitalize">
                        {status}
                    </Badge>
                    {publishedAt && (
                        <span className="text-xs text-muted-foreground">
                            {formatDate(publishedAt)}
                        </span>
                    )}
                </div>
            )
        },
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: "links",
        header: "Links",
        cell: ({ row }) => {
            const item = row.original
            return (
                <div className="flex flex-col gap-1 text-xs">
                    <a
                        href={`/admin/gdocs/${item.id}/preview`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-blue-600 hover:underline"
                    >
                        Preview
                    </a>
                    <a
                        href={`https://docs.google.com/document/d/${item.id}/edit`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-blue-600 hover:underline"
                    >
                        Edit GDoc
                    </a>
                    {item.grapherUrl && (
                        <a
                            href={item.grapherUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-blue-600 hover:underline"
                        >
                            Grapher
                        </a>
                    )}
                    {item.explorerUrl && (
                        <a
                            href={item.explorerUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-blue-600 hover:underline"
                        >
                            Explorer
                        </a>
                    )}
                    {item.figmaUrl && (
                        <a
                            href={item.figmaUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-blue-600 hover:underline"
                        >
                            Figma
                        </a>
                    )}
                </div>
            )
        },
        enableSorting: false,
    },
]
