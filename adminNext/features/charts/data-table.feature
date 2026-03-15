Feature: DataTable component

    Scenario: DataTable renders with toolbar and pagination
        Given I am on the admin-next charts page
        Then the data table is visible
        And the data table toolbar is visible
        And the data table pagination is visible

    Scenario: DataTable shows a search input
        Given I am on the admin-next charts page
        Then the data table search input is visible

    Scenario: DataTable shows column headers
        Given I am on the admin-next charts page
        Then the data table has a column header "Title"
        And the data table has a column header "Type"
        And the data table has a column header "Status"

    Scenario: Searching filters the table rows
        Given I am on the admin-next charts page
        When I type "population" in the data table search
        Then the data table rows are filtered

    Scenario: Clicking a column header sorts the table
        Given I am on the admin-next charts page
        When I click the "Title" column header
        Then the column "Title" is sorted
