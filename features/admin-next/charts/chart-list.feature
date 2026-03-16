Feature: Charts list screen

    Scenario: Charts screen loads and displays chart data
        Given I am on the admin-next charts page
        Then the charts screen is visible
        And the data table is visible

    Scenario: Clicking a chart row opens the detail panel
        Given I am on the admin-next charts page
        When I click the first chart row
        Then the chart detail panel is visible
        And the URL contains "selected="

    Scenario: Closing the detail panel removes the selected param
        Given I am on the admin-next charts page
        When I click the first chart row
        And I close the chart detail panel
        Then the chart detail panel is not visible
        And the URL does not contain "selected="

    Scenario: Detail panel shows chart metadata
        Given I am on the admin-next charts page
        When I click the first chart row
        Then the chart detail panel shows the chart title
        And the chart detail panel shows the chart type
        And the chart detail panel shows the last edited info

    Scenario: Direct URL with selected param opens detail panel
        Given I navigate to the admin-next charts page with the first chart selected
        Then the chart detail panel is visible
