import { expect } from "@playwright/test"
import { createBdd } from "playwright-bdd"

const { Given, When, Then } = createBdd()

const ADMIN_NEXT_BASE = "/admin-next"

// --- Given steps ---

Given("I am on the admin-next narrative charts page", async ({ page }) => {
    await page.goto(`${ADMIN_NEXT_BASE}/narrative-charts`)
    await page.waitForSelector("[data-testid='app-shell']")
})

Given(
    "I navigate to the admin-next narrative charts page with the first chart selected",
    async ({ page }) => {
        await page.goto(`${ADMIN_NEXT_BASE}/narrative-charts`)
        await page.waitForSelector("[data-testid='app-shell']")
        await expect(
            page.locator("[data-testid='data-table'] tbody")
        ).not.toContainText("Loading")
        const firstId = await page
            .locator("[data-testid='data-table'] tbody tr td")
            .first()
            .innerText()
        await page.goto(
            `${ADMIN_NEXT_BASE}/narrative-charts?selected=${firstId}`
        )
        await page.waitForSelector("[data-testid='app-shell']")
    }
)

// --- When steps ---

When("I click the first narrative chart row", async ({ page }) => {
    await expect(
        page.locator("[data-testid='data-table'] tbody")
    ).not.toContainText("Loading")
    const row = page.locator("[data-testid='data-table'] tbody tr").first()
    await row.click()
})

When("I close the narrative chart detail panel", async ({ page }) => {
    const panel = page.getByTestId("narrative-chart-detail-panel")
    await expect(panel).toBeVisible()
    const closeButton = panel.locator("button").first()
    await closeButton.click()
})

// --- Then steps ---

Then("the narrative charts screen is visible", async ({ page }) => {
    await expect(
        page.getByTestId("narrative-charts-screen")
    ).toBeVisible()
})

Then("the narrative chart detail panel is visible", async ({ page }) => {
    await expect(
        page.getByTestId("narrative-chart-detail-panel")
    ).toBeVisible()
})

Then(
    "the narrative chart detail panel is not visible",
    async ({ page }) => {
        await expect(
            page.getByTestId("narrative-chart-detail-panel")
        ).not.toBeVisible()
    }
)

Then(
    "the narrative chart detail panel shows the chart title",
    async ({ page }) => {
        const panel = page.getByTestId("narrative-chart-detail-panel")
        await expect(panel.locator("h3")).toBeVisible()
    }
)

Then(
    "the narrative chart detail panel shows the parent info",
    async ({ page }) => {
        const panel = page.getByTestId("narrative-chart-detail-panel")
        await expect(panel).toContainText("Parent")
    }
)

Then(
    "the narrative chart detail panel shows the last edited info",
    async ({ page }) => {
        const panel = page.getByTestId("narrative-chart-detail-panel")
        await expect(panel).toContainText("Last edited")
    }
)
