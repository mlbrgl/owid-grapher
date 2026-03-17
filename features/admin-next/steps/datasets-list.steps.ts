import { expect } from "@playwright/test"
import { createBdd } from "playwright-bdd"

const { Given, When, Then } = createBdd()

const ADMIN_NEXT_BASE = "/admin-next"

// --- Given steps ---

Given("I am on the admin-next datasets page", async ({ page }) => {
    await page.goto(`${ADMIN_NEXT_BASE}/datasets`)
    await page.waitForSelector("[data-testid='app-shell']")
})

// --- When steps ---

When("I click the first dataset row", async ({ page }) => {
    await expect(
        page.locator("[data-testid='data-table'] tbody")
    ).not.toContainText("Loading")
    const row = page.locator("[data-testid='data-table'] tbody tr").first()
    await row.click()
})

When("I close the dataset detail panel", async ({ page }) => {
    const panel = page.getByTestId("dataset-detail-panel")
    await expect(panel).toBeVisible()
    const closeButton = panel.locator("button").first()
    await closeButton.click()
})

// --- Then steps ---

Then("the datasets screen is visible", async ({ page }) => {
    await expect(page.getByTestId("datasets-screen")).toBeVisible()
})

Then("the dataset detail panel is visible", async ({ page }) => {
    await expect(page.getByTestId("dataset-detail-panel")).toBeVisible()
})

Then("the dataset detail panel is not visible", async ({ page }) => {
    await expect(page.getByTestId("dataset-detail-panel")).not.toBeVisible()
})

Then("the dataset detail panel shows the dataset name", async ({ page }) => {
    const panel = page.getByTestId("dataset-detail-panel")
    await expect(panel.locator("h3")).toBeVisible()
})

Then("the dataset detail panel shows the namespace", async ({ page }) => {
    const panel = page.getByTestId("dataset-detail-panel")
    await expect(panel.locator("[data-slot='badge']").first()).toBeVisible()
})
