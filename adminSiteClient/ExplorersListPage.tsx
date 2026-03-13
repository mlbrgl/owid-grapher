import { useContext, useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { dayjs, SerializedGridProgram } from "@ourworldindata/utils"
import {
    DefaultNewExplorerSlug,
    EXPLORERS_PREVIEW_ROUTE,
    EXPLORERS_ROUTE_FOLDER,
    GetAllExplorersRoute,
    UNSAVED_EXPLORER_DRAFT,
    ExplorerProgram,
} from "@ourworldindata/explorer"
import { BAKED_BASE_URL } from "../settings/clientSettings.js"
import { AdminAppContext } from "./AdminAppContext.js"
import { Admin } from "./Admin.js"
import { AdminLayout } from "./AdminLayout.js"
import { Input } from "./components/ui/input.js"
import { Button } from "./components/ui/button.js"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./components/ui/table.js"

async function fetchExplorers(admin: Admin): Promise<ExplorerProgram[]> {
    const response = await admin.getJSON<{
        success: boolean
        errorMessage?: string
        explorers: SerializedGridProgram[]
    }>(GetAllExplorersRoute)
    return response.explorers.map((exp) => ExplorerProgram.fromJson(exp))
}

async function togglePublished(
    admin: Admin,
    explorer: ExplorerProgram
): Promise<void> {
    const newVersion = explorer.setPublished(!explorer.isPublished)
    const commitMessage = `Setting publish status of ${explorer.slug} to ${newVersion.isPublished}`
    const res = await admin.requestJSON<{ success: boolean; error?: string }>(
        `/api/explorers/${explorer.slug}`,
        {
            tsv: newVersion.toString(),
            commitMessage,
        },
        "PUT"
    )
    if (!res.success) {
        throw new Error(res.error ?? "Failed to update explorer")
    }
}

async function deleteExplorer(admin: Admin, slug: string): Promise<void> {
    await admin.requestJSON(`/api/explorers/${slug}`, {}, "DELETE")
}

function highlightMatch(text: string, search: string): React.ReactNode {
    if (!search) return text
    const escaped = search.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
    const html = text.replace(new RegExp(escaped, "i"), (s) => `<b>${s}</b>`)
    return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export function ExplorersIndexPage() {
    const { admin } = useContext(AdminAppContext)
    const queryClient = useQueryClient()
    const [searchInput, setSearchInput] = useState("")
    const [maxVisibleRows, setMaxVisibleRows] = useState(50)

    useEffect(() => {
        admin.loadingIndicatorSetting = "off"
        return () => {
            admin.loadingIndicatorSetting = "default"
        }
    }, [admin])

    const { data: explorers } = useQuery({
        queryKey: ["explorers"],
        queryFn: () => fetchExplorers(admin),
    })

    const publishMutation = useMutation({
        mutationFn: (explorer: ExplorerProgram) =>
            togglePublished(admin, explorer),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["explorers"] }),
    })

    const deleteMutation = useMutation({
        mutationFn: (slug: string) => deleteExplorer(admin, slug),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["explorers"] }),
    })

    const filteredExplorers = useMemo(() => {
        if (!explorers) return []
        let filtered = explorers
        if (searchInput) {
            const lower = searchInput.toLowerCase()
            filtered = explorers.filter((exp) => {
                const title = exp.explorerTitle ?? exp.title ?? ""
                return (
                    exp.slug.toLowerCase().includes(lower) ||
                    title.toLowerCase().includes(lower)
                )
            })
        }
        return filtered.sort((a, b) => {
            const dateA = a.lastCommit?.date
                ? dayjs(a.lastCommit.date).unix()
                : 0
            const dateB = b.lastCommit?.date
                ? dayjs(b.lastCommit.date).unix()
                : 0
            return dateB - dateA
        })
    }, [explorers, searchInput])

    const visibleExplorers = filteredExplorers.slice(0, maxVisibleRows)

    function handleDelete(slug: string) {
        if (!window.confirm(`Are you sure you want to delete "${slug}"?`))
            return
        deleteMutation.mutate(slug)
    }

    return (
        <AdminLayout title="Explorers">
            <main>
                <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {visibleExplorers.length} of{" "}
                        {filteredExplorers.length} explorers
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            type="search"
                            placeholder="Search explorers..."
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value)
                                setMaxVisibleRows(50)
                            }}
                            className="w-64"
                        />
                        <Button asChild>
                            <a
                                href={`/admin/${EXPLORERS_ROUTE_FOLDER}/${DefaultNewExplorerSlug}`}
                            >
                                Create
                            </a>
                        </Button>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Slug</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="w-[80px]" />
                            <TableHead className="w-[100px]" />
                            <TableHead className="w-[80px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visibleExplorers.map((explorer) => {
                            const {
                                slug,
                                lastCommit,
                                googleSheet,
                                isPublished,
                                explorerTitle,
                                title,
                                grapherCount,
                                tableCount,
                            } = explorer

                            const publishedUrl = `${BAKED_BASE_URL}/${EXPLORERS_ROUTE_FOLDER}/${slug}`
                            const titleToShow = explorerTitle ?? title ?? ""
                            const hasEdits = localStorage.getItem(
                                `${UNSAVED_EXPLORER_DRAFT}${slug}`
                            )

                            return (
                                <TableRow key={slug}>
                                    <TableCell>
                                        {!isPublished ? (
                                            <span className="text-muted-foreground">
                                                {highlightMatch(
                                                    slug,
                                                    searchInput
                                                )}
                                            </span>
                                        ) : (
                                            <a href={publishedUrl}>
                                                {highlightMatch(
                                                    slug,
                                                    searchInput
                                                )}
                                            </a>
                                        )}
                                        {" - "}
                                        <a
                                            href={`/admin/${EXPLORERS_PREVIEW_ROUTE}/${slug}`}
                                        >
                                            Preview
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {highlightMatch(
                                            titleToShow,
                                            searchInput
                                        )}
                                        <div className="text-xs text-muted-foreground">
                                            {`${grapherCount} grapher${
                                                grapherCount > 1 ? "s" : ""
                                            }. ${tableCount} table${tableCount === 1 ? "" : "s"}.`}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>{lastCommit?.message}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {lastCommit
                                                ? dayjs(
                                                      lastCommit.date
                                                  ).fromNow()
                                                : ""}{" "}
                                            by {lastCommit?.author_name}
                                            {googleSheet && (
                                                <>
                                                    {" | "}
                                                    <a href={googleSheet}>
                                                        Google Sheet
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={`${EXPLORERS_ROUTE_FOLDER}/${slug}`}
                                                title={
                                                    hasEdits
                                                        ? "*You have local edits"
                                                        : ""
                                                }
                                            >
                                                Edit
                                                {hasEdits ? "*" : ""}
                                            </a>
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                publishMutation.mutate(explorer)
                                            }
                                        >
                                            {isPublished
                                                ? "Unpublish"
                                                : "Publish"}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(slug)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                {visibleExplorers.length < filteredExplorers.length && (
                    <div className="mt-4 text-center">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setMaxVisibleRows((prev) => prev + 100)
                            }
                        >
                            Show more
                        </Button>
                    </div>
                )}
            </main>
        </AdminLayout>
    )
}
