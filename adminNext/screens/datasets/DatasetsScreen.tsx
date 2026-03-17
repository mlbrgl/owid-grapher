import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom-v5-compat"
import { useQuery } from "@tanstack/react-query"
import { api } from "adminNext/lib/api.js"
import { DataTable } from "adminNext/components/data-table/DataTable.js"
import { datasetColumns, type DatasetListItem } from "./datasetColumns.js"
import { DatasetDetailPanel } from "./DatasetDetailPanel.js"

interface DatasetsApiResponse {
    datasets: DatasetListItem[]
}

export function DatasetsScreen() {
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedId = searchParams.get("selected")

    const { data, isLoading } = useQuery({
        queryKey: ["datasets"],
        queryFn: () => api.get<DatasetsApiResponse>("/datasets.json"),
    })

    const datasets = data?.datasets ?? []

    const namespaceOptions = useMemo(() => {
        const namespaces = [...new Set(datasets.map((d) => d.namespace))]
        namespaces.sort()
        return namespaces.map((ns) => ({ label: ns, value: ns }))
    }, [datasets])

    const handleRowClick = useCallback(
        (row: DatasetListItem) => {
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

    const selectedDataset = selectedId
        ? datasets.find((d) => d.id === Number(selectedId))
        : undefined

    return (
        <div data-testid="datasets-screen" className="relative flex h-full">
            <div className="flex-1 overflow-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Datasets</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Browse and manage datasets.
                    </p>
                </div>

                <DataTable
                    columns={datasetColumns}
                    data={datasets}
                    searchKey="name"
                    searchPlaceholder="Search datasets..."
                    filterableColumns={[
                        {
                            id: "namespace",
                            title: "Namespace",
                            options: namespaceOptions,
                        },
                    ]}
                    onRowClick={handleRowClick}
                    selectedId={selectedId}
                    getRowId={(row) => String(row.id)}
                    isLoading={isLoading}
                />
            </div>

            {selectedDataset && (
                <DatasetDetailPanel dataset={selectedDataset} />
            )}
        </div>
    )
}
