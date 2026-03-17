Feature: Datasets list screen

    Scenario: Datasets screen loads and displays data
        Given I am on the admin-next datasets page
        Then the datasets screen is visible
        And the data table is visible

    Scenario: Datasets can be filtered by namespace
        Given I am on the admin-next datasets page
        Then the "Namespace" filter is visible in the toolbar

    Scenario: Datasets can be searched by name
        Given I am on the admin-next datasets page
        When I type "test" in the data table search
        Then the data table rows are filtered

    Scenario: Clicking a dataset row opens the detail panel
        Given I am on the admin-next datasets page
        When I click the first dataset row
        Then the dataset detail panel is visible
        And the URL contains "selected="

    Scenario: Closing the detail panel removes the selected param
        Given I am on the admin-next datasets page
        When I click the first dataset row
        And I close the dataset detail panel
        Then the dataset detail panel is not visible
        And the URL does not contain "selected="

    Scenario: Detail panel shows dataset metadata
        Given I am on the admin-next datasets page
        When I click the first dataset row
        Then the dataset detail panel shows the dataset name
        And the dataset detail panel shows the namespace
