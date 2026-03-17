import { useQuery } from "@tanstack/react-query"
import {
    ExternalLink,
    Pencil,
    Calendar,
    FolderTree,
    ArrowRightLeft,
} from "lucide-react"
import { Badge } from "adminNext/components/ui/badge"
import { Button } from "adminNext/components/ui/button"
import { Separator } from "adminNext/components/ui/separator"
import { api } from "adminNext/lib/api.js"
import { DetailPanelShell } from "adminNext/components/shell/DetailPanelShell.js"
import { type MultiDimListItem } from "./multiDimColumns.js"

interface MultiDimRedirect {
    id: number
    source: string
    viewConfigId: string | null
}

interface MultiDimRedirectsResponse {
    redirects: MultiDimRedirect[]
}

function formatDate(dateStr: string): string {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export function MultiDimDetailPanel({
    multiDim,
}: {
    multiDim: MultiDimListItem
}) {
    const { data: redirectsData } = useQuery({
        queryKey: ["multiDimRedirects", multiDim.id],
        queryFn: () =>
            api.get<MultiDimRedirectsResponse>(
                `/multi-dims/${multiDim.id}/redirects`
            ),
        enabled: multiDim.published,
    })

    const redirects = redirectsData?.redirects ?? []

    return (
        <DetailPanelShell
            title="Multi-dim Details"
            testId="multi-dim-detail-panel"
        >
            <div className="space-y-4">
                {/* Title & slug */}
                <div>
                    <h3 className="text-base font-semibold leading-tight">
                        {multiDim.title || "Untitled"}
                    </h3>
                    {multiDim.slug && (
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                            {multiDim.slug}
                        </p>
                    )}
                </div>

                {/* Status badge */}
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant={multiDim.published ? "default" : "secondary"}
                    >
                        {multiDim.published ? "Published" : "Draft"}
                    </Badge>
                </div>

                <Separator />

                {/* Metadata */}
                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                        <FolderTree className="mt-0.5 size-4 text-muted-foreground" />
                        <div>
                            <span className="text-muted-foreground">
                                Catalog path
                            </span>
                            <p className="font-mono text-xs break-all">
                                {multiDim.catalogPath}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Last updated
                        </span>
                        <span>{formatDate(multiDim.updatedAt)}</span>
                    </div>
                </div>

                {/* Redirects */}
                {multiDim.published && redirects.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Redirects
                            </h4>
                            <div className="space-y-1">
                                {redirects.map((redirect) => (
                                    <div
                                        key={redirect.id}
                                        className="flex items-center gap-2 text-xs"
                                    >
                                        <ArrowRightLeft className="size-3 text-muted-foreground" />
                                        <span className="font-mono truncate">
                                            {redirect.source}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <Separator />

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <a
                            href={`/admin/grapher/${encodeURIComponent(multiDim.catalogPath)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Pencil className="mr-2 size-4" />
                            Edit in Grapher
                        </a>
                    </Button>
                    {multiDim.published && multiDim.slug && (
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href={`/grapher/${multiDim.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="mr-2 size-4" />
                                View on site
                            </a>
                        </Button>
                    )}
                    {multiDim.published && (
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href={`/admin/multi-dims/${multiDim.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ArrowRightLeft className="mr-2 size-4" />
                                Manage redirects
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </DetailPanelShell>
    )
}
