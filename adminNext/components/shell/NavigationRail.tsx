import { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom-v5-compat"
import { navCategories, type NavCategory } from "../../lib/routes.js"
import { cn } from "adminNext/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "adminNext/components/ui/tooltip"

function Flyout({
    category,
    onClose,
    anchorY,
}: {
    category: NavCategory
    onClose: () => void
    anchorY: number
}) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose()
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [onClose])

    return (
        <div
            ref={ref}
            data-testid="nav-flyout"
            style={{ top: `${anchorY}px` }}
            className="fixed left-14 z-50 w-52 animate-in fade-in slide-in-from-left-1 rounded-lg border bg-popover p-1.5 shadow-xl duration-150"
        >
            <div className="mb-1 px-2.5 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {category.label}
            </div>
            {category.routes.map((route) => (
                <Link
                    key={route.path}
                    to={`/${route.path}`}
                    onClick={onClose}
                    className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                >
                    <route.icon className="size-4 shrink-0 text-muted-foreground" />
                    {route.label}
                </Link>
            ))}
        </div>
    )
}

export function NavigationRail() {
    const [openCategory, setOpenCategory] = useState<string | null>(null)
    const [anchorY, setAnchorY] = useState(0)
    const location = useLocation()

    const activeCategory = navCategories.find((cat) =>
        cat.routes.some((r) => location.pathname.startsWith(`/${r.path}`))
    )

    const handleCategoryClick = (
        catId: string,
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setAnchorY(rect.top)
        setOpenCategory(openCategory === catId ? null : catId)
    }

    return (
        <nav
            data-testid="navigation-rail"
            className="relative flex w-14 flex-col items-center gap-0.5 bg-sidebar-background pt-3 pb-4"
        >
            {/* Logo */}
            <Link
                to="/"
                className="mb-4 flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold tracking-tight shadow-sm transition-transform hover:scale-105"
            >
                OW
            </Link>

            {/* Category buttons */}
            {navCategories.map((cat) => {
                const isActive = activeCategory?.id === cat.id
                const isOpen = openCategory === cat.id
                return (
                    <Tooltip key={cat.id} delayDuration={400}>
                        <TooltipTrigger asChild>
                            <button
                                data-testid={`nav-rail-${cat.id}`}
                                onClick={(e) =>
                                    handleCategoryClick(cat.id, e)
                                }
                                className={cn(
                                    "group relative flex size-10 items-center justify-center rounded-lg transition-all duration-150",
                                    isActive || isOpen
                                        ? "text-sidebar-accent-foreground"
                                        : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                                )}
                            >
                                {/* Active indicator — left edge bar */}
                                {isActive && (
                                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-sidebar-primary" />
                                )}
                                {/* Hover / active background */}
                                <span
                                    className={cn(
                                        "absolute inset-1 rounded-md transition-colors duration-150",
                                        isActive || isOpen
                                            ? "bg-sidebar-accent"
                                            : "group-hover:bg-sidebar-accent/60"
                                    )}
                                />
                                <cat.icon className="relative size-[18px]" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent
                            side="right"
                            sideOffset={8}
                            className="text-xs"
                        >
                            {cat.label}
                        </TooltipContent>
                    </Tooltip>
                )
            })}

            {/* Flyout */}
            {openCategory && (
                <Flyout
                    category={
                        navCategories.find((c) => c.id === openCategory)!
                    }
                    onClose={() => setOpenCategory(null)}
                    anchorY={anchorY}
                />
            )}
        </nav>
    )
}
