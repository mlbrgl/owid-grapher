import { expect } from "@playwright/test"
import { createBdd } from "playwright-bdd"

const { Given, When, Then } = createBdd()

const ADMIN_NEXT_BASE = "/admin-next"

// --- Given steps ---

Given("I am on the admin-next multi-dims page", async ({ page }) => {
    await page.goto(`${ADMIN_NEXT_BASE}/multi-dims`)
    await page.waitForSelector("[data-testid='app-shell']")
})

Given("I navigate to the admin-next multi-dims page with the first selected", async ({ page }) => {
    // First load the page and wait for data
    await page.goto(`${ADMIN_NEXT_BASE}/multi-dims`)
    await page.waitForSelector("[data-testid='app-shell']")
    await expect(
        page.locator("[data-testid='data-table'] tbody")
    ).not.toContainText("Loading")
    // Extract the first multi-dim's ID from the first row's first cell
    const firstId = await page.locator("[data-testid='data-table'] tbody tr td").first().innerText()
    // Navigate with the selected param
    await page.goto(`${ADMIN_NEXT_BASE}/multi-dims?selected=${firstId}`)
    await page.waitForSelector("[data-testid='app-shell']")
})

// --- When steps ---

When("I click the first multi-dim row", async ({ page }) => {
    await expect(
        page.locator("[data-testid='data-table'] tbody")
    ).not.toContainText("Loading")
    const row = page.locator("[data-testid='data-table'] tbody tr").first()
    await row.click()
})

When("I close the multi-dim detail panel", async ({ page }) => {
    const panel = page.getByTestId("multi-dim-detail-panel")
    await expect(panel).toBeVisible()
    const closeButton = panel.locator("button").first()
    await closeButton.click()
})

// --- Then steps ---

Then("the multi-dims screen is visible", async ({ page }) => {
    await expect(page.getByTestId("multi-dims-screen")).toBeVisible()
})

Then("the multi-dim detail panel is visible", async ({ page }) => {
    await expect(page.getByTestId("multi-dim-detail-panel")).toBeVisible()
})

Then("the multi-dim detail panel is not visible", async ({ page }) => {
    await expect(page.getByTestId("multi-dim-detail-panel")).not.toBeVisible()
})

Then("the multi-dim detail panel shows the title", async ({ page }) => {
    const panel = page.getByTestId("multi-dim-detail-panel")
    await expect(panel.locator("h3")).toBeVisible()
})

Then("the multi-dim detail panel shows the published status", async ({ page }) => {
    const panel = page.getByTestId("multi-dim-detail-panel")
    await expect(panel.locator("[data-slot='badge']").first()).toBeVisible()
})

Then("the multi-dim detail panel shows the catalog path", async ({ page }) => {
    const panel = page.getByTestId("multi-dim-detail-panel")
    await expect(panel).toContainText("Catalog path")
})
