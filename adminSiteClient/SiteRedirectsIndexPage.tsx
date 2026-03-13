import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useContext, useEffect, useMemo, useState } from "react"
import { Info } from "lucide-react"
import { BAKED_BASE_URL } from "../settings/clientSettings.js"
import { AdminAppContext } from "./AdminAppContext.js"
import { AdminLayout } from "./AdminLayout.js"
import { Link } from "./Link.js"
import { Admin } from "./Admin.js"
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
import { Label } from "./components/ui/label.js"
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert.js"

const SOURCE_PATTERN = /^\/$|^\/.*[^/]+$/
const INVALID_SOURCE_MESSAGE =
    "URL must start with a slash and cannot end with a slash, unless it's the root."
const TARGET_PATTERN = /^\/$|^(https?:\/\/|\/).*[^/]+$/
const INVALID_TARGET_MESSAGE =
    "URL must start with a slash or http(s):// and cannot end with a slash, unless it's the root."

const PAGE_SIZE = 20

type Redirect = {
    id: number
    source: string
    target: string
}

type FormErrors = {
    source?: string
    target?: string
}

async function fetchRedirects(admin: Admin): Promise<Redirect[]> {
    const { redirects } = await admin.getJSON<{ redirects: Redirect[] }>(
        "/api/site-redirects.json"
    )
    return redirects
}

async function createRedirect(
    admin: Admin,
    data: { source: string; target: string }
): Promise<Redirect> {
    const sourceUrl = new URL(data.source, window.location.origin)
    const sourcePath = sourceUrl.pathname
    const json = await admin.requestJSON<{
        success: boolean
        redirect: Redirect
    }>(
        "/api/site-redirects/new",
        { source: sourcePath, target: data.target },
        "POST"
    )
    if (!json.success) {
        throw new Error("Failed to create redirect")
    }
    return json.redirect
}

async function deleteRedirect(admin: Admin, id: number): Promise<void> {
    const json = await admin.requestJSON<{ success: boolean }>(
        `/api/site-redirects/${id}`,
        {},
        "DELETE"
    )
    if (!json.success) {
        throw new Error("Failed to delete redirect")
    }
}

function validateForm(source: string, target: string): FormErrors {
    const errors: FormErrors = {}

    if (!source) {
        errors.source = "Please provide a source."
    } else if (!SOURCE_PATTERN.test(source)) {
        errors.source = INVALID_SOURCE_MESSAGE
    } else {
        const sourceUrl = new URL(source, "https://ourworldindata.org")
        if (sourceUrl.pathname === "/") {
            errors.source = "Source cannot be the root."
        } else if (source === target) {
            errors.source = "Source and target cannot be the same."
        }
    }

    if (!target) {
        errors.target = "Please provide a target."
    } else if (!TARGET_PATTERN.test(target)) {
        errors.target = INVALID_TARGET_MESSAGE
    } else if (target === source) {
        errors.target = "Source and target cannot be the same."
    }

    return errors
}

export default function SiteRedirectsIndexPage() {
    const { admin } = useContext(AdminAppContext)
    const queryClient = useQueryClient()

    const [source, setSource] = useState("")
    const [target, setTarget] = useState("")
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)
    const [statusMessage, setStatusMessage] = useState<{
        type: "success" | "error"
        text: string
    } | null>(null)

    useEffect(() => {
        admin.loadingIndicatorSetting = "off"
        return () => {
            admin.loadingIndicatorSetting = "default"
        }
    }, [admin])

    // Clear status message after 3 seconds
    useEffect(() => {
        if (!statusMessage) return
        const timer = setTimeout(() => setStatusMessage(null), 3000)
        return () => clearTimeout(timer)
    }, [statusMessage])

    const { data: redirects } = useQuery({
        queryKey: ["siteRedirects"],
        queryFn: () => fetchRedirects(admin),
    })

    const createMutation = useMutation({
        mutationFn: (data: { source: string; target: string }) =>
            createRedirect(admin, data),
        onSuccess: async () => {
            setStatusMessage({ type: "success", text: "Redirect created" })
            setSource("")
            setTarget("")
            setFormErrors({})
            return queryClient.invalidateQueries({
                queryKey: ["siteRedirects"],
            })
        },
        onError: () => {
            setStatusMessage({
                type: "error",
                text: "Error creating redirect",
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteRedirect(admin, id),
        onSuccess: async () => {
            setStatusMessage({ type: "success", text: "Redirect deleted" })
            return queryClient.invalidateQueries({
                queryKey: ["siteRedirects"],
            })
        },
        onError: () => {
            setStatusMessage({
                type: "error",
                text: "Error deleting redirect",
            })
        },
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const errors = validateForm(source, target)
        setFormErrors(errors)
        if (Object.keys(errors).length > 0) return
        createMutation.mutate({ source, target })
    }

    function handleDelete(redirect: Redirect) {
        if (!window.confirm(`Delete the redirect from ${redirect.source}?`))
            return
        deleteMutation.mutate(redirect.id)
    }

    const filteredRedirects = useMemo(() => {
        const query = search.trim().toLowerCase()
        return redirects?.filter((redirect) =>
            [redirect.source, redirect.target].some((field) =>
                field.toLowerCase().includes(query)
            )
        )
    }, [redirects, search])

    // Reset page when search changes
    useEffect(() => {
        setPage(0)
    }, [search])

    const totalFiltered = filteredRedirects?.length ?? 0
    const totalPages = Math.ceil(totalFiltered / PAGE_SIZE)
    const paginatedRedirects = filteredRedirects?.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    )

    return (
        <AdminLayout title="Site Redirects">
            <main className="space-y-6">
                <Alert>
                    <Info className="size-4" />
                    <AlertTitle>About Site Redirects</AlertTitle>
                    <AlertDescription>
                        <p>
                            This page is used to create and delete redirects for
                            the site.
                        </p>
                        <ul className="list-disc pl-5">
                            <li>
                                For redirects to <strong>charts</strong>, create
                                redirects on the edit page of the target chart
                                ref tab, and delete redirects on{" "}
                                <Link to="/redirects">
                                    the chart redirects page
                                </Link>
                                .
                            </li>
                            <li>
                                For redirects to <strong>multi-dims</strong>,
                                create redirects on the edit page of the target
                                multi-dim, and view all redirects on{" "}
                                <Link to="/multi-dim-redirects">
                                    the multi-dim redirects page
                                </Link>
                                .
                            </li>
                        </ul>
                        <p>
                            The source has to start with a slash. Any query
                            parameters (/war-and-peace
                            <span className="underline">
                                ?insight=insightid
                            </span>
                            ) or fragments (/war-and-peace
                            <span className="underline">#all-charts</span>) will
                            be stripped, if present.
                        </p>
                        <p>
                            The target can point to a full URL at another domain
                            or a relative URL starting with a slash and both
                            query parameters and fragments are allowed.
                        </p>
                        <p>
                            To redirect to our homepage use a single slash as
                            the target.
                        </p>
                    </AlertDescription>
                </Alert>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-wrap items-end gap-4"
                >
                    <div className="min-w-[400px] space-y-1.5">
                        <Label htmlFor="source">Source</Label>
                        <Input
                            id="source"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            placeholder="/fertility-can-decline-extremely-fast"
                            aria-invalid={!!formErrors.source}
                        />
                        {formErrors.source && (
                            <p className="text-sm text-destructive">
                                {formErrors.source}
                            </p>
                        )}
                    </div>
                    <div className="min-w-[400px] space-y-1.5">
                        <Label htmlFor="target">Target</Label>
                        <Input
                            id="target"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="/fertility-rate"
                            aria-invalid={!!formErrors.target}
                        />
                        {formErrors.target && (
                            <p className="text-sm text-destructive">
                                {formErrors.target}
                            </p>
                        )}
                    </div>
                    <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Creating..." : "Create"}
                    </Button>
                </form>

                {statusMessage && (
                    <p
                        className={
                            statusMessage.type === "success"
                                ? "text-sm text-green-600"
                                : "text-sm text-destructive"
                        }
                    >
                        {statusMessage.text}
                    </p>
                )}

                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-6">
                        <Input
                            placeholder="Search by source or target"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-[400px]"
                            autoFocus
                        />
                        <span className="text-sm text-muted-foreground">
                            Showing {totalFiltered} of {redirects?.length ?? 0}{" "}
                            redirects
                        </span>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Source</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead className="w-[100px]" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedRedirects?.map((redirect) => {
                                const targetUrl = new URL(
                                    redirect.target,
                                    BAKED_BASE_URL
                                )
                                return (
                                    <TableRow key={redirect.id}>
                                        <TableCell className="break-all whitespace-normal">
                                            {redirect.source}
                                        </TableCell>
                                        <TableCell className="break-all whitespace-normal">
                                            <a
                                                href={targetUrl.href}
                                                target="_blank"
                                                rel="noopener"
                                            >
                                                {redirect.target}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(redirect)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 0}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page + 1} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page >= totalPages - 1}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </AdminLayout>
    )
}
