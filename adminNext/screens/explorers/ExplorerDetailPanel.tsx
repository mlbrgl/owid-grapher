import {
    ExternalLink,
    Pencil,
    Calendar,
    User,
    FileSpreadsheet,
    Tag,
} from "lucide-react"
import { Badge } from "adminNext/components/ui/badge"
import { Button } from "adminNext/components/ui/button"
import { Separator } from "adminNext/components/ui/separator"
import { DetailPanelShell } from "adminNext/components/shell/DetailPanelShell.js"
import { type ExplorerListItem } from "./explorerColumns.js"

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

export function ExplorerDetailPanel({
    explorer,
}: {
    explorer: ExplorerListItem
}) {
    return (
        <DetailPanelShell title="Explorer Details">
            <div className="space-y-4">
                {/* Title & slug */}
                <div>
                    <h3 className="text-base font-semibold leading-tight">
                        {explorer.title || explorer.slug}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {explorer.slug}
                    </p>
                </div>

                {/* Status badge */}
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant={
                            explorer.isPublished ? "default" : "secondary"
                        }
                    >
                        {explorer.isPublished ? "Published" : "Draft"}
                    </Badge>
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
                            {explorer.lastEditedBy}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Last edited
                        </span>
                        <span>{formatDate(explorer.lastEditedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileSpreadsheet className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Content
                        </span>
                        <span>
                            {explorer.grapherCount} grapher
                            {explorer.grapherCount !== 1 ? "s" : ""},{" "}
                            {explorer.tableCount} table
                            {explorer.tableCount !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>

                {/* Commit message */}
                {explorer.commitMessage && (
                    <>
                        <Separator />
                        <div>
                            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Last Commit
                            </h4>
                            <p className="text-sm">
                                {explorer.commitMessage}
                            </p>
                        </div>
                    </>
                )}

                {/* Tags */}
                {explorer.tags && explorer.tags.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            <h4 className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <Tag className="size-3" />
                                Tags
                            </h4>
                            <div className="flex flex-wrap gap-1">
                                {explorer.tags.map((tag) => (
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
                            href={`/admin/explorers/${explorer.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Pencil className="mr-2 size-4" />
                            Edit Explorer
                        </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a
                            href={`/admin/explorers/preview/${explorer.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-2 size-4" />
                            Preview
                        </a>
                    </Button>
                    {explorer.isPublished && (
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href={`/explorers/${explorer.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="mr-2 size-4" />
                                View on site
                            </a>
                        </Button>
                    )}
                    {explorer.googleSheet && (
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href={explorer.googleSheet}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FileSpreadsheet className="mr-2 size-4" />
                                Google Sheet
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </DetailPanelShell>
    )
}
