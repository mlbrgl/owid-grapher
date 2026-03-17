import { useCallback, useState } from "react"
import { useSearchParams } from "react-router-dom-v5-compat"
import { useQuery } from "@tanstack/react-query"
import { api } from "adminNext/lib/api.js"
import { Input } from "adminNext/components/ui/input"
import { DataTable } from "adminNext/components/data-table/DataTable.js"
import {
    variableColumns,
    type VariableListItem,
} from "./variableColumns.js"
import { VariableDetailPanel } from "./VariableDetailPanel.js"

interface VariablesApiResponse {
    variables: VariableListItem[]
    numTotalRows: number
}

const ACCESS_OPTIONS = [
    { label: "Public", value: "false" },
    { label: "Private", value: "true" },
]

const SEARCH_LIMIT = 500

export function VariablesScreen() {
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedId = searchParams.get("selected")
    const [search, setSearch] = useState("")

    const { data, isLoading } = useQuery({
        queryKey: ["variables", search],
        queryFn: () =>
            api.get<VariablesApiResponse>(
                `/variables.json?search=${encodeURIComponent(search)}&limit=${SEARCH_LIMIT}`
            ),
    })

    const variables = data?.variables ?? []
    const totalCount = data?.numTotalRows ?? 0

    const handleRowClick = useCallback(
        (row: VariableListItem) => {
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

    const selectedVariable = selectedId
        ? variables.find((v) => v.id === Number(selectedId))
        : undefined

    return (
        <div data-testid="variables-screen" className="relative flex h-full">
            <div className="flex-1 overflow-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">
                        Indicators (Variables)
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Browse and search all indicators. Use search syntax like{" "}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">
                            name:population
                        </code>
                        ,{" "}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">
                            before:2023
                        </code>
                        ,{" "}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">
                            -exclude
                        </code>{" "}
                        for advanced filtering.
                    </p>
                </div>

                <div className="mb-4">
                    <Input
                        data-testid="variables-search"
                        placeholder="Search indicators... (e.g. ^population before:2023 -wdi)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9 w-full max-w-lg"
                    />
                </div>

                <DataTable
                    columns={variableColumns}
                    data={variables}
                    totalCount={totalCount}
                    filterableColumns={[
                        {
                            id: "isPrivate",
                            title: "Access",
                            options: ACCESS_OPTIONS,
                        },
                    ]}
                    onRowClick={handleRowClick}
                    selectedId={selectedId}
                    getRowId={(row) => String(row.id)}
                    isLoading={isLoading}
                />
            </div>

            {selectedVariable && (
                <VariableDetailPanel variable={selectedVariable} />
            )}
        </div>
    )
}
