Feature: LoginFlow

    Users can login or sign up on our website through this page

    Scenario: Registration
    Given the password is valid
    And Full name is provided
    And email is valid
    When "Sign up" button is clicked
    Then the user will receive an email for verification
    And the user will be redirected to another page suggesting him to verify his email
    When user will have verified his email
    Then the account will be created
    And account data will be stored in our database

    Scenario: Login
    Given email is provided
    And password is provided
    When "Sign in" button is clicked
    Then email and password will be checked in our database
    And the user will be redirected to the home page if email and password are correct