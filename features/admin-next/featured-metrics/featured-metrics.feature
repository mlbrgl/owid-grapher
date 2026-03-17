Feature: Featured Metrics screen

    Scenario: Featured Metrics screen renders with data table
        Given I am on the admin-next featured metrics page
        Then the featured metrics screen is visible
        And the data table is visible
        And the data table toolbar is visible
        And the data table pagination is visible

    Scenario: Featured Metrics screen shows a search input
        Given I am on the admin-next featured metrics page
        Then the data table search input is visible

    Scenario: Featured Metrics screen shows column headers
        Given I am on the admin-next featured metrics page
        Then the data table has a column header "URL"
        And the data table has a column header "Topic"
        And the data table has a column header "Income Group"
        And the data table has a column header "Ranking"

    Scenario: Searching filters the featured metrics
        Given I am on the admin-next featured metrics page
        When I type "energy" in the data table search
        Then the data table rows are filtered

    Scenario: Featured metrics can be filtered by income group
        Given I am on the admin-next featured metrics page
        Then the "Income Group" filter is visible in the toolbar

    Scenario: Clicking a featured metric row opens the detail panel
        Given I am on the admin-next featured metrics page
        When I click the first featured metric row
        Then the featured metric detail panel is visible
        And the URL contains "selected="

    Scenario: Closing the detail panel removes the selected param
        Given I am on the admin-next featured metrics page
        When I click the first featured metric row
        And I close the featured metric detail panel
        Then the featured metric detail panel is not visible
        And the URL does not contain "selected="

    Scenario: Detail panel shows featured metric metadata
        Given I am on the admin-next featured metrics page
        When I click the first featured metric row
        Then the featured metric detail panel shows the URL
        Then the featured metric detail panel shows the income group
