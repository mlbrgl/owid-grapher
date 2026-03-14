export interface CommandItem {
    id: string
    label: string
    description?: string
    icon?: React.ComponentType<{ className?: string }>
    keywords?: string[]
    shortcut?: string[]
    action: () => void
    group: string
}

export interface CommandGroup {
    id: string
    label: string
    items: CommandItem[]
}
