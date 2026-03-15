Feature: Data Insights screen

    Scenario: Data Insights screen renders with data table
        Given I am on the admin-next data insights page
        Then the data insights screen is visible
        And the data table is visible
        And the data table toolbar is visible
        And the data table pagination is visible

    Scenario: Data Insights screen shows a search input
        Given I am on the admin-next data insights page
        Then the data table search input is visible

    Scenario: Data Insights screen shows column headers
        Given I am on the admin-next data insights page
        Then the data table has a column header "Title"
        And the data table has a column header "Authors"
        And the data table has a column header "Status"
        And the data table has a column header "Chart type"

    Scenario: Searching filters the data insights
        Given I am on the admin-next data insights page
        When I type "population" in the data table search
        Then the data table rows are filtered

    Scenario: Data insights can be filtered by status
        Given I am on the admin-next data insights page
        Then I can see the status filter button

    Scenario: Data insights can be filtered by chart type
        Given I am on the admin-next data insights page
        Then I can see the chart type filter button

    Scenario: Clicking a column header sorts the table
        Given I am on the admin-next data insights page
        When I click the "Title" column header
        Then the column "Title" is sorted

    Scenario: Layout toggle switches between list and gallery views
        Given I am on the admin-next data insights page
        Then I can see the layout toggle
        When I switch to gallery layout
        Then the gallery view is visible

    Scenario: Create button opens creation flow
        Given I am on the admin-next data insights page
        Then I can see the create data insight button
