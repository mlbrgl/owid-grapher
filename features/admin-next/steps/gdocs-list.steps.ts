import { expect } from "@playwright/test"
import { createBdd } from "playwright-bdd"

const { Given, When, Then } = createBdd()

const ADMIN_NEXT_BASE = "/admin-next"

// --- Given steps ---

Given("I am on the admin-next gdocs page", async ({ page }) => {
    await page.goto(`${ADMIN_NEXT_BASE}/gdocs`)
    await page.waitForSelector("[data-testid='app-shell']")
})

// --- When steps ---

When("I click the first gdoc row", async ({ page }) => {
    await expect(
        page.locator("[data-testid='data-table'] tbody")
    ).not.toContainText("Loading")
    const row = page.locator("[data-testid='data-table'] tbody tr").first()
    await row.click()
})

When("I close the gdoc detail panel", async ({ page }) => {
    const panel = page.getByTestId("gdoc-detail-panel")
    await expect(panel).toBeVisible()
    const closeButton = panel.locator("button").first()
    await closeButton.click()
})

// --- Then steps ---

Then("the gdocs screen is visible", async ({ page }) => {
    await expect(page.getByTestId("gdocs-screen")).toBeVisible()
})

Then(
    "the {string} filter is visible in the toolbar",
    async ({ page }, title) => {
        const toolbar = page.getByTestId("data-table-toolbar")
        await expect(toolbar).toBeVisible()
        await expect(
            toolbar.getByRole("button", { name: title })
        ).toBeVisible()
    }
)

Then("the gdoc detail panel is visible", async ({ page }) => {
    await expect(page.getByTestId("gdoc-detail-panel")).toBeVisible()
})

Then("the gdoc detail panel is not visible", async ({ page }) => {
    await expect(page.getByTestId("gdoc-detail-panel")).not.toBeVisible()
})

Then("the gdoc detail panel shows the document title", async ({ page }) => {
    const panel = page.getByTestId("gdoc-detail-panel")
    await expect(panel.locator("h3")).toBeVisible()
})

Then("the gdoc detail panel shows the document type", async ({ page }) => {
    const panel = page.getByTestId("gdoc-detail-panel")
    await expect(panel.locator("[data-slot='badge']").first()).toBeVisible()
})
