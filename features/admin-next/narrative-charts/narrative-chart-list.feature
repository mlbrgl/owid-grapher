Feature: Narrative Charts list screen

    Scenario: Narrative Charts screen loads and displays data
        Given I am on the admin-next narrative charts page
        Then the narrative charts screen is visible
        And the data table is visible

    Scenario: Clicking a narrative chart row opens the detail panel
        Given I am on the admin-next narrative charts page
        When I click the first narrative chart row
        Then the narrative chart detail panel is visible
        And the URL contains "selected="

    Scenario: Closing the detail panel removes the selected param
        Given I am on the admin-next narrative charts page
        When I click the first narrative chart row
        And I close the narrative chart detail panel
        Then the narrative chart detail panel is not visible
        And the URL does not contain "selected="

    Scenario: Detail panel shows narrative chart metadata
        Given I am on the admin-next narrative charts page
        When I click the first narrative chart row
        Then the narrative chart detail panel shows the chart title
        And the narrative chart detail panel shows the parent info
        And the narrative chart detail panel shows the last edited info

    Scenario: Direct URL with selected param opens detail panel
        Given I navigate to the admin-next narrative charts page with the first chart selected
        Then the narrative chart detail panel is visible
