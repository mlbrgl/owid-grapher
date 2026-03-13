import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import * as React from "react"

import { AdminLayout } from "./AdminLayout.js"
import { AdminAppContext } from "./AdminAppContext.js"
import { Timeago } from "./Forms.js"
import { ApiNarrativeChartOverview } from "../adminShared/AdminTypes.js"
import { GRAPHER_DYNAMIC_THUMBNAIL_URL } from "../settings/clientSettings.js"
import { Link } from "./Link.js"
import {
    buildSearchWordsFromSearchString,
    filterFunctionForSearchWords,
    highlightFunctionForSearchWords,
} from "../adminShared/search.js"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./components/ui/table.js"
import { Button } from "./components/ui/button.js"
import { Input } from "./components/ui/input.js"

type SortField = "updatedAt"
type SortDirection = "asc" | "desc"

export function NarrativeChartIndexPage() {
    const { admin } = useContext(AdminAppContext)
    const [narrativeCharts, setNarrativeCharts] = useState<
        ApiNarrativeChartOverview[]
    >([])
    const [searchValue, setSearchValue] = useState("")
    const [sortField, setSortField] = useState<SortField>("updatedAt")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

    const searchWords = useMemo(
        () => buildSearchWordsFromSearchString(searchValue),
        [searchValue]
    )

    const filteredNarrativeCharts = useMemo(() => {
        const filterFn = filterFunctionForSearchWords(
            searchWords,
            (narrativeChart: ApiNarrativeChartOverview) => [
                `${narrativeChart.id}`,
                narrativeChart.title,
                narrativeChart.name,
                narrativeChart.parent.title,
            ]
        )

        const filtered = narrativeCharts.filter(filterFn)

        filtered.sort((a, b) => {
            if (sortField === "updatedAt") {
                if (!a.updatedAt || !b.updatedAt) return 0
                const diff =
                    new Date(a.updatedAt).getTime() -
                    new Date(b.updatedAt).getTime()
                return sortDirection === "asc" ? diff : -diff
            }
            return 0
        })

        return filtered
    }, [narrativeCharts, searchWords, sortField, sortDirection])

    const highlightFn = useMemo(
        () => highlightFunctionForSearchWords(searchWords),
        [searchWords]
    )

    const handleDelete = useCallback(
        async (narrativeChartId: number) => {
            if (
                confirm("Are you sure you want to delete this narrative chart?")
            ) {
                await admin
                    .requestJSON(
                        `/api/narrative-charts/${narrativeChartId}`,
                        {},
                        "DELETE"
                    )
                    .then(() => alert("Narrative chart deleted"))
                    .then(() => window.location.reload())
            }
        },
        [admin]
    )

    function toggleSort(field: SortField) {
        if (sortField === field) {
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
        } else {
            setSortField(field)
            setSortDirection("desc")
        }
    }

    useEffect(() => {
        const getNarrativeCharts = async () =>
            await admin.getJSON<{
                narrativeCharts: ApiNarrativeChartOverview[]
            }>("/api/narrative-charts")

        void getNarrativeCharts().then((res) =>
            setNarrativeCharts(res.narrativeCharts)
        )
    }, [admin])

    return (
        <AdminLayout title="Narrative charts">
            <main className="NarrativeChartIndexPage">
                <div className="mb-4 flex items-center justify-between">
                    <Input
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="max-w-md"
                    />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">
                                Preview
                            </TableHead>
                            <TableHead className="w-[150px]">Name</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="w-[50px]">ID</TableHead>
                            <TableHead className="w-[200px]">
                                Parent
                            </TableHead>
                            <TableHead
                                className="w-[150px] cursor-pointer select-none"
                                onClick={() => toggleSort("updatedAt")}
                            >
                                Last updated{" "}
                                {sortField === "updatedAt" &&
                                    (sortDirection === "desc" ? "↓" : "↑")}
                            </TableHead>
                            <TableHead className="w-[100px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredNarrativeCharts.map((nc) => (
                            <TableRow key={nc.id}>
                                <TableCell>
                                    <img
                                        src={`${GRAPHER_DYNAMIC_THUMBNAIL_URL}/by-uuid/${nc.chartConfigId}.svg`}
                                        className="max-h-[200px] max-w-[200px]"
                                    />
                                </TableCell>
                                <TableCell>{highlightFn(nc.name)}</TableCell>
                                <TableCell>{highlightFn(nc.title)}</TableCell>
                                <TableCell>{nc.id}</TableCell>
                                <TableCell>
                                    <ParentLink
                                        parent={nc.parent}
                                        highlightFn={highlightFn}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Timeago
                                        time={nc.updatedAt}
                                        by={nc.lastEditedByUser}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" asChild>
                                            <Link
                                                to={`/narrative-charts/${nc.id}/edit`}
                                            >
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                void handleDelete(nc.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </main>
        </AdminLayout>
    )
}

function ParentLink({
    parent,
    highlightFn,
}: {
    parent: ApiNarrativeChartOverview["parent"]
    highlightFn: (
        text: string | null | undefined
    ) => React.ReactElement | string
}) {
    const title = highlightFn(parent.title)
    if (!parent.url) return <>{title}</>
    return parent.type === "chart" ? (
        <Link to={parent.url}>{title}</Link>
    ) : (
        <a href={`/admin${parent.url}`} target="_blank" rel="noopener">
            {title}
        </a>
    )
}
