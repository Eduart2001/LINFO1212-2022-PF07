Feature: AddingMovieFlow

    Admins can add new movies to the database

    Scenario: Adding new movie
    Given cover of the movie is given
    And description, gender and recommended age is given
    And schedule is given
    When admin clicks on "add"
    Then the movie will be added in the database
    And the movie will be displayed on the home page