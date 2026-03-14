import { useLocation } from "react-router-dom-v5-compat"
import { allRoutes } from "../../lib/routes.js"
import { ChevronRight } from "lucide-react"

export function Breadcrumb() {
    const location = useLocation()

    const currentRoute = allRoutes.find(
        (r) => location.pathname === `/${r.path}`
    )

    return (
        <nav
            data-testid="breadcrumb"
            className="flex items-center gap-1.5 text-[13px]"
        >
            <span className="text-muted-foreground/70 select-none">
                Admin
            </span>
            {currentRoute && (
                <>
                    <ChevronRight className="size-3 text-muted-foreground/40" />
                    <span className="font-medium tracking-tight text-foreground">
                        {currentRoute.label}
                    </span>
                </>
            )}
        </nav>
    )
}
