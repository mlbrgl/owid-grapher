import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom-v5-compat"
import { Search } from "lucide-react"
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "adminNext/components/ui/command"
import { navCategories } from "../../lib/routes.js"

export function CommandPalette() {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault()
            setOpen((prev) => !prev)
        }
    }, [])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [handleKeyDown])

    return (
        <>
            <button
                data-testid="header-search-trigger"
                onClick={() => setOpen(true)}
                className="flex h-8 w-56 items-center gap-2 rounded-lg border bg-muted/40 px-2.5 text-[13px] text-muted-foreground/70 transition-all hover:bg-muted/70 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <Search className="size-3.5 shrink-0" />
                <span className="flex-1 text-left">Search...</span>
                <kbd className="pointer-events-none hidden rounded border bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/60 sm:inline-block">
                    ⌘K
                </kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <div data-testid="command-palette">
                    <CommandInput
                        data-testid="command-palette-input"
                        placeholder="Type a command or search..."
                    />
                    <CommandList data-testid="command-palette-list">
                        <CommandEmpty>No results found.</CommandEmpty>
                        {navCategories.map((cat) => (
                            <CommandGroup key={cat.id} heading={cat.label}>
                                {cat.routes.map((route) => (
                                    <CommandItem
                                        key={route.path}
                                        value={route.label}
                                        onSelect={() => {
                                            navigate(`/${route.path}`)
                                            setOpen(false)
                                        }}
                                    >
                                        <route.icon className="size-4" />
                                        {route.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </div>
            </CommandDialog>
        </>
    )
}
