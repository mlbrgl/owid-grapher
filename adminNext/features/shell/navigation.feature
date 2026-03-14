Feature: Admin shell navigation

    Scenario: Shell layout renders with rail, header, and workspace
        Given I am on the admin-next page
        Then the navigation rail is visible
        And the header bar is visible
        And the workspace area is visible

    Scenario: Navigation rail shows category icons
        Given I am on the admin-next page
        Then the navigation rail has a "Content" category
        And the navigation rail has a "Data" category
        And the navigation rail has a "Settings" category

    Scenario: Clicking a rail category shows its flyout menu
        Given I am on the admin-next page
        When I click the "Content" category in the navigation rail
        Then the flyout menu is visible
        And the flyout menu contains a link to "Charts"

    Scenario: Navigating via flyout updates the workspace
        Given I am on the admin-next page
        When I click the "Content" category in the navigation rail
        And I click the "Charts" link in the flyout menu
        Then the URL ends with "/admin-next/charts"
        And the breadcrumb shows "Charts"

    Scenario: Direct URL navigation works
        Given I am on the admin-next charts page
        Then the breadcrumb shows "Charts"
        And the workspace shows the charts screen

    Scenario: Header shows environment badge
        Given I am on the admin-next page
        Then the header shows the environment badge
