Feature: IndexFlow

    Users can interact with the home page of our web site where all movies are shown

    Scenario: Seaching for a movie
        Given movies are included in the Database
        When the user enters the main page
        Then The table below will show every movie available at the cinema

    Scenario: Seaching for a movie via the "Search bar"
        Given movies are included in the Database
        When the user clicks on "Search bar"
        And the user searches "Black Panther"
        And the user presses Enter
        Then The table below will show every movie related to the search bar

    Scenario: Looking deeper into a movie
        Given movie is included in the Database
        When the user clicks on a specific movie
        Then the user will be redirected to the movie page, where they will be able to check the description, schedule and trailer of the movie
        (The movie features can be found in the movieFlow.feature)
    
    Scenario: Redirecting Login
        When the user clicks on "Login"
        Then the user would be redirected to the login page, from where they could connect to their account
        (The login features can be found in the loginFlow.feature)
    
    Scenario: Redirecting Personal Area
        Given the user is logged in
        When the user clicks on "Personal Area" where the "login" button should be
        Then the user would be redirected to the Personal Area, where they can see all the purchases they have done
        (The personal area features can be found in the personalAreaFlow.feature)

    Scenario: Adding a movie
        Given the user is connected as an admin
        Then a button "Add movie" will be displayed on the home page
        When the admin clicks on "Add movie"
        Then the admin will be redirected to the adding movie page, where they will be able to add a new movie to the Database
        (The adding movie features can be found in the addingMovieFlow.feature)