import { ExternalLink, Hash, Tag, Layers } from "lucide-react"
import { Badge } from "adminNext/components/ui/badge"
import { Button } from "adminNext/components/ui/button"
import { Separator } from "adminNext/components/ui/separator"
import { DetailPanelShell } from "adminNext/components/shell/DetailPanelShell.js"
import { type FeaturedMetricListItem } from "./featuredMetricColumns.js"

const INCOME_GROUP_LABELS: Record<string, string> = {
    default: "Default",
    high: "High",
    "upper-middle": "Upper-middle",
    "lower-middle": "Lower-middle",
    low: "Low",
}

export function FeaturedMetricDetailPanel({
    metric,
}: {
    metric: FeaturedMetricListItem
}) {
    return (
        <DetailPanelShell title="Featured Metric Details">
            <div
                data-testid="featured-metric-detail-panel"
                className="space-y-4"
            >
                {/* URL */}
                <div>
                    <h3 className="text-base font-semibold leading-tight break-all">
                        {metric.url}
                    </h3>
                </div>

                {/* Income group badge */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                        {INCOME_GROUP_LABELS[metric.incomeGroup] ??
                            metric.incomeGroup}
                    </Badge>
                </div>

                <Separator />

                {/* Metadata */}
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Tag className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Topic</span>
                        <span className="font-medium">
                            {metric.parentTagName}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Hash className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Ranking</span>
                        <span className="tabular-nums">{metric.ranking}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Layers className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Income group
                        </span>
                        <span>
                            {INCOME_GROUP_LABELS[metric.incomeGroup] ??
                                metric.incomeGroup}
                        </span>
                    </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <a
                            href={metric.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-2 size-4" />
                            View chart
                        </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a
                            href={`/admin/featured-metrics`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-2 size-4" />
                            Edit in legacy admin
                        </a>
                    </Button>
                </div>
            </div>
        </DetailPanelShell>
    )
}
