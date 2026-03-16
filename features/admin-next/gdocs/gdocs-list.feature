Feature: Google Docs list screen

    Scenario: Google Docs screen loads and displays data
        Given I am on the admin-next gdocs page
        Then the gdocs screen is visible
        And the data table is visible

    Scenario: Google Docs can be filtered by document type
        Given I am on the admin-next gdocs page
        Then the "Type" filter is visible in the toolbar

    Scenario: Google Docs can be filtered by publication status
        Given I am on the admin-next gdocs page
        Then the "Status" filter is visible in the toolbar

    Scenario: Google Docs can be searched by title
        Given I am on the admin-next gdocs page
        When I type "test" in the data table search
        Then the data table rows are filtered

    Scenario: Clicking a gdoc row opens the detail panel
        Given I am on the admin-next gdocs page
        When I click the first gdoc row
        Then the gdoc detail panel is visible
        And the URL contains "selected="

    Scenario: Closing the detail panel removes the selected param
        Given I am on the admin-next gdocs page
        When I click the first gdoc row
        And I close the gdoc detail panel
        Then the gdoc detail panel is not visible
        And the URL does not contain "selected="

    Scenario: Detail panel shows gdoc metadata
        Given I am on the admin-next gdocs page
        When I click the first gdoc row
        Then the gdoc detail panel shows the document title
        And the gdoc detail panel shows the document type
