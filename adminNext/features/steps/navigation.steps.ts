import { expect } from "@playwright/test"
import { createBdd } from "playwright-bdd"

const { Given, When, Then } = createBdd()

const ADMIN_NEXT_BASE = "/admin-next"

// --- Given steps ---

Given("I am on the admin-next page", async ({ page }) => {
    await page.goto(`${ADMIN_NEXT_BASE}/`)
    await page.waitForSelector("[data-testid='app-shell']")
})

Given("I am on the admin-next charts page", async ({ page }) => {
    await page.goto(`${ADMIN_NEXT_BASE}/charts`)
    await page.waitForSelector("[data-testid='app-shell']")
})

// --- When steps ---

When(
    "I click the {string} category in the navigation rail",
    async ({ page }, category) => {
        const button = page.getByTestId(`nav-rail-${category.toLowerCase()}`)
        await expect(button).toBeVisible()
        await button.click()
    }
)

When(
    "I click the {string} link in the flyout menu",
    async ({ page }, linkText) => {
        const flyout = page.getByTestId("nav-flyout")
        await expect(flyout).toBeVisible()
        const link = flyout.getByRole("link", { name: linkText, exact: true })
        await expect(link).toBeVisible()
        await link.click()
    }
)

// --- Then steps ---

Then("the navigation rail is visible", async ({ page }) => {
    await expect(page.getByTestId("navigation-rail")).toBeVisible()
})

Then("the header bar is visible", async ({ page }) => {
    await expect(page.getByTestId("header-bar")).toBeVisible()
})

Then("the workspace area is visible", async ({ page }) => {
    await expect(page.getByTestId("workspace")).toBeVisible()
})

Then(
    "the navigation rail has a {string} category",
    async ({ page }, category) => {
        const button = page.getByTestId(
            `nav-rail-${category.toLowerCase()}`
        )
        await expect(button).toBeVisible()
    }
)

Then("the flyout menu is visible", async ({ page }) => {
    await expect(page.getByTestId("nav-flyout")).toBeVisible()
})

Then(
    "the flyout menu contains a link to {string}",
    async ({ page }, linkText) => {
        const flyout = page.getByTestId("nav-flyout")
        await expect(flyout).toBeVisible()
        await expect(
            flyout.getByRole("link", { name: linkText, exact: true })
        ).toBeVisible()
    }
)

Then("the URL ends with {string}", async ({ page }, path) => {
    await expect(page).toHaveURL(new RegExp(`${path.replace("/", "/")}$`))
})

Then("the breadcrumb shows {string}", async ({ page }, text) => {
    const breadcrumb = page.getByTestId("breadcrumb")
    await expect(breadcrumb).toContainText(text)
})

Then("the workspace shows the charts screen", async ({ page }) => {
    await expect(page.getByTestId("workspace")).toContainText("Charts")
})

Then("the header shows the environment badge", async ({ page }) => {
    await expect(page.getByTestId("env-badge")).toBeVisible()
})
