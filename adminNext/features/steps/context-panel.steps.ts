import { expect } from "@playwright/test"
import { createBdd } from "playwright-bdd"

const { Given, Then } = createBdd()

const ADMIN_NEXT_BASE = "/admin-next"

// --- Given steps ---

Given("the context panel is open on the admin-next page", async ({ page }) => {
    await page.goto(`${ADMIN_NEXT_BASE}/charts?selected=1`)
    await page.waitForSelector("[data-testid='app-shell']")
    await expect(page.getByTestId("context-panel")).toBeVisible()
})

// --- Then steps ---

Then("the context panel is not visible", async ({ page }) => {
    await expect(page.getByTestId("context-panel")).not.toBeVisible()
})

Then("the workspace area is narrower than full width", async ({ page }) => {
    const workspace = page.getByTestId("workspace")
    const shell = page.getByTestId("app-shell")
    const workspaceBox = await workspace.boundingBox()
    const shellBox = await shell.boundingBox()
    if (!workspaceBox || !shellBox) throw new Error("Could not get bounding boxes")
    // Workspace should be less than 70% of shell width when context panel is open
    expect(workspaceBox.width).toBeLessThan(shellBox.width * 0.7)
})
