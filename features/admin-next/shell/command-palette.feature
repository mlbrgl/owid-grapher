Feature: Command palette

    Scenario: Command palette opens with keyboard shortcut
        Given I am on the admin-next page
        When I press the command palette shortcut
        Then the command palette is visible

    Scenario: Command palette closes with Escape
        Given I am on the admin-next page
        When I press the command palette shortcut
        Then the command palette is visible
        When I press "Escape"
        Then the command palette is not visible

    Scenario: Command palette shows navigation commands
        Given I am on the admin-next page
        When I press the command palette shortcut
        And I type "charts" in the command palette
        Then the command palette shows a result containing "Charts"

    Scenario: Selecting a command navigates to the page
        Given I am on the admin-next page
        When I press the command palette shortcut
        And I type "charts" in the command palette
        And I select the first command palette result
        Then the URL ends with "/admin-next/charts"
        And the command palette is not visible

    Scenario: Command palette opens from header search input
        Given I am on the admin-next page
        When I click the header search input
        Then the command palette is visible
