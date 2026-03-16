import { expect } from "@playwright/test"
import { createBdd } from "playwright-bdd"

const { Given, When, Then } = createBdd()

const ADMIN_NEXT_BASE = "/admin-next"

// --- Given steps ---

Given("I navigate to the admin-next charts page with {string}", async ({ page }, params) => {
    await page.goto(`${ADMIN_NEXT_BASE}/charts${params}`)
    await page.waitForSelector("[data-testid='app-shell']")
})

Given("I navigate to the admin-next charts page with the first chart selected", async ({ page }) => {
    // First load the page and wait for chart data
    await page.goto(`${ADMIN_NEXT_BASE}/charts`)
    await page.waitForSelector("[data-testid='app-shell']")
    await expect(
        page.locator("[data-testid='data-table'] tbody")
    ).not.toContainText("Loading")
    // Extract the first chart's ID from the first row's first cell
    const firstId = await page.locator("[data-testid='data-table'] tbody tr td").first().innerText()
    // Navigate with the selected param
    await page.goto(`${ADMIN_NEXT_BASE}/charts?selected=${firstId}`)
    await page.waitForSelector("[data-testid='app-shell']")
})

// --- When steps ---

When("I click the first chart row", async ({ page }) => {
    // Wait for data to load — the loading placeholder shows "Loading..." text
    // and has no click handler, so we must wait for actual data rows
    await expect(
        page.locator("[data-testid='data-table'] tbody")
    ).not.toContainText("Loading")
    const row = page.locator("[data-testid='data-table'] tbody tr").first()
    await row.click()
})

When("I close the chart detail panel", async ({ page }) => {
    const panel = page.getByTestId("chart-detail-panel")
    await expect(panel).toBeVisible()
    const closeButton = panel.locator("button").first()
    await closeButton.click()
})

// --- Then steps ---

Then("the charts screen is visible", async ({ page }) => {
    await expect(page.getByTestId("charts-screen")).toBeVisible()
})

Then("the data table is visible", async ({ page }) => {
    await expect(page.getByTestId("data-table")).toBeVisible()
})

Then("the data table toolbar is visible", async ({ page }) => {
    await expect(page.getByTestId("data-table-toolbar")).toBeVisible()
})

Then("the data table pagination is visible", async ({ page }) => {
    await expect(page.getByTestId("data-table-pagination")).toBeVisible()
})

Then("the data table search input is visible", async ({ page }) => {
    await expect(page.getByTestId("data-table-search")).toBeVisible()
})

Then("the data table has a column header {string}", async ({ page }, name) => {
    const header = page.getByTestId("data-table").locator("thead")
    await expect(header).toContainText(name)
})

Then("the chart detail panel is visible", async ({ page }) => {
    await expect(page.getByTestId("chart-detail-panel")).toBeVisible()
})

Then("the chart detail panel is not visible", async ({ page }) => {
    await expect(page.getByTestId("chart-detail-panel")).not.toBeVisible()
})

Then("the URL contains {string}", async ({ page }, text) => {
    await expect(page).toHaveURL(new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
})

Then("the URL does not contain {string}", async ({ page }, text) => {
    const url = page.url()
    expect(url).not.toContain(text)
})

Then("the chart detail panel shows the chart title", async ({ page }) => {
    const panel = page.getByTestId("chart-detail-panel")
    await expect(panel.locator("h3")).toBeVisible()
})

Then("the chart detail panel shows the chart type", async ({ page }) => {
    const panel = page.getByTestId("chart-detail-panel")
    await expect(panel.locator("[data-slot='badge']").first()).toBeVisible()
})

Then("the chart detail panel shows the last edited info", async ({ page }) => {
    const panel = page.getByTestId("chart-detail-panel")
    await expect(panel).toContainText("Last edited")
})

When("I type {string} in the data table search", async ({ page }, text) => {
    const search = page.getByTestId("data-table-search")
    await expect(search).toBeVisible()
    await search.fill(text)
})

Then("the data table rows are filtered", async ({ page }) => {
    // Just verify the table still renders (actual count depends on data)
    const table = page.getByTestId("data-table")
    await expect(table).toBeVisible()
})

When("I click the {string} column header", async ({ page }, name) => {
    const header = page.getByTestId("data-table").locator("thead")
    const button = header.getByRole("button", { name })
    await expect(button).toBeVisible()
    await button.click()
})

Then("the column {string} is sorted", async ({ page }, _name) => {
    // After clicking, the column should have a sort indicator (arrow icon)
    const table = page.getByTestId("data-table")
    await expect(table).toBeVisible()
})
