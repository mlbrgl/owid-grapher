import { useSearchParams } from "react-router-dom-v5-compat"
import { useCallback } from "react"
import { X, ExternalLink, Pencil, Calendar, User, Link2 } from "lucide-react"
import { Badge } from "adminNext/components/ui/badge"
import { Button } from "adminNext/components/ui/button"
import { Separator } from "adminNext/components/ui/separator"
import { type NarrativeChartListItem } from "./narrativeChartColumns.js"

function formatDate(dateStr: string | null): string {
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

export function NarrativeChartDetailPanel({
    narrativeChart,
}: {
    narrativeChart: NarrativeChartListItem
}) {
    const [, setSearchParams] = useSearchParams()

    const close = useCallback(() => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev)
            next.delete("selected")
            return next
        })
    }, [setSearchParams])

    return (
        <div
            data-testid="narrative-chart-detail-panel"
            className="w-[40%] shrink-0 border-l bg-background flex flex-col overflow-hidden"
        >
            <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-sm font-semibold">
                    Narrative Chart Details
                </h2>
                <button
                    onClick={close}
                    className="rounded-md p-1 hover:bg-accent"
                >
                    <X className="size-4" />
                </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                    {/* Title & name */}
                    <div>
                        <h3 className="text-base font-semibold leading-tight">
                            {narrativeChart.title}
                        </h3>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                            {narrativeChart.name}
                        </p>
                    </div>

                    {/* Parent type badge */}
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                            {narrativeChart.parent.type === "multiDim"
                                ? "Multi-dim"
                                : "Chart"}
                        </Badge>
                    </div>

                    <Separator />

                    {/* Metadata */}
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Link2 className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Parent
                            </span>
                            <span className="font-medium truncate">
                                {narrativeChart.parent.url ? (
                                    <a
                                        href={narrativeChart.parent.url}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {narrativeChart.parent.title}
                                    </a>
                                ) : (
                                    narrativeChart.parent.title
                                )}
                            </span>
                        </div>
                        {narrativeChart.lastEditedByUser && (
                            <div className="flex items-center gap-2">
                                <User className="size-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    Last edited by
                                </span>
                                <span className="font-medium">
                                    {narrativeChart.lastEditedByUser}
                                </span>
                            </div>
                        )}
                        {narrativeChart.updatedAt && (
                            <div className="flex items-center gap-2">
                                <Calendar className="size-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    Last edited
                                </span>
                                <span>
                                    {formatDate(narrativeChart.updatedAt)}
                                </span>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href={`/admin/narrative-charts/${narrativeChart.id}/edit`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </a>
                        </Button>
                        {narrativeChart.parent.url && (
                            <Button variant="outline" size="sm" asChild>
                                <a
                                    href={narrativeChart.parent.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="mr-2 size-4" />
                                    View parent
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
