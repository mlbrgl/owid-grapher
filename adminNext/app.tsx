import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom-v5-compat"
import { TooltipProvider } from "adminNext/components/ui/tooltip"
import { AppShell } from "./components/shell/AppShell.js"
import { ChartsScreen } from "./screens/charts/ChartsScreen.js"
import { NarrativeChartsScreen } from "./screens/narrative-charts/NarrativeChartsScreen.js"
import { DataInsightsScreen } from "./screens/data-insights/DataInsightsScreen.js"
import { MultiDimsScreen } from "./screens/multi-dims/MultiDimsScreen.js"
import { ExplorersScreen } from "./screens/explorers/ExplorersScreen.js"
import { GdocsScreen } from "./screens/gdocs/GdocsScreen.js"
import { DatasetsScreen } from "./screens/datasets/DatasetsScreen.js"
import { FeaturedMetricsScreen } from "./screens/featured-metrics/FeaturedMetricsScreen.js"
import { VariablesScreen } from "./screens/variables/VariablesScreen.js"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60, // 1 minute
            retry: 1,
        },
    },
})

function PlaceholderScreen({ title }: { title: string }) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-2 text-muted-foreground">Coming soon.</p>
        </div>
    )
}

function AppRoutes() {
    return (
        <Routes>
            <Route element={<AppShell />}>
                <Route index element={<Navigate to="charts" replace />} />
                <Route path="charts" element={<ChartsScreen />} />
                <Route
                    path="narrative-charts"
                    element={<NarrativeChartsScreen />}
                />
                <Route path="multi-dims" element={<MultiDimsScreen />} />
                <Route
                    path="featured-metrics"
                    element={<FeaturedMetricsScreen />}
                />
                <Route path="data-insights" element={<DataInsightsScreen />} />
                <Route path="gdocs" element={<GdocsScreen />} />
                <Route path="explorers" element={<ExplorersScreen />} />
                <Route path="datasets" element={<DatasetsScreen />} />
                <Route path="variables" element={<VariablesScreen />} />
                <Route
                    path="tags"
                    element={<PlaceholderScreen title="Tags" />}
                />
                <Route
                    path="images"
                    element={<PlaceholderScreen title="Images" />}
                />
                <Route
                    path="files"
                    element={<PlaceholderScreen title="Files" />}
                />
                <Route
                    path="settings/users"
                    element={<PlaceholderScreen title="Users" />}
                />
                <Route
                    path="settings/redirects"
                    element={<PlaceholderScreen title="Redirects" />}
                />
                <Route
                    path="utilities/deploy-status"
                    element={<PlaceholderScreen title="Deploy Status" />}
                />
                <Route
                    path="utilities/callout-functions"
                    element={<PlaceholderScreen title="Callout Functions" />}
                />
                <Route
                    path="*"
                    element={<PlaceholderScreen title="Not Found" />}
                />
            </Route>
        </Routes>
    )
}

export function App({
    username,
    email,
    isSuperuser,
}: {
    username: string
    email: string
    isSuperuser: boolean
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <BrowserRouter basename="/admin-next">
                    <AppRoutes />
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    )
}
