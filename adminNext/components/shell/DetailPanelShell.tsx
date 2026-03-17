import { useSearchParams } from "react-router-dom-v5-compat"
import { useCallback, useEffect } from "react"
import { X } from "lucide-react"

export function DetailPanelShell({
    title,
    children,
    testId,
}: {
    title: string
    children: React.ReactNode
    testId?: string
}) {
    const [, setSearchParams] = useSearchParams()

    const close = useCallback(() => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev)
            next.delete("selected")
            return next
        })
    }, [setSearchParams])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault()
                close()
            }
        }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [close])

    return (
        <>
            {/* Overlay backdrop */}
            <div
                data-testid="detail-panel-overlay"
                className="fixed inset-0 z-40 bg-black/20"
                style={{ animation: "fade-in 200ms ease-out" }}
                onClick={close}
            />

            {/* Slide-in panel */}
            <div
                data-testid={testId ?? "detail-panel"}
                className="fixed top-0 right-0 z-50 h-full w-[40%] border-l bg-background flex flex-col overflow-hidden shadow-xl"
                style={{ animation: "slide-in-from-right 200ms ease-out" }}
            >
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h2 className="text-sm font-semibold">{title}</h2>
                    <button
                        onClick={close}
                        className="rounded-md p-1 hover:bg-accent"
                    >
                        <X className="size-4" />
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-4">{children}</div>
            </div>
        </>
    )
}
