import { expect } from "@playwright/test"
import { createBdd } from "playwright-bdd"

const { Given, When, Then } = createBdd()

// --- When steps ---

When("I press the command palette shortcut", async ({ page }) => {
    // In headless test environments, always use Control+k
    await page.keyboard.press("Control+k")
})

When(
    "I type {string} in the command palette",
    async ({ page }, query) => {
        const input = page.getByTestId("command-palette-input")
        await expect(input).toBeVisible()
        await input.fill(query)
    }
)

When("I select the first command palette result", async ({ page }) => {
    const firstItem = page
        .getByTestId("command-palette-list")
        .getByRole("option")
        .first()
    await expect(firstItem).toBeVisible()
    await firstItem.click()
})

// "I press {string}" step is defined in features/search.steps.ts

When("I click the header search input", async ({ page }) => {
    const searchTrigger = page.getByTestId("header-search-trigger")
    await expect(searchTrigger).toBeVisible()
    await searchTrigger.click()
})

// --- Then steps ---

Then("the command palette is visible", async ({ page }) => {
    await expect(page.getByTestId("command-palette")).toBeVisible()
})

Then("the command palette is not visible", async ({ page }) => {
    await expect(page.getByTestId("command-palette")).not.toBeVisible()
})

Then(
    "the command palette shows a result containing {string}",
    async ({ page }, text) => {
        const list = page.getByTestId("command-palette-list")
        await expect(list).toContainText(text)
    }
)
