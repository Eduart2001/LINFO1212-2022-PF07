Feature: MovieFlow

    Users can visit a movie page to see the information related to it

    Scenario: Looking for description
        Given movie is included in the Database
        And movie information has been released
        When the user enters a specific movie page
        Then in the center of the page there will be the synopsis, recommended age and genre of the movie

    Scenario: Looking for a trailer
        Given movie is included in the Database
        And movie trailer has been released
        When the user enters a specific movie page
        Then in the center, under the synopsis, a trailer of the movie will be displayed

    Scenario: Checking available time
        Given movie is included in the Database
        And movie has been released
        When the user enters a specific movie page
        Then in the right part of the page the schedule of the movie will be displayed, depending on the day chosen on the date label

    Scenario: Modify movie information
        Given user is admin
        When admin clicks on "modify"
        Then admin can change movie information
        And changes will be stored in the database

    Scenario: Buying a ticket for a movie
        Given movie is included in the Database
        And movie has been released
        And time chosen is available
        When the user clicks on the desired time
        Then the user will be redirected to the purchase page, where they will be able to buy the number of tickets and choose the seats they want
        (The purchase features can be found in the purchaseFlow.feature)