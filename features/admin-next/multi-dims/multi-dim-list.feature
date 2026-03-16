Feature: Multi-dims list screen

    Scenario: Multi-dims screen loads and displays data
        Given I am on the admin-next multi-dims page
        Then the multi-dims screen is visible
        And the data table is visible

    Scenario: Clicking a multi-dim row opens the detail panel
        Given I am on the admin-next multi-dims page
        When I click the first multi-dim row
        Then the multi-dim detail panel is visible
        And the URL contains "selected="

    Scenario: Closing the detail panel removes the selected param
        Given I am on the admin-next multi-dims page
        When I click the first multi-dim row
        And I close the multi-dim detail panel
        Then the multi-dim detail panel is not visible
        And the URL does not contain "selected="

    Scenario: Detail panel shows multi-dim metadata
        Given I am on the admin-next multi-dims page
        When I click the first multi-dim row
        Then the multi-dim detail panel shows the title
        And the multi-dim detail panel shows the published status
        And the multi-dim detail panel shows the catalog path

    Scenario: Direct URL with selected param opens detail panel
        Given I navigate to the admin-next multi-dims page with the first selected
        Then the multi-dim detail panel is visible
