import { useSearchParams } from "react-router-dom-v5-compat"
import { useCallback, useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "adminNext/lib/utils"

export function ContextPanel({
    children,
}: {
    children?: React.ReactNode
}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedId = searchParams.get("selected")
    const isOpen = selectedId !== null

    const close = useCallback(() => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev)
            next.delete("selected")
            return next
        })
    }, [setSearchParams])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                e.preventDefault()
                close()
            }
        }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [isOpen, close])

    if (!isOpen) return null

    return (
        <div
            data-testid="context-panel"
            className={cn(
                "w-[40%] shrink-0 border-l bg-background",
                "flex flex-col overflow-hidden"
            )}
        >
            <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-sm font-semibold">Details</h2>
                <button
                    onClick={close}
                    className="rounded-md p-1 hover:bg-accent"
                >
                    <X className="size-4" />
                </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
                {children ?? (
                    <p className="text-sm text-muted-foreground">
                        Selected item: {selectedId}
                    </p>
                )}
            </div>
        </div>
    )
}
