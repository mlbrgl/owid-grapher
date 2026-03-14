import {
    BarChart3,
    FileText,
    Database,
    Tags,
    Globe,
    Image,
    File,
    Users,
    ArrowRightLeft,
    Rocket,
    Phone,
    Lightbulb,
    BookOpen,
    Layers,
    Star,
    type LucideIcon,
} from "lucide-react"

export interface RouteItem {
    label: string
    path: string
    icon: LucideIcon
}

export interface NavCategory {
    id: string
    label: string
    icon: LucideIcon
    routes: RouteItem[]
}

export const navCategories: NavCategory[] = [
    {
        id: "content",
        label: "Content",
        icon: FileText,
        routes: [
            { label: "Charts", path: "charts", icon: BarChart3 },
            {
                label: "Narrative Charts",
                path: "narrative-charts",
                icon: BookOpen,
            },
            { label: "Multi-dims", path: "multi-dims", icon: Layers },
            {
                label: "Featured Metrics",
                path: "featured-metrics",
                icon: Star,
            },
            {
                label: "Data Insights",
                path: "data-insights",
                icon: Lightbulb,
            },
            { label: "Google Docs", path: "gdocs", icon: FileText },
            { label: "Explorers", path: "explorers", icon: Globe },
        ],
    },
    {
        id: "data",
        label: "Data",
        icon: Database,
        routes: [
            { label: "Datasets", path: "datasets", icon: Database },
            { label: "Variables", path: "variables", icon: Database },
            { label: "Tags", path: "tags", icon: Tags },
            { label: "Images", path: "images", icon: Image },
            { label: "Files", path: "files", icon: File },
        ],
    },
    {
        id: "settings",
        label: "Settings",
        icon: Users,
        routes: [
            { label: "Users", path: "settings/users", icon: Users },
            {
                label: "Redirects",
                path: "settings/redirects",
                icon: ArrowRightLeft,
            },
        ],
    },
    {
        id: "utilities",
        label: "Utilities",
        icon: Rocket,
        routes: [
            {
                label: "Deploy Status",
                path: "utilities/deploy-status",
                icon: Rocket,
            },
            {
                label: "Callout Functions",
                path: "utilities/callout-functions",
                icon: Phone,
            },
        ],
    },
]

// Flat list of all routes for command palette
export const allRoutes: RouteItem[] = navCategories.flatMap((c) => c.routes)
