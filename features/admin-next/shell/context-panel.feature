Feature: Context panel

    Scenario: Context panel is hidden by default
        Given I am on the admin-next charts page
        Then the context panel is not visible

    Scenario: Context panel closes with Escape
        Given the context panel is open on the admin-next page
        When I press "Escape"
        Then the context panel is not visible

    Scenario: Context panel reduces workspace width
        Given the context panel is open on the admin-next page
        Then the workspace area is narrower than full width
