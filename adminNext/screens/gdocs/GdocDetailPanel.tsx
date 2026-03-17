import { ExternalLink, Pencil, Calendar, Users, FileText } from "lucide-react"
import { Badge } from "adminNext/components/ui/badge"
import { Button } from "adminNext/components/ui/button"
import { Separator } from "adminNext/components/ui/separator"
import { OwidGdocType } from "@ourworldindata/types"
import { DetailPanelShell } from "adminNext/components/shell/DetailPanelShell.js"
import { type GdocRow } from "./gdocColumns.js"

const GDOC_TYPE_LABELS: Record<string, string> = {
    [OwidGdocType.Article]: "Article",
    [OwidGdocType.TopicPage]: "Topic Page",
    [OwidGdocType.LinearTopicPage]: "Linear Topic Page",
    [OwidGdocType.Fragment]: "Fragment",
    [OwidGdocType.DataInsight]: "Data Insight",
    [OwidGdocType.Homepage]: "Homepage",
    [OwidGdocType.AboutPage]: "About Page",
    [OwidGdocType.Author]: "Author",
    [OwidGdocType.Announcement]: "Announcement",
    [OwidGdocType.Profile]: "Profile",
}

function formatDate(dateStr: string | Date | null): string {
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

export function GdocDetailPanel({ gdoc }: { gdoc: GdocRow }) {
    const typeLabel = gdoc.type
        ? (GDOC_TYPE_LABELS[gdoc.type] ?? gdoc.type)
        : "Unknown"

    return (
        <DetailPanelShell title="Document Details" testId="gdoc-detail-panel">
            <div className="space-y-4">
                {/* Title & slug */}
                <div>
                    <h3 className="text-base font-semibold leading-tight">
                        {gdoc.title || (
                            <span className="italic text-muted-foreground">
                                Untitled
                            </span>
                        )}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {gdoc.slug}
                    </p>
                </div>

                {/* Status & type badges */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant={gdoc.published ? "default" : "secondary"}>
                        {gdoc.published ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="outline">{typeLabel}</Badge>
                </div>

                <Separator />

                {/* Metadata */}
                <div className="space-y-3 text-sm">
                    {gdoc.authors && gdoc.authors.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Users className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Authors
                            </span>
                            <span className="font-medium">
                                {gdoc.authors.join(", ")}
                            </span>
                        </div>
                    )}
                    {gdoc.publishedAt && (
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Published
                            </span>
                            <span>{formatDate(gdoc.publishedAt)}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Type</span>
                        <span>{typeLabel}</span>
                    </div>
                </div>

                {/* Tags */}
                {gdoc.tags && gdoc.tags.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Tags
                            </h4>
                            <div className="flex flex-wrap gap-1">
                                {gdoc.tags.map((tag) => (
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
                            href={`/admin/gdocs/${gdoc.id}/preview`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Pencil className="mr-2 size-4" />
                            Edit in Admin
                        </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a
                            href={`https://docs.google.com/document/d/${gdoc.id}/edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-2 size-4" />
                            Open in Google Docs
                        </a>
                    </Button>
                    {gdoc.published && gdoc.slug && (
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href={`/${gdoc.slug}`}
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
