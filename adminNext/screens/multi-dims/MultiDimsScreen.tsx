import { useCallback } from "react"
import { useSearchParams } from "react-router-dom-v5-compat"
import { useQuery } from "@tanstack/react-query"
import { api } from "adminNext/lib/api.js"
import { DataTable } from "adminNext/components/data-table/DataTable.js"
import {
    multiDimColumns,
    type MultiDimListItem,
} from "./multiDimColumns.js"
import { MultiDimDetailPanel } from "./MultiDimDetailPanel.js"

interface MultiDimsApiResponse {
    multiDims: MultiDimListItem[]
}

const PUBLISHED_OPTIONS = [
    { label: "Published", value: "true" },
    { label: "Draft", value: "false" },
]

export function MultiDimsScreen() {
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedId = searchParams.get("selected")

    const { data, isLoading } = useQuery({
        queryKey: ["multiDims"],
        queryFn: () => api.get<MultiDimsApiResponse>("/multi-dims.json"),
    })

    const multiDims = data?.multiDims ?? []

    const handleRowClick = useCallback(
        (row: MultiDimListItem) => {
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

    const selectedMultiDim = selectedId
        ? multiDims.find((m) => m.id === Number(selectedId))
        : undefined

    return (
        <div data-testid="multi-dims-screen" className="flex h-full">
            <div className="flex-1 overflow-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Multi-dims</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage multidimensional data pages.
                    </p>
                </div>

                <DataTable
                    columns={multiDimColumns}
                    data={multiDims}
                    searchKey="title"
                    searchPlaceholder="Search multi-dims..."
                    filterableColumns={[
                        {
                            id: "published",
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

            {selectedMultiDim && (
                <MultiDimDetailPanel multiDim={selectedMultiDim} />
            )}
        </div>
    )
}
