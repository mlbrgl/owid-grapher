import { useState, useMemo, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus, LayoutList, LayoutGrid } from "lucide-react"
import { api } from "adminNext/lib/api.js"
import { DataTable } from "adminNext/components/data-table/DataTable.js"
import { Button } from "adminNext/components/ui/button"
import { Badge } from "adminNext/components/ui/badge"
import {
    type OwidGdocDataInsightIndexItem,
    ALL_GRAPHER_CHART_TYPES,
    GRAPHER_MAP_TYPE,
} from "@ourworldindata/types"
import {
    dataInsightColumns,
    deriveDataInsightRow,
    type DataInsightRow,
} from "./dataInsightColumns.js"

type Layout = "list" | "gallery"

const CHART_TYPE_OPTIONS = [
    ...ALL_GRAPHER_CHART_TYPES.map((type) => ({
        label: type.replace(/([A-Z])/g, " $1").trim(),
        value: type,
    })),
    { label: "Map", value: GRAPHER_MAP_TYPE },
]

const STATUS_OPTIONS = [
    { label: "Published", value: "published" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Draft", value: "draft" },
]

export function DataInsightsScreen() {
    const [layout, setLayout] = useState<Layout>("list")

    const { data: rawData, isLoading } = useQuery({
        queryKey: ["dataInsights"],
        queryFn: () =>
            api.get<OwidGdocDataInsightIndexItem[]>("/dataInsights"),
    })

    const dataInsights: DataInsightRow[] = useMemo(
        () => (rawData ?? []).map(deriveDataInsightRow),
        [rawData]
    )

    const handleCreateClick = useCallback(() => {
        // Navigate to the old admin create flow for now
        window.open("/admin/data-insights", "_blank")
    }, [])

    return (
        <div data-testid="data-insights-screen" className="flex h-full">
            <div className="flex-1 overflow-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Data Insights
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Browse and manage data insights.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            data-testid="layout-toggle"
                            className="flex items-center rounded-md border"
                        >
                            <Button
                                variant={
                                    layout === "list" ? "secondary" : "ghost"
                                }
                                size="sm"
                                className="rounded-r-none"
                                onClick={() => setLayout("list")}
                                aria-label="List view"
                            >
                                <LayoutList className="size-4" />
                            </Button>
                            <Button
                                variant={
                                    layout === "gallery" ? "secondary" : "ghost"
                                }
                                size="sm"
                                className="rounded-l-none"
                                onClick={() => setLayout("gallery")}
                                aria-label="Gallery view"
                            >
                                <LayoutGrid className="size-4" />
                            </Button>
                        </div>
                        <Button
                            data-testid="create-data-insight-button"
                            onClick={handleCreateClick}
                        >
                            <Plus className="mr-2 size-4" />
                            New Data Insight
                        </Button>
                    </div>
                </div>

                {layout === "list" && (
                    <DataTable
                        columns={dataInsightColumns}
                        data={dataInsights}
                        searchKey="title"
                        searchPlaceholder="Search data insights..."
                        filterableColumns={[
                            {
                                id: "chartType",
                                title: "Chart type",
                                options: CHART_TYPE_OPTIONS,
                            },
                            {
                                id: "publicationStatus",
                                title: "Status",
                                options: STATUS_OPTIONS,
                            },
                        ]}
                        getRowId={(row) => row.id}
                        isLoading={isLoading}
                    />
                )}

                {layout === "gallery" && (
                    <DataInsightGallery
                        dataInsights={dataInsights}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    )
}

function DataInsightGallery({
    dataInsights,
    isLoading,
}: {
    dataInsights: DataInsightRow[]
    isLoading: boolean
}) {
    if (isLoading) {
        return (
            <p className="text-sm text-muted-foreground">
                Loading data insights...
            </p>
        )
    }

    const insightsWithImages = dataInsights.filter((di) => di.image)

    if (insightsWithImages.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No data insights with preview images found.
            </p>
        )
    }

    return (
        <div
            data-testid="data-insights-gallery"
            className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4"
        >
            {insightsWithImages.map((di) => (
                <DataInsightCard key={di.id} dataInsight={di} />
            ))}
        </div>
    )
}

function DataInsightCard({ dataInsight }: { dataInsight: DataInsightRow }) {
    const image = dataInsight.image
    if (!image) return null

    const cloudflareBaseUrl = process.env.CLOUDFLARE_IMAGES_URL ?? ""
    const cloudflareUrl = `${cloudflareBaseUrl}/${encodeURIComponent(image.cloudflareId)}/w=${Math.min(image.originalWidth, 560)}`

    return (
        <div className="overflow-hidden rounded-lg border bg-card">
            <img
                src={cloudflareUrl}
                alt={dataInsight.title}
                className="aspect-square w-full object-cover"
            />
            <div className="p-3">
                <h3 className="truncate text-sm font-medium">
                    {dataInsight.title}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                        variant={
                            dataInsight.publicationStatus === "published"
                                ? "default"
                                : "secondary"
                        }
                        className="text-xs capitalize"
                    >
                        {dataInsight.publicationStatus}
                    </Badge>
                    {dataInsight.authors.length > 0 && (
                        <span>{dataInsight.authors.join(", ")}</span>
                    )}
                </div>
                <div className="mt-2 flex gap-2 text-xs">
                    <a
                        href={`/admin/gdocs/${dataInsight.id}/preview`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-blue-600 hover:underline"
                    >
                        Preview
                    </a>
                    <a
                        href={`https://docs.google.com/document/d/${dataInsight.id}/edit`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-blue-600 hover:underline"
                    >
                        GDoc
                    </a>
                    {dataInsight.figmaUrl && (
                        <a
                            href={dataInsight.figmaUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-blue-600 hover:underline"
                        >
                            Figma
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
