import { useCallback } from "react"
import { useSearchParams } from "react-router-dom-v5-compat"
import { useQuery } from "@tanstack/react-query"
import { api } from "adminNext/lib/api.js"
import { DataTable } from "adminNext/components/data-table/DataTable.js"
import {
    narrativeChartColumns,
    type NarrativeChartListItem,
} from "./narrativeChartColumns.js"
import { NarrativeChartDetailPanel } from "./NarrativeChartDetailPanel.js"

interface NarrativeChartsApiResponse {
    narrativeCharts: NarrativeChartListItem[]
}

const PARENT_TYPE_OPTIONS = [
    { label: "Chart", value: "chart" },
    { label: "Multi-dim", value: "multiDim" },
]

export function NarrativeChartsScreen() {
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedId = searchParams.get("selected")

    const { data, isLoading } = useQuery({
        queryKey: ["narrativeCharts"],
        queryFn: () =>
            api.get<NarrativeChartsApiResponse>("/narrative-charts"),
    })

    const narrativeCharts = data?.narrativeCharts ?? []

    const handleRowClick = useCallback(
        (row: NarrativeChartListItem) => {
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
        ? narrativeCharts.find((c) => c.id === Number(selectedId))
        : undefined

    return (
        <div data-testid="narrative-charts-screen" className="flex h-full">
            <div className="flex-1 overflow-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">
                        Narrative Charts
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage and browse narrative charts.
                    </p>
                </div>

                <DataTable
                    columns={narrativeChartColumns}
                    data={narrativeCharts}
                    searchKey="title"
                    searchPlaceholder="Search narrative charts..."
                    filterableColumns={[
                        {
                            id: "parentType",
                            title: "Parent type",
                            options: PARENT_TYPE_OPTIONS,
                        },
                    ]}
                    onRowClick={handleRowClick}
                    selectedId={selectedId}
                    getRowId={(row) => String(row.id)}
                    isLoading={isLoading}
                />
            </div>

            {selectedChart && (
                <NarrativeChartDetailPanel narrativeChart={selectedChart} />
            )}
        </div>
    )
}
