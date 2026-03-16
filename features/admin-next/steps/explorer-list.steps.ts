import { expect } from "@playwright/test"
import { createBdd } from "playwright-bdd"

const { Given, When, Then } = createBdd()

const ADMIN_NEXT_BASE = "/admin-next"

// --- Given steps ---

Given("I am on the admin-next explorers page", async ({ page }) => {
    await page.goto(`${ADMIN_NEXT_BASE}/explorers`)
    await page.waitForSelector("[data-testid='app-shell']")
})

Given(
    "I navigate to the admin-next explorers page with the first explorer selected",
    async ({ page }) => {
        // First load the page and wait for explorer data
        await page.goto(`${ADMIN_NEXT_BASE}/explorers`)
        await page.waitForSelector("[data-testid='app-shell']")
        await expect(
            page.locator("[data-testid='data-table'] tbody")
        ).not.toContainText("Loading")
        // Extract the first explorer's slug from the first row's first cell
        const firstSlug = await page
            .locator("[data-testid='data-table'] tbody tr td")
            .first()
            .innerText()
        // Navigate with the selected param
        await page.goto(
            `${ADMIN_NEXT_BASE}/explorers?selected=${firstSlug}`
        )
        await page.waitForSelector("[data-testid='app-shell']")
    }
)

// --- When steps ---

When("I click the first explorer row", async ({ page }) => {
    // Wait for data to load
    await expect(
        page.locator("[data-testid='data-table'] tbody")
    ).not.toContainText("Loading")
    const row = page.locator("[data-testid='data-table'] tbody tr").first()
    await row.click()
})

When("I close the explorer detail panel", async ({ page }) => {
    const panel = page.getByTestId("explorer-detail-panel")
    await expect(panel).toBeVisible()
    const closeButton = panel.locator("button").first()
    await closeButton.click()
})

// --- Then steps ---

Then("the explorers screen is visible", async ({ page }) => {
    await expect(page.getByTestId("explorers-screen")).toBeVisible()
})

Then("the explorer detail panel is visible", async ({ page }) => {
    await expect(page.getByTestId("explorer-detail-panel")).toBeVisible()
})

Then("the explorer detail panel is not visible", async ({ page }) => {
    await expect(
        page.getByTestId("explorer-detail-panel")
    ).not.toBeVisible()
})

Then(
    "the explorer detail panel shows the explorer title",
    async ({ page }) => {
        const panel = page.getByTestId("explorer-detail-panel")
        await expect(panel.locator("h3")).toBeVisible()
    }
)

Then(
    "the explorer detail panel shows the publish status",
    async ({ page }) => {
        const panel = page.getByTestId("explorer-detail-panel")
        await expect(
            panel.locator("[data-slot='badge']").first()
        ).toBeVisible()
    }
)

Then(
    "the explorer detail panel shows the last edited info",
    async ({ page }) => {
        const panel = page.getByTestId("explorer-detail-panel")
        await expect(panel).toContainText("Last edited")
    }
)
