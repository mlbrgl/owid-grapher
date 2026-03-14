import path from "path"
import { defineConfig } from "vite"
import pluginReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import * as clientSettings from "./settings/clientSettings.js"
import {
    VITE_ENTRYPOINT_INFO,
    ViteEntryPoint,
} from "./site/viteConstants.js"

const entrypointInfo = VITE_ENTRYPOINT_INFO[ViteEntryPoint.AdminNext]
const vitePort = parseInt(process.env.VITE_PORT || "8090", 10)

export default defineConfig({
    publicDir: false,
    resolve: {
        alias: {
            "adminNext/": path.resolve(__dirname, "adminNext") + "/",
        },
    },
    define: {
        ...Object.fromEntries(
            Object.entries(clientSettings).map(([key, value]) => [
                `process.env.${key}`,
                JSON.stringify(value?.toString()),
            ])
        ),
    },
    build: {
        manifest: true,
        emptyOutDir: true,
        outDir: `dist/${entrypointInfo.outDir}`,
        sourcemap: true,
        target: ["chrome91", "firefox91", "safari14.1"],
        commonjsOptions: {
            strictRequires: "auto",
        },
        rollupOptions: {
            input: {
                [entrypointInfo.outName]: entrypointInfo.entryPointFile,
            },
            output: {
                assetFileNames: `${entrypointInfo.outName}.css`,
                entryFileNames: `${entrypointInfo.outName}.mjs`,
            },
        },
    },
    plugins: [
        tailwindcss(),
        pluginReact(),
    ],
    server: {
        port: vitePort,
        ...(process.env.VITE_HOST
            ? {
                  host: process.env.VITE_HOST,
                  cors: true,
              }
            : {}),
    },
    preview: {
        port: vitePort,
    },
})
