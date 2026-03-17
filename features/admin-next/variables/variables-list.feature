Feature: Variables (Indicators) list screen

    Scenario: Variables screen loads and displays data
        Given I am on the admin-next variables page
        Then the variables screen is visible
        And the data table is visible

    Scenario: Variables can be searched with the search input
        Given I am on the admin-next variables page
        When I type "population" in the variables search
        Then the data table is visible

    Scenario: Variables can be filtered by access level
        Given I am on the admin-next variables page
        Then the "Access" filter is visible in the toolbar

    Scenario: Clicking a variable row opens the detail panel
        Given I am on the admin-next variables page
        When I click the first variable row
        Then the variable detail panel is visible
        And the URL contains "selected="

    Scenario: Closing the detail panel removes the selected param
        Given I am on the admin-next variables page
        When I click the first variable row
        And I close the variable detail panel
        Then the variable detail panel is not visible
        And the URL does not contain "selected="

    Scenario: Detail panel shows variable metadata
        Given I am on the admin-next variables page
        When I click the first variable row
        Then the variable detail panel shows the variable name
        And the variable detail panel shows the access badge
