import {
    ExternalLink,
    Eye,
    Pencil,
    Calendar,
    User,
    BarChart3,
} from "lucide-react"
import { Badge } from "adminNext/components/ui/badge"
import { Button } from "adminNext/components/ui/button"
import { Separator } from "adminNext/components/ui/separator"
import { DetailPanelShell } from "adminNext/components/shell/DetailPanelShell.js"
import { type ChartListItem } from "./chartColumns.js"

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

function formatChartType(type: string | undefined): string {
    if (!type) return "Unknown"
    const typeMap: Record<string, string> = {
        LineChart: "Line Chart",
        DiscreteBar: "Bar Chart",
        StackedArea: "Stacked Area",
        StackedBar: "Stacked Bar",
        ScatterPlot: "Scatter Plot",
        SlopeChart: "Slope Chart",
        Marimekko: "Marimekko",
    }
    return typeMap[type] ?? type
}

export function ChartDetailPanel({ chart }: { chart: ChartListItem }) {
    return (
        <DetailPanelShell title="Chart Details" testId="chart-detail-panel">
            <div className="space-y-4">
                {/* Title & slug */}
                <div>
                    <h3 className="text-base font-semibold leading-tight">
                        {chart.title}
                    </h3>
                    {chart.variantName && (
                        <p className="text-sm text-muted-foreground">
                            {chart.variantName}
                        </p>
                    )}
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {chart.slug}
                    </p>
                </div>

                {/* Status & type badges */}
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant={chart.isPublished ? "default" : "secondary"}
                    >
                        {chart.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="outline">
                        {formatChartType(chart.type)}
                    </Badge>
                    {chart.hasMapTab && <Badge variant="outline">Map</Badge>}
                </div>

                <Separator />

                {/* Metadata */}
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Last edited by
                        </span>
                        <span className="font-medium">
                            {chart.lastEditedBy}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Last edited
                        </span>
                        <span>{formatDate(chart.lastEditedAt)}</span>
                    </div>
                    {chart.publishedBy && (
                        <div className="flex items-center gap-2">
                            <User className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Published by
                            </span>
                            <span className="font-medium">
                                {chart.publishedBy}
                            </span>
                        </div>
                    )}
                    {chart.publishedAt && (
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Published
                            </span>
                            <span>{formatDate(chart.publishedAt)}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Eye className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Views/day</span>
                        <span>
                            {chart.grapherViewsPerDay
                                ? chart.grapherViewsPerDay.toLocaleString()
                                : "—"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BarChart3 className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            References
                        </span>
                        <span>{chart.referencesCount ?? 0}</span>
                    </div>
                </div>

                {/* Internal notes */}
                {chart.internalNotes && (
                    <>
                        <Separator />
                        <div>
                            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Internal Notes
                            </h4>
                            <p className="text-sm">{chart.internalNotes}</p>
                        </div>
                    </>
                )}

                {/* Tags */}
                {chart.tags && chart.tags.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Tags
                            </h4>
                            <div className="flex flex-wrap gap-1">
                                {chart.tags.map((tag) => (
                                    <Badge
                                        key={tag.id}
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {tag.name}
                                    </Badge>
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
                            href={`/admin/charts/${chart.id}/edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Pencil className="mr-2 size-4" />
                            Edit in Grapher
                        </a>
                    </Button>
                    {chart.isPublished && chart.slug && (
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href={`/grapher/${chart.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="mr-2 size-4" />
                                View on site
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </DetailPanelShell>
    )
}
