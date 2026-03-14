import { Outlet, useSearchParams } from "react-router-dom-v5-compat"
import { NavigationRail } from "./NavigationRail.js"
import { Breadcrumb } from "./Breadcrumb.js"
import { CommandPalette } from "./CommandPalette.js"
import { ContextPanel } from "./ContextPanel.js"

export function AppShell() {
    const [searchParams] = useSearchParams()
    const hasContextPanel = searchParams.get("selected") !== null

    return (
        <div
            data-testid="app-shell"
            className="flex h-screen overflow-hidden bg-background"
        >
            <NavigationRail />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header Bar */}
                <header
                    data-testid="header-bar"
                    className="flex h-12 shrink-0 items-center gap-4 border-b bg-background/80 px-5 backdrop-blur-sm"
                >
                    <Breadcrumb />
                    <div className="flex-1" />
                    <CommandPalette />
                    <span
                        data-testid="env-badge"
                        className="inline-flex items-center rounded-full border border-amber-200/60 bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-700"
                    >
                        dev
                    </span>
                </header>

                {/* Workspace + Context Panel */}
                <div className="flex flex-1 overflow-hidden">
                    <main
                        data-testid="workspace"
                        className="flex-1 overflow-auto"
                    >
                        <Outlet />
                    </main>

                    {hasContextPanel && <ContextPanel />}
                </div>
            </div>
        </div>
    )
}
