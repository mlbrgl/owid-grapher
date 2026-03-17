import {
    ExternalLink,
    Pencil,
    Calendar,
    User,
    BarChart3,
    Lock,
    Globe,
} from "lucide-react"
import { Badge } from "adminNext/components/ui/badge"
import { Button } from "adminNext/components/ui/button"
import { Separator } from "adminNext/components/ui/separator"
import { DetailPanelShell } from "adminNext/components/shell/DetailPanelShell.js"
import { type VariableListItem } from "./variableColumns.js"

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

export function VariableDetailPanel({
    variable,
}: {
    variable: VariableListItem
}) {
    return (
        <DetailPanelShell title="Variable Details" testId="variable-detail-panel">
            <div className="space-y-4">
                {/* Name */}
                <div>
                    <h3 className="text-base font-semibold leading-tight">
                        {variable.name}
                    </h3>
                    {variable.catalogPath && (
                        <p className="mt-1 font-mono text-xs text-muted-foreground break-all">
                            {variable.catalogPath}
                        </p>
                    )}
                </div>

                {/* Access badge */}
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant={variable.isPrivate ? "secondary" : "default"}
                    >
                        {variable.isPrivate ? "Private" : "Public"}
                    </Badge>
                    {variable.nonRedistributable && (
                        <Badge variant="destructive">Non-redistributable</Badge>
                    )}
                </div>

                <Separator />

                {/* Metadata */}
                <div className="space-y-3 text-sm">
                    {variable.namespace && (
                        <div className="flex items-center gap-2">
                            <Globe className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Namespace
                            </span>
                            <span className="font-medium">
                                {variable.namespace}
                            </span>
                        </div>
                    )}
                    {variable.version && (
                        <div className="flex items-center gap-2">
                            <BarChart3 className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Version
                            </span>
                            <span>{variable.version}</span>
                        </div>
                    )}
                    {variable.dataset && (
                        <div className="flex items-center gap-2">
                            <Lock className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Dataset
                            </span>
                            <span>{variable.dataset}</span>
                        </div>
                    )}
                    {variable.table && (
                        <div className="flex items-center gap-2">
                            <BarChart3 className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Table
                            </span>
                            <span>{variable.table}</span>
                        </div>
                    )}
                    {variable.shortName && (
                        <div className="flex items-center gap-2">
                            <BarChart3 className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Short name
                            </span>
                            <span className="font-mono text-xs">
                                {variable.shortName}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Uploaded by
                        </span>
                        <span className="font-medium">
                            {variable.uploadedBy}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Updated</span>
                        <span>{formatDate(variable.uploadedAt)}</span>
                    </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <a
                            href={`/admin/variables/${variable.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Pencil className="mr-2 size-4" />
                            Edit variable
                        </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a
                            href={`/admin/datasets/${variable.datasetId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-2 size-4" />
                            View dataset
                        </a>
                    </Button>
                </div>
            </div>
        </DetailPanelShell>
    )
}
