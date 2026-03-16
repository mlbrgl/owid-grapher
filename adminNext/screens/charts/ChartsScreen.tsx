import { useCallback } from "react"
import { useSearchParams } from "react-router-dom-v5-compat"
import { useQuery } from "@tanstack/react-query"
import { api } from "adminNext/lib/api.js"
import { DataTable } from "adminNext/components/data-table/DataTable.js"
import { chartColumns, type ChartListItem } from "./chartColumns.js"
import { ChartDetailPanel } from "./ChartDetailPanel.js"

interface ChartsApiResponse {
    charts: ChartListItem[]
}

const CHART_TYPE_OPTIONS = [
    { label: "Line", value: "LineChart" },
    { label: "Bar", value: "DiscreteBar" },
    { label: "Stacked Area", value: "StackedArea" },
    { label: "Stacked Bar", value: "StackedBar" },
    { label: "Scatter", value: "ScatterPlot" },
    { label: "Slope", value: "SlopeChart" },
    { label: "Marimekko", value: "Marimekko" },
]

const PUBLISHED_OPTIONS = [
    { label: "Published", value: "true" },
    { label: "Draft", value: "false" },
]

export function ChartsScreen() {
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedId = searchParams.get("selected")

    const { data, isLoading } = useQuery({
        queryKey: ["charts"],
        queryFn: () => api.get<ChartsApiResponse>("/charts.json"),
    })

    const charts = data?.charts ?? []

    const handleRowClick = useCallback(
        (row: ChartListItem) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                const current = next.get("selected")
                if (current === String(row.id)) {
                    next.delete("selected")
                } else {
                    next.set("selected", String(row.id))
                }
                return next
            })
        },
        [setSearchParams]
    )

    const selectedChart = selectedId
        ? charts.find((c) => c.id === Number(selectedId))
        : undefined

    return (
        <div data-testid="charts-screen" className="relative flex h-full">
            <div className="flex-1 overflow-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Charts</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage and browse all charts.
                    </p>
                </div>

                <DataTable
                    columns={chartColumns}
                    data={charts}
                    searchKey="title"
                    searchPlaceholder="Search charts..."
                    filterableColumns={[
                        {
                            id: "type",
                            title: "Type",
                            options: CHART_TYPE_OPTIONS,
                        },
                        {
                            id: "isPublished",
                            title: "Status",
                            options: PUBLISHED_OPTIONS,
                        },
                    ]}
                    onRowClick={handleRowClick}
                    selectedId={selectedId}
                    getRowId={(row) => String(row.id)}
                    isLoading={isLoading}
                />
            </div>

            {selectedChart && (
                <ChartDetailPanel chart={selectedChart} />
            )}
        </div>
    )
}
