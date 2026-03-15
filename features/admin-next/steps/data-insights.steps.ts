import { expect } from "@playwright/test"
import { createBdd } from "playwright-bdd"

const { Given, When, Then } = createBdd()

const ADMIN_NEXT_BASE = "/admin-next"

// --- Given steps ---

Given("I am on the admin-next data insights page", async ({ page }) => {
    await page.goto(`${ADMIN_NEXT_BASE}/data-insights`)
    await page.waitForSelector("[data-testid='app-shell']")
})

// --- Then steps ---

Then("the data insights screen is visible", async ({ page }) => {
    await expect(page.getByTestId("data-insights-screen")).toBeVisible()
})

Then("I can see the status filter button", async ({ page }) => {
    await expect(page.getByTestId("filter-status")).toBeVisible()
})

Then("I can see the chart type filter button", async ({ page }) => {
    await expect(page.getByTestId("filter-chart type")).toBeVisible()
})

Then("I can see the layout toggle", async ({ page }) => {
    await expect(page.getByTestId("layout-toggle")).toBeVisible()
})

When("I switch to gallery layout", async ({ page }) => {
    const galleryButton = page
        .getByTestId("layout-toggle")
        .getByRole("button", { name: "Gallery view" })
    await galleryButton.click()
})

Then("the gallery view is visible", async ({ page }) => {
    await expect(page.getByTestId("data-insights-gallery")).toBeVisible()
})

Then("I can see the create data insight button", async ({ page }) => {
    await expect(
        page.getByTestId("create-data-insight-button")
    ).toBeVisible()
})
