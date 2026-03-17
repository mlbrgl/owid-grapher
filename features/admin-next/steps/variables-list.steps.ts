import { expect } from "@playwright/test"
import { createBdd } from "playwright-bdd"

const { Given, When, Then } = createBdd()

const ADMIN_NEXT_BASE = "/admin-next"

// --- Given steps ---

Given("I am on the admin-next variables page", async ({ page }) => {
    await page.goto(`${ADMIN_NEXT_BASE}/variables`)
    await page.waitForSelector("[data-testid='app-shell']")
})

// --- When steps ---

When("I type {string} in the variables search", async ({ page }, text) => {
    const search = page.getByTestId("variables-search")
    await expect(search).toBeVisible()
    await search.fill(text)
})

When("I click the first variable row", async ({ page }) => {
    await expect(
        page.locator("[data-testid='data-table'] tbody")
    ).not.toContainText("Loading")
    const row = page.locator("[data-testid='data-table'] tbody tr").first()
    await row.click()
})

When("I close the variable detail panel", async ({ page }) => {
    const panel = page.getByTestId("variable-detail-panel")
    await expect(panel).toBeVisible()
    const closeButton = panel.locator("button").first()
    await closeButton.click()
})

// --- Then steps ---

Then("the variables screen is visible", async ({ page }) => {
    await expect(page.getByTestId("variables-screen")).toBeVisible()
})

Then("the variable detail panel is visible", async ({ page }) => {
    await expect(page.getByTestId("variable-detail-panel")).toBeVisible()
})

Then("the variable detail panel is not visible", async ({ page }) => {
    await expect(page.getByTestId("variable-detail-panel")).not.toBeVisible()
})

Then(
    "the variable detail panel shows the variable name",
    async ({ page }) => {
        const panel = page.getByTestId("variable-detail-panel")
        await expect(panel.locator("h3")).toBeVisible()
    }
)

Then(
    "the variable detail panel shows the access badge",
    async ({ page }) => {
        const panel = page.getByTestId("variable-detail-panel")
        await expect(
            panel.locator("[data-slot='badge']").first()
        ).toBeVisible()
    }
)
