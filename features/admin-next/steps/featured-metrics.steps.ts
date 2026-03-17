import { expect } from "@playwright/test"
import { createBdd } from "playwright-bdd"

const { Given, When, Then } = createBdd()

const ADMIN_NEXT_BASE = "/admin-next"

// --- Given steps ---

Given("I am on the admin-next featured metrics page", async ({ page }) => {
    await page.goto(`${ADMIN_NEXT_BASE}/featured-metrics`)
    await page.waitForSelector("[data-testid='app-shell']")
})

// --- When steps ---

When("I click the first featured metric row", async ({ page }) => {
    await expect(
        page.locator("[data-testid='data-table'] tbody")
    ).not.toContainText("Loading")
    const row = page.locator("[data-testid='data-table'] tbody tr").first()
    await row.click()
})

When("I close the featured metric detail panel", async ({ page }) => {
    const panel = page.getByTestId("detail-panel")
    await expect(panel).toBeVisible()
    const closeButton = panel.locator("button").first()
    await closeButton.click()
})

// --- Then steps ---

Then("the featured metrics screen is visible", async ({ page }) => {
    await expect(page.getByTestId("featured-metrics-screen")).toBeVisible()
})

Then("the featured metric detail panel is visible", async ({ page }) => {
    await expect(
        page.getByTestId("featured-metric-detail-panel")
    ).toBeVisible()
})

Then("the featured metric detail panel is not visible", async ({ page }) => {
    await expect(
        page.getByTestId("featured-metric-detail-panel")
    ).not.toBeVisible()
})

Then(
    "the featured metric detail panel shows the URL",
    async ({ page }) => {
        const panel = page.getByTestId("featured-metric-detail-panel")
        await expect(panel.locator("h3")).toBeVisible()
    }
)

Then(
    "the featured metric detail panel shows the income group",
    async ({ page }) => {
        const panel = page.getByTestId("featured-metric-detail-panel")
        await expect(
            panel.locator("[data-slot='badge']").first()
        ).toBeVisible()
    }
)
