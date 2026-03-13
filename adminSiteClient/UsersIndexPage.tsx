import * as React from "react"
import { useContext, useEffect, useState } from "react"
import { dayjs } from "@ourworldindata/utils"

import { AdminLayout } from "./AdminLayout.js"
import { AdminAppContext } from "./AdminAppContext.js"
import { Link } from "./Link.js"
import { UserIndexMeta } from "./UserMeta.js"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./components/ui/table.js"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./components/ui/dialog.js"
import { Button } from "./components/ui/button.js"
import { Input } from "./components/ui/input.js"
import { Label } from "./components/ui/label.js"
import { Badge } from "./components/ui/badge.js"

interface UserIndexMetaWithLastSeen extends UserIndexMeta {
    lastSeen: Date
}

function InviteDialog({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const { admin } = useContext(AdminAppContext)
    const [email, setEmail] = useState("")
    const [fullName, setFullName] = useState("")
    const [responseSuccess, setResponseSuccess] = useState(false)

    function resetForm() {
        setEmail("")
        setFullName("")
        setResponseSuccess(false)
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        setResponseSuccess(false)
        if (email) {
            const resp = await admin.requestJSON(
                "/api/users/add",
                { email, fullName },
                "POST"
            )
            if (resp.success) {
                setResponseSuccess(true)
            }
        }
    }

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) {
            resetForm()
        }
        onOpenChange(nextOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <form onSubmit={(e) => void handleSubmit(e)}>
                    <DialogHeader>
                        <DialogTitle>Add a user</DialogTitle>
                        <DialogDescription>
                            Invite a new user by entering their name and email.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add user</Button>
                    </DialogFooter>
                    {responseSuccess && (
                        <p className="mt-3 text-sm text-green-600">
                            User added! They can now log in with their G Suite
                            account.
                        </p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function UsersIndexPage() {
    const { admin } = useContext(AdminAppContext)
    const [users, setUsers] = useState<UserIndexMetaWithLastSeen[]>([])
    const [isInviteOpen, setIsInviteOpen] = useState(false)

    useEffect(() => {
        async function fetchUsers() {
            const json = (await admin.getJSON("/api/users.json")) as {
                users: UserIndexMetaWithLastSeen[]
            }
            setUsers(json.users)
        }
        void fetchUsers()
    }, [admin])

    async function handleDelete(user: UserIndexMetaWithLastSeen) {
        if (
            !window.confirm(
                `Delete the user ${user.fullName}? This action cannot be undone!`
            )
        )
            return

        const json = await admin.requestJSON(
            `/api/users/${user.id}`,
            {},
            "DELETE"
        )

        if (json.success) {
            setUsers((prev) => prev.filter((u) => u.id !== user.id))
        }
    }

    const { isSuperuser } = admin

    return (
        <AdminLayout title="Users">
            <main className="UsersIndexPage">
                <InviteDialog
                    open={isInviteOpen}
                    onOpenChange={setIsInviteOpen}
                />
                <div className="topbar">
                    <h2>Users</h2>
                    {isSuperuser && (
                        <Button onClick={() => setIsInviteOpen(true)}>
                            Add a user
                        </Button>
                    )}
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Last Seen</TableHead>
                            <TableHead>Joined</TableHead>
                            {isSuperuser && <TableHead>Status</TableHead>}
                            {isSuperuser && <TableHead />}
                            {isSuperuser && <TableHead />}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>
                                    {user.lastSeen &&
                                        dayjs(user.lastSeen).fromNow()}
                                </TableCell>
                                <TableCell>
                                    {user.createdAt &&
                                        dayjs(user.createdAt).fromNow()}
                                </TableCell>
                                {isSuperuser && (
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.isActive
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {user.isActive
                                                ? "active"
                                                : "disabled"}
                                        </Badge>
                                    </TableCell>
                                )}
                                {isSuperuser && (
                                    <TableCell>
                                        <Button variant="outline" asChild>
                                            <Link to={`/users/${user.id}`}>
                                                Edit
                                            </Link>
                                        </Button>
                                    </TableCell>
                                )}
                                {isSuperuser && (
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            onClick={() =>
                                                void handleDelete(user)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </main>
        </AdminLayout>
    )
}
