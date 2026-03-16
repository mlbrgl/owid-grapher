import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom-v5-compat"
import { useQuery } from "@tanstack/react-query"
import {
    ExplorerProgram,
    type ExplorersRouteResponse,
} from "@ourworldindata/explorer"
import type { SerializedGridProgram } from "@ourworldindata/utils"
import { ApiError } from "adminNext/lib/api.js"
import { DataTable } from "adminNext/components/data-table/DataTable.js"
import {
    explorerColumns,
    type ExplorerListItem,
} from "./explorerColumns.js"
import { ExplorerDetailPanel } from "./ExplorerDetailPanel.js"

async function adminFetch<T>(path: string): Promise<T> {
    const res = await fetch(`/admin${path}`)
    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(
            body?.error?.message ?? `Request failed: ${res.statusText}`,
            res.status
        )
    }
    return res.json() as Promise<T>
}

interface ExplorerTagsResponse {
    explorers: { slug: string; tags: { id: number; name: string }[] }[]
}

function deriveExplorerListItem(
    serialized: SerializedGridProgram,
    tagsMap: Map<string, { id: number; name: string }[]>
): ExplorerListItem {
    const explorer = ExplorerProgram.fromJson(serialized)
    const lastCommit = explorer.lastCommit
    return {
        slug: explorer.slug,
        title: explorer.explorerTitle ?? explorer.title ?? "",
        isPublished: explorer.isPublished,
        googleSheet: explorer.googleSheet,
        grapherCount: explorer.grapherCount,
        tableCount: explorer.tableCount,
        lastEditedAt: lastCommit?.date ?? "",
        lastEditedBy: lastCommit?.author_name ?? "",
        commitMessage: lastCommit?.message ?? "",
        tags: tagsMap.get(explorer.slug) ?? [],
    }
}

const PUBLISHED_OPTIONS = [
    { label: "Published", value: "true" },
    { label: "Draft", value: "false" },
]

export function ExplorersScreen() {
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedSlug = searchParams.get("selected")

    const { data: explorersData, isLoading: explorersLoading } = useQuery({
        queryKey: ["explorers"],
        queryFn: () =>
            adminFetch<ExplorersRouteResponse>("/allExplorers.json"),
    })

    const { data: tagsData } = useQuery({
        queryKey: ["explorerTags"],
        queryFn: () =>
            adminFetch<ExplorerTagsResponse>("/allExplorersTags.json"),
    })

    const tagsMap = useMemo(() => {
        const map = new Map<string, { id: number; name: string }[]>()
        if (tagsData?.explorers) {
            for (const entry of tagsData.explorers) {
                map.set(entry.slug, entry.tags)
            }
        }
        return map
    }, [tagsData])

    const explorers: ExplorerListItem[] = useMemo(() => {
        if (!explorersData?.explorers) return []
        return explorersData.explorers
            .map((exp) => deriveExplorerListItem(exp, tagsMap))
            .sort(
                (a, b) =>
                    new Date(b.lastEditedAt).getTime() -
                    new Date(a.lastEditedAt).getTime()
            )
    }, [explorersData, tagsMap])

    const handleRowClick = useCallback(
        (row: ExplorerListItem) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                const current = next.get("selected")
                if (current === row.slug) {
                    next.delete("selected")
                } else {
                    next.set("selected", row.slug)
                }
                return next
            })
        },
        [setSearchParams]
    )

    const selectedExplorer = selectedSlug
        ? explorers.find((e) => e.slug === selectedSlug)
        : undefined

    return (
        <div data-testid="explorers-screen" className="flex h-full">
            <div className="flex-1 overflow-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Explorers</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage and browse all explorers.
                    </p>
                </div>

                <DataTable
                    columns={explorerColumns}
                    data={explorers}
                    searchKey="title"
                    searchPlaceholder="Search explorers..."
                    filterableColumns={[
                        {
                            id: "isPublished",
                            title: "Status",
                            options: PUBLISHED_OPTIONS,
                        },
                    ]}
                    onRowClick={handleRowClick}
                    selectedId={selectedSlug}
                    getRowId={(row) => row.slug}
                    isLoading={explorersLoading}
                />
            </div>

            {selectedExplorer && (
                <ExplorerDetailPanel explorer={selectedExplorer} />
            )}
        </div>
    )
}
