import "./tailwind.css"
import { createRoot } from "react-dom/client"
import { createElement } from "react"
import { App } from "./app.js"

declare global {
    interface Window {
        adminNext: {
            username: string
            email: string
            isSuperuser: boolean
        }
    }
}

const container = document.getElementById("app")
if (container) {
    const { username, email, isSuperuser } = window.adminNext
    createRoot(container).render(
        createElement(App, { username, email, isSuperuser })
    )
}
