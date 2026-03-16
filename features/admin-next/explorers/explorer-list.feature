Feature: Explorers list screen

    Scenario: Explorers screen loads and displays explorer data
        Given I am on the admin-next explorers page
        Then the explorers screen is visible
        And the data table is visible

    Scenario: Clicking an explorer row opens the detail panel
        Given I am on the admin-next explorers page
        When I click the first explorer row
        Then the explorer detail panel is visible
        And the URL contains "selected="

    Scenario: Closing the detail panel removes the selected param
        Given I am on the admin-next explorers page
        When I click the first explorer row
        And I close the explorer detail panel
        Then the explorer detail panel is not visible
        And the URL does not contain "selected="

    Scenario: Detail panel shows explorer metadata
        Given I am on the admin-next explorers page
        When I click the first explorer row
        Then the explorer detail panel shows the explorer title
        And the explorer detail panel shows the publish status
        And the explorer detail panel shows the last edited info

    Scenario: Direct URL with selected param opens detail panel
        Given I navigate to the admin-next explorers page with the first explorer selected
        Then the explorer detail panel is visible
