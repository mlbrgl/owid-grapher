import {
    useMutation,
    UseMutationResult,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"
import { useContext, useMemo, useState } from "react"
import cx from "classnames"
import { tippy } from "@tippyjs/react"
import { AdminLayout } from "./AdminLayout.js"
import { AdminAppContext } from "./AdminAppContext.js"
import {
    DbPlainDod,
    DbPlainUser,
    DodUsageRecord,
    DodUsageTypes,
} from "@ourworldindata/types"
import { EditableTextarea } from "./EditableTextarea.js"
import * as R from "remeda"
import { Admin } from "./Admin.js"
import { fromMarkdown } from "mdast-util-from-markdown"
import { Content, PhrasingContent } from "mdast"
import { renderToStaticMarkup } from "react-dom/server"
import { MarkdownTextWrap } from "@ourworldindata/components"
import { match } from "ts-pattern"
import { BAKED_BASE_URL } from "../settings/clientSettings.js"
import { extractDetailsFromSyntax } from "@ourworldindata/utils"
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
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./components/ui/dialog.js"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./components/ui/alert-dialog.js"
import { Textarea } from "./components/ui/textarea.js"

type ValidPhrasingContent = Extract<
    PhrasingContent,
    { type: "text" | "link" | "emphasis" | "strong" | "break" }
>

function validateParagraphChildren(
    children: Content[],
    dods: Record<string, DbPlainDod> | undefined
): children is ValidPhrasingContent[] {
    return children.every((child) => {
        if (child.type === "text") {
            return true
        }
        if (child.type === "link") {
            const referencedDods = extractDetailsFromSyntax(child.url)
            const areAllReferencedDodsValid = referencedDods.every(
                (dod) => dods && dods[dod]
            )
            return (
                child &&
                areAllReferencedDodsValid &&
                validateParagraphChildren(child.children, dods)
            )
        }
        if (child.type === "emphasis" || child.type === "strong") {
            return validateParagraphChildren(child.children, dods)
        }
        if (child.type === "break") {
            return true
        }

        return false
    })
}

function validateDodContent(
    content: string | undefined | null,
    dods: Record<string, DbPlainDod> | undefined
): boolean {
    if (!content) {
        return true
    }
    const ast = fromMarkdown(content)
    const isValid = ast.children.every((node) => {
        if (node.type === "paragraph") {
            const paragraphChildren = node.children
            return validateParagraphChildren(paragraphChildren, dods)
        }
        if (node.type === "list") {
            return node.children.every((listItem) => {
                if (listItem.type === "listItem") {
                    return listItem.children.every((child) => {
                        if (child.type !== "paragraph") {
                            return false
                        }
                        const paragraphChildren = child.children
                        return validateParagraphChildren(
                            paragraphChildren,
                            dods
                        )
                    })
                }
                return false
            })
        }

        return false
    })
    return isValid
}

function InvalidDodMessage() {
    return (
        <div className="DodEditor__error">
            <strong>Invalid markdown</strong>
            Only basic text, **emphasis**, *strong*,
            [links](https://example.org), and lists are supported. Ensure you
            don't have typos in any [nested dods](#dod:nested).
        </div>
    )
}

function DodEditor({
    dods,
    id,
    patchDodMutation,
    text,
}: {
    dods: Record<string, DbPlainDod> | undefined
    id: number
    patchDodMutation: PatchDodMutationType
    text: string
}) {
    const [value, setValue] = useState(text)
    const isValid = validateDodContent(value, dods)

    return (
        <div className={cx("DodEditor", { "DodEditor--has-error": !isValid })}>
            <EditableTextarea
                autoResize
                onChange={setValue}
                value={value}
                valid={isValid}
                onSave={(value) => {
                    patchDodMutation.mutate({
                        id,
                        content: value,
                    })
                }}
                extraActions={isValid ? null : <InvalidDodMessage />}
            />
        </div>
    )
}

function showDodPreviewTooltip(text: string, element: Element): void {
    const content = renderToStaticMarkup(
        <div className="dod-container">
            <MarkdownTextWrap text={text} fontSize={16} lineHeight={1.55} />
        </div>
    )
    tippy(element, {
        content,
        allowHTML: true,
        delay: [null, 200],
        interactive: true,
        hideOnClick: false,
        arrow: false,
        theme: "light dod",
        appendTo: document.body,
        onHidden: (instance) => instance.destroy(),
    })
}

async function fetchDods(admin: Admin) {
    const { dods } = await admin.getJSON<{
        dods: DbPlainDod[]
    }>("/api/dods.json")
    return R.indexBy(dods, (d) => d.name)
}

async function fetchDodUsage(admin: Admin) {
    const usageDictionary = await admin.getJSON<
        Record<string, DodUsageRecord[]>
    >("/api/dods-usage.json")

    return usageDictionary
}

async function fetchUsers(admin: Admin) {
    const { users } = await admin.getJSON<{
        users: DbPlainUser[]
    }>("/api/users.json")
    return R.indexBy(users, (u) => u.id)
}

type DodMutation<T> = UseMutationResult<DbPlainDod, unknown, T, unknown>

type PatchDodMutationType = DodMutation<{ id: number; content: string }>

type DeleteDodMutationType = DodMutation<{ id: number }>

type CreateDodMutationType = DodMutation<{ content: string; name: string }>

async function patchDod(admin: Admin, id: number, data: { content: string }) {
    const response = await admin.requestJSON<DbPlainDod>(
        `/api/dods/${id}`,
        data,
        "PATCH"
    )
    return response
}

async function deleteDod(admin: Admin, id: number) {
    const response = await admin.requestJSON<DbPlainDod>(
        `/api/dods/${id}`,
        {},
        "DELETE"
    )
    return response
}

async function createDod(
    admin: Admin,
    data: { content: string; name: string }
) {
    const response = await admin.requestJSON<DbPlainDod>(
        `/api/dods`,
        data,
        "POST"
    )
    return response
}

function CreateDodDialog({
    createDodMutation,
    open,
    onOpenChange,
    dods,
}: {
    createDodMutation: CreateDodMutationType
    open: boolean
    onOpenChange: (open: boolean) => void
    dods: Record<string, DbPlainDod> | undefined
}) {
    const [name, setName] = useState("")
    const [content, setContent] = useState("")
    const [nameError, setNameError] = useState<string | null>(null)

    const isContentValid = validateDodContent(content, dods)
    const isFilled = name.trim().length > 0 && content.trim().length > 0

    function validateName(value: string): string | null {
        if (!value.trim()) return "Name is required"
        if (/\s/.test(value)) return "No spaces allowed"
        if (dods && dods[value]) return "Dod already exists"
        return null
    }

    function resetForm() {
        setName("")
        setContent("")
        setNameError(null)
    }

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) {
            resetForm()
        }
        onOpenChange(nextOpen)
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const error = validateName(name)
        if (error) {
            setNameError(error)
            return
        }
        createDodMutation.mutate({ content, name })
        resetForm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Detail on Demand</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="dod-name">Name</Label>
                            <Input
                                id="dod-name"
                                autoComplete="off"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                    setNameError(validateName(e.target.value))
                                }}
                            />
                            {nameError && (
                                <p className="text-sm text-destructive">
                                    {nameError}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dod-content">Content</Label>
                            <Textarea
                                id="dod-content"
                                rows={8}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={!isFilled || !isContentValid}
                        >
                            Submit
                        </Button>
                    </DialogFooter>
                    {!isContentValid && <InvalidDodMessage />}
                </form>
            </DialogContent>
        </Dialog>
    )
}

function DodUsageDialog({
    dodUsage,
    activeDodForUsageModal,
    setActiveDodForUsageModal,
}: {
    dodUsage: Record<string, DodUsageRecord[]> | undefined
    activeDodForUsageModal: string | null
    setActiveDodForUsageModal: (name: string | null) => void
}) {
    const [typeFilter, setTypeFilter] = useState<string | null>(null)

    if (!dodUsage || !activeDodForUsageModal) return null
    const activeDodUsage = dodUsage[activeDodForUsageModal]
    if (!activeDodUsage) return null

    const presentUsageTypes = Array.from(
        new Set(activeDodUsage.map((r) => r.type))
    ).filter((t) => DodUsageTypes.includes(t))

    const filteredUsage = typeFilter
        ? activeDodUsage.filter((r) => r.type === typeFilter)
        : activeDodUsage

    function makeUrlForUsageRecord(
        dodUsageRecord: DodUsageRecord
    ): string | undefined {
        return match(dodUsageRecord.type)
            .with("explorer", () => {
                return `/admin/explorers/${dodUsageRecord.id}`
            })
            .with("gdoc", () => {
                return `/admin/gdocs/${dodUsageRecord.id}/preview`
            })
            .with("grapher", () => {
                return `${BAKED_BASE_URL}/grapher/${dodUsageRecord.id}`
            })
            .with("indicator", () => {
                return `/admin/variables/${dodUsageRecord.id}`
            })
            .with("dod", () => {
                return undefined
            })
            .exhaustive()
    }

    return (
        <Dialog
            open={!!activeDodForUsageModal}
            onOpenChange={(open) => {
                if (!open) {
                    setActiveDodForUsageModal(null)
                    setTypeFilter(null)
                }
            }}
        >
            <DialogContent className="sm:max-w-[80vw]">
                <DialogHeader>
                    <DialogTitle>Usage of {activeDodForUsageModal}</DialogTitle>
                </DialogHeader>
                {presentUsageTypes.length > 1 && (
                    <div className="flex gap-2">
                        <Button
                            variant={
                                typeFilter === null ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setTypeFilter(null)}
                        >
                            All
                        </Button>
                        {presentUsageTypes.map((type) => (
                            <Button
                                key={type}
                                variant={
                                    typeFilter === type ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setTypeFilter(type)}
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Resource</TableHead>
                            <TableHead className="w-[200px]">Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsage.map((record, idx) => {
                            const url = makeUrlForUsageRecord(record)
                            return (
                                <TableRow key={idx}>
                                    <TableCell>
                                        {url ? (
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {record.title}
                                            </a>
                                        ) : (
                                            <span>{record.title}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{record.type}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    )
}

type SortField = "name" | "updatedAt" | "usageCount"
type SortDirection = "asc" | "desc"

function SortableHeader({
    label,
    field,
    currentSort,
    currentDirection,
    onSort,
}: {
    label: string
    field: SortField
    currentSort: SortField
    currentDirection: SortDirection
    onSort: (field: SortField) => void
}) {
    const isActive = currentSort === field
    return (
        <TableHead
            className="cursor-pointer select-none"
            onClick={() => onSort(field)}
        >
            {label}{" "}
            {isActive ? (currentDirection === "asc" ? "\u2191" : "\u2193") : ""}
        </TableHead>
    )
}

export function DodsIndexPage() {
    const { admin } = useContext(AdminAppContext)
    const [dodSearchValue, setDodSearchValue] = useState("")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [activeDodForUsageModal, setActiveDodForUsageModal] = useState<
        string | null
    >(null)
    const [sortField, setSortField] = useState<SortField>("updatedAt")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const queryClient = useQueryClient()

    const { data: dods } = useQuery({
        queryKey: ["dods"],
        queryFn: () => fetchDods(admin),
    })

    const { data: dodUsage } = useQuery({
        queryKey: ["dod-usage"],
        queryFn: () => fetchDodUsage(admin),
    })

    const { data: users } = useQuery({
        queryKey: ["users"],
        queryFn: () => fetchUsers(admin),
    })

    const patchDodMutation = useMutation({
        mutationFn: ({ id, content }: { id: number; content: string }) =>
            patchDod(admin, id, { content }),
        onSuccess: async () => {
            return queryClient.invalidateQueries({ queryKey: ["dods"] })
        },
    })

    const deleteDodMutation = useMutation({
        mutationFn: ({ id }: { id: number }) => deleteDod(admin, id),
        onSuccess: async () => {
            return queryClient.invalidateQueries({ queryKey: ["dods"] })
        },
    })

    const createDodMutation = useMutation({
        mutationFn: ({ content, name }: { content: string; name: string }) =>
            createDod(admin, { content, name }),
        onSuccess: async () => {
            return queryClient.invalidateQueries({ queryKey: ["dods"] })
        },
    })

    function handleSort(field: SortField) {
        if (sortField === field) {
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
        } else {
            setSortField(field)
            setSortDirection(field === "updatedAt" ? "desc" : "asc")
        }
    }

    const filteredAndSortedDods = useMemo(() => {
        if (!dods) return []
        const filtered = Object.values(dods).filter(
            (dod) =>
                users?.[dod.lastUpdatedUserId]?.fullName
                    .toLowerCase()
                    .includes(dodSearchValue.toLowerCase()) ||
                dod.name.toLowerCase().includes(dodSearchValue.toLowerCase()) ||
                dod.content.toLowerCase().includes(dodSearchValue.toLowerCase())
        )

        const sorted = [...filtered].sort((a, b) => {
            let cmp = 0
            if (sortField === "name") {
                cmp = a.name.localeCompare(b.name)
            } else if (sortField === "updatedAt") {
                cmp =
                    new Date(a.updatedAt).getTime() -
                    new Date(b.updatedAt).getTime()
            } else if (sortField === "usageCount") {
                const aUsage = dodUsage?.[a.name]?.length ?? 0
                const bUsage = dodUsage?.[b.name]?.length ?? 0
                cmp = aUsage - bUsage
            }
            return sortDirection === "asc" ? cmp : -cmp
        })

        return sorted
    }, [dods, dodSearchValue, users, sortField, sortDirection, dodUsage])

    return (
        <AdminLayout title="DoDs">
            <main className="DodsIndexPage">
                <div className="flex items-center justify-between mb-4">
                    <Input
                        placeholder="Search by content, id, or most recent user"
                        value={dodSearchValue}
                        onChange={(e) => setDodSearchValue(e.target.value)}
                        className="max-w-[500px]"
                    />
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        Create
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <SortableHeader
                                label="Name"
                                field="name"
                                currentSort={sortField}
                                currentDirection={sortDirection}
                                onSort={handleSort}
                            />
                            <TableHead className="w-[150px]">
                                Last updated by
                            </TableHead>
                            <SortableHeader
                                label="Last updated"
                                field="updatedAt"
                                currentSort={sortField}
                                currentDirection={sortDirection}
                                onSort={handleSort}
                            />
                            <TableHead>Content</TableHead>
                            <SortableHeader
                                label="Actions"
                                field="usageCount"
                                currentSort={sortField}
                                currentDirection={sortDirection}
                                onSort={handleSort}
                            />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedDods.map((dod) => {
                            const user = users?.[dod.lastUpdatedUserId]
                            const date = new Date(dod.updatedAt)

                            return (
                                <TableRow key={dod.id} className="align-top">
                                    <TableCell className="align-top whitespace-normal">
                                        {dod.name}
                                    </TableCell>
                                    <TableCell className="align-top">
                                        {user ? user.fullName : "Unknown"}
                                    </TableCell>
                                    <TableCell className="align-top">
                                        {`${date.toLocaleTimeString()} ${date.toLocaleDateString()}`}
                                    </TableCell>
                                    <TableCell className="align-top whitespace-normal">
                                        <div
                                            className="dod-content"
                                            data-dod-id={dod.id}
                                        >
                                            <DodEditor
                                                text={dod.content}
                                                id={dod.id}
                                                patchDodMutation={
                                                    patchDodMutation
                                                }
                                                dods={dods}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-top">
                                        <DodActions
                                            dod={dod}
                                            dodUsage={dodUsage}
                                            deleteDodMutation={
                                                deleteDodMutation
                                            }
                                            setActiveDodForUsageModal={
                                                setActiveDodForUsageModal
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <CreateDodDialog
                    createDodMutation={createDodMutation}
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    dods={dods}
                />
                <DodUsageDialog
                    dodUsage={dodUsage}
                    activeDodForUsageModal={activeDodForUsageModal}
                    setActiveDodForUsageModal={setActiveDodForUsageModal}
                />
            </main>
        </AdminLayout>
    )
}

function DodActions({
    dod,
    dodUsage,
    deleteDodMutation,
    setActiveDodForUsageModal,
}: {
    dod: DbPlainDod
    dodUsage: Record<string, DodUsageRecord[]> | undefined
    deleteDodMutation: DeleteDodMutationType
    setActiveDodForUsageModal: (name: string) => void
}) {
    if (!dodUsage) {
        return (
            <div className="DodEditor__actions-spinner">
                <Button disabled size="sm">
                    Loading...
                </Button>
            </div>
        )
    }

    const usage = dodUsage[dod.name] ?? []

    return (
        <div className="DodEditor__actions">
            <Button
                variant="outline"
                size="sm"
                onMouseEnter={(event) => {
                    const textarea = document.querySelector(
                        `.dod-content[data-dod-id="${dod.id}"] textarea`
                    )
                    if (!textarea) return

                    const text = textarea.textContent
                    const target = event.currentTarget as HTMLButtonElement & {
                        _tippy?: unknown
                    }

                    if (text && !target._tippy) {
                        showDodPreviewTooltip(text, target)
                    }
                }}
            >
                Preview
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveDodForUsageModal(dod.name)}
            >
                Usage ({usage.length})
            </Button>
            {usage.length === 0 ? (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() =>
                                    deleteDodMutation.mutate({
                                        id: dod.id,
                                    })
                                }
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            ) : (
                <Button variant="destructive" size="sm" disabled>
                    Cannot delete while in use
                </Button>
            )}
        </div>
    )
}
