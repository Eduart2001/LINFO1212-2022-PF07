Feature: PeronalArea

    Users can login and enter their personal area

    Scenario: Cheking purchases
    Given the user has done some purchase
    When the user clicks on "purchases"
    Then every purchase the user has done will be displayed

    Scenario: Password or phone number change
    When the user clicks on "security"
    Then the user will be able to change the password or the phone number giving the old one and typing a new one

    Scenario: User is admin
    Given user role has been changed to admin
    Then the user can add or modify movies

    Scenario: User is not admin
    Then the user can only buy tickets, surf and change his password and phone number