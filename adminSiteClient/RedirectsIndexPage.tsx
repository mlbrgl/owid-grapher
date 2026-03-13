import { useContext, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AdminLayout } from "./AdminLayout.js"
import { Link } from "./Link.js"
import { AdminAppContext } from "./AdminAppContext.js"
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

interface RedirectListItem {
    id: number
    slug: string
    chartId: number
    chartSlug: string
}

async function fetchRedirects(admin: Admin): Promise<RedirectListItem[]> {
    const json = await admin.getJSON<{ redirects: RedirectListItem[] }>(
        "/api/redirects.json"
    )
    return json.redirects
}

async function deleteRedirect(admin: Admin, id: number): Promise<void> {
    const json = await admin.requestJSON<{ success: boolean }>(
        `/api/redirects/${id}`,
        {},
        "DELETE"
    )
    if (!json.success) {
        throw new Error("Failed to delete redirect")
    }
}

export function RedirectsIndexPage() {
    const { admin } = useContext(AdminAppContext)
    const queryClient = useQueryClient()

    useEffect(() => {
        admin.loadingIndicatorSetting = "off"
        return () => {
            admin.loadingIndicatorSetting = "default"
        }
    }, [admin])

    const { data: redirects } = useQuery({
        queryKey: ["chartRedirects"],
        queryFn: () => fetchRedirects(admin),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteRedirect(admin, id),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["chartRedirects"] }),
    })

    function handleDelete(redirect: RedirectListItem) {
        if (
            !window.confirm(
                `Delete the redirect from ${redirect.slug}? This action may break existing embeds!`
            )
        )
            return

        deleteMutation.mutate(redirect.id)
    }

    return (
        <AdminLayout title="Chart Redirects">
            <main className="RedirectsIndexPage">
                <p className="mb-2 text-sm text-muted-foreground">
                    Showing {redirects?.length ?? 0} redirects
                </p>
                <p className="mb-4">
                    Redirects are automatically created when the slug of a
                    published chart is changed.
                </p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Slug</TableHead>
                            <TableHead>Redirects To</TableHead>
                            <TableHead className="w-[100px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {redirects?.map((redirect) => (
                            <TableRow key={redirect.id}>
                                <TableCell>{redirect.slug}</TableCell>
                                <TableCell>
                                    <Link
                                        to={`/charts/${redirect.chartId}/edit`}
                                    >
                                        {redirect.chartSlug}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(redirect)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </main>
        </AdminLayout>
    )
}
