import {
    ExternalLink,
    Pencil,
    Calendar,
    User,
    BarChart3,
    Database,
} from "lucide-react"
import { Badge } from "adminNext/components/ui/badge"
import { Button } from "adminNext/components/ui/button"
import { Separator } from "adminNext/components/ui/separator"
import { DetailPanelShell } from "adminNext/components/shell/DetailPanelShell.js"
import { type DatasetListItem } from "./datasetColumns.js"

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

export function DatasetDetailPanel({
    dataset,
}: {
    dataset: DatasetListItem
}) {
    return (
        <DetailPanelShell title="Dataset Details">
            <div
                data-testid="dataset-detail-panel"
                className="space-y-4"
            >
                {/* Name & short name */}
                <div>
                    <h3 className="text-base font-semibold leading-tight">
                        {dataset.name}
                    </h3>
                    {dataset.shortName && (
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                            {dataset.shortName}
                        </p>
                    )}
                </div>

                {/* Namespace & status badges */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{dataset.namespace}</Badge>
                    {dataset.isPrivate && (
                        <Badge variant="secondary">Private</Badge>
                    )}
                    {dataset.nonRedistributable && (
                        <Badge variant="destructive">
                            Non-redistributable
                        </Badge>
                    )}
                    {dataset.version && (
                        <Badge variant="outline">v{dataset.version}</Badge>
                    )}
                </div>

                <Separator />

                {/* Metadata */}
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Database className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Namespace
                        </span>
                        <span className="font-medium">
                            {dataset.namespace}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BarChart3 className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Charts</span>
                        <span>{dataset.numCharts ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Data edited by
                        </span>
                        <span className="font-medium">
                            {dataset.dataEditedByUserName}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Data edited
                        </span>
                        <span>{formatDate(dataset.dataEditedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Metadata edited by
                        </span>
                        <span className="font-medium">
                            {dataset.metadataEditedByUserName}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Metadata edited
                        </span>
                        <span>{formatDate(dataset.metadataEditedAt)}</span>
                    </div>
                </div>

                {/* Description */}
                {dataset.description && (
                    <>
                        <Separator />
                        <div>
                            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Description
                            </h4>
                            <p className="text-sm">{dataset.description}</p>
                        </div>
                    </>
                )}

                {/* Tags */}
                {dataset.tags && dataset.tags.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Tags
                            </h4>
                            <div className="flex flex-wrap gap-1">
                                {dataset.tags.map((tag) => (
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
                            href={`/admin/datasets/${dataset.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Pencil className="mr-2 size-4" />
                            Edit in Admin
                        </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a
                            href={`/admin/datasets/${dataset.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-2 size-4" />
                            View Details
                        </a>
                    </Button>
                </div>
            </div>
        </DetailPanelShell>
    )
}
