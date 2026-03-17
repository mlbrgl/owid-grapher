import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom-v5-compat"
import { useQuery } from "@tanstack/react-query"
import type {
    FeaturedMetricByParentTagNameDictionary,
    DbPlainFeaturedMetricWithParentTagName,
} from "@ourworldindata/types"
import { api } from "adminNext/lib/api.js"
import { DataTable } from "adminNext/components/data-table/DataTable.js"
import {
    featuredMetricColumns,
    INCOME_GROUP_OPTIONS,
    type FeaturedMetricListItem,
} from "./featuredMetricColumns.js"
import { FeaturedMetricDetailPanel } from "./FeaturedMetricDetailPanel.js"

interface FeaturedMetricsApiResponse {
    featuredMetrics: FeaturedMetricByParentTagNameDictionary
}

function flattenFeaturedMetrics(
    grouped: FeaturedMetricByParentTagNameDictionary
): FeaturedMetricListItem[] {
    const items: FeaturedMetricListItem[] = []
    for (const [, metrics] of Object.entries(grouped)) {
        for (const metric of metrics) {
            items.push(deriveFeaturedMetricListItem(metric))
        }
    }
    return items
}

function deriveFeaturedMetricListItem(
    metric: DbPlainFeaturedMetricWithParentTagName
): FeaturedMetricListItem {
    return {
        id: metric.id,
        url: metric.url,
        parentTagId: metric.parentTagId,
        parentTagName: metric.parentTagName,
        ranking: metric.ranking,
        incomeGroup: metric.incomeGroup,
    }
}

export function FeaturedMetricsScreen() {
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedId = searchParams.get("selected")

    const { data, isLoading } = useQuery({
        queryKey: ["featuredMetrics"],
        queryFn: () =>
            api.get<FeaturedMetricsApiResponse>("/featured-metrics.json"),
    })

    const metrics: FeaturedMetricListItem[] = useMemo(() => {
        if (!data?.featuredMetrics) return []
        return flattenFeaturedMetrics(data.featuredMetrics)
    }, [data])

    const handleRowClick = useCallback(
        (row: FeaturedMetricListItem) => {
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

    const selectedMetric = selectedId
        ? metrics.find((m) => m.id === Number(selectedId))
        : undefined

    return (
        <div
            data-testid="featured-metrics-screen"
            className="relative flex h-full"
        >
            <div className="flex-1 overflow-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">
                        Featured Metrics
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage featured metrics ranked by topic and income
                        group.
                    </p>
                </div>

                <DataTable
                    columns={featuredMetricColumns}
                    data={metrics}
                    searchKey="url"
                    searchPlaceholder="Search by URL..."
                    filterableColumns={[
                        {
                            id: "incomeGroup",
                            title: "Income Group",
                            options: INCOME_GROUP_OPTIONS,
                        },
                    ]}
                    onRowClick={handleRowClick}
                    selectedId={selectedId}
                    getRowId={(row) => String(row.id)}
                    isLoading={isLoading}
                />
            </div>

            {selectedMetric && (
                <FeaturedMetricDetailPanel metric={selectedMetric} />
            )}
        </div>
    )
}
