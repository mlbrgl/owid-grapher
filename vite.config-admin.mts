import { mergeConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { ViteEntryPoint } from "./site/viteConstants.ts"
import { defineViteConfigForEntrypoint } from "./vite.config-common.mts"

export default mergeConfig(defineViteConfigForEntrypoint(ViteEntryPoint.Admin), {
    plugins: [tailwindcss()],
})
