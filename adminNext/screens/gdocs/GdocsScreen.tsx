import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom-v5-compat"
import { useQuery } from "@tanstack/react-query"
import { api } from "adminNext/lib/api.js"
import { DataTable } from "adminNext/components/data-table/DataTable.js"
import { type OwidGdocIndexItem, OwidGdocType } from "@ourworldindata/types"
import { gdocColumns, deriveGdocRow, type GdocRow } from "./gdocColumns.js"
import { GdocDetailPanel } from "./GdocDetailPanel.js"

const GDOC_TYPE_OPTIONS = [
    { label: "Article", value: OwidGdocType.Article },
    { label: "Topic Page", value: OwidGdocType.TopicPage },
    { label: "Linear Topic Page", value: OwidGdocType.LinearTopicPage },
    { label: "Fragment", value: OwidGdocType.Fragment },
    { label: "Data Insight", value: OwidGdocType.DataInsight },
    { label: "Homepage", value: OwidGdocType.Homepage },
    { label: "About Page", value: OwidGdocType.AboutPage },
    { label: "Author", value: OwidGdocType.Author },
    { label: "Announcement", value: OwidGdocType.Announcement },
    { label: "Profile", value: OwidGdocType.Profile },
]

const STATUS_OPTIONS = [
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
]

export function GdocsScreen() {
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedId = searchParams.get("selected")

    const { data: rawData, isLoading } = useQuery({
        queryKey: ["gdocs"],
        queryFn: () => api.get<OwidGdocIndexItem[]>("/gdocs"),
    })

    const gdocs: GdocRow[] = useMemo(
        () => (rawData ?? []).map(deriveGdocRow),
        [rawData]
    )

    const handleRowClick = useCallback(
        (row: GdocRow) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                const current = next.get("selected")
                if (current === row.id) {
                    next.delete("selected")
                } else {
                    next.set("selected", row.id)
                }
                return next
            })
        },
        [setSearchParams]
    )

    const selectedGdoc = selectedId
        ? gdocs.find((g) => g.id === selectedId)
        : undefined

    return (
        <div data-testid="gdocs-screen" className="flex h-full">
            <div className="flex-1 overflow-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Google Docs</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Browse and manage Google Docs content.
                    </p>
                </div>

                <DataTable
                    columns={gdocColumns}
                    data={gdocs}
                    searchKey="title"
                    searchPlaceholder="Search documents..."
                    filterableColumns={[
                        {
                            id: "type",
                            title: "Type",
                            options: GDOC_TYPE_OPTIONS,
                        },
                        {
                            id: "publicationStatus",
                            title: "Status",
                            options: STATUS_OPTIONS,
                        },
                    ]}
                    onRowClick={handleRowClick}
                    selectedId={selectedId}
                    getRowId={(row) => row.id}
                    isLoading={isLoading}
                />
            </div>

            {selectedGdoc && <GdocDetailPanel gdoc={selectedGdoc} />}
        </div>
    )
}
