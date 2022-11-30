Feature: purchaseFlow

    Users can buy a ticket for a movie in our web site

    Scenario: Buying a ticket
        Given there are still available seats in the movie theater
        And the user is logged in
        When the user chooses the number of tickets and the seat(s) wanted
        Then the user will be able to buy the ticket(s)
        When the user clicks on "Buy"
        Then the user will receive an email with the ticket(s) as QR code(s) which will allow the access to the cinema
        And the user will be redirected to the personal area, where they can see all the purchases they have done
        (The personal area features can be found in the personalAreaFlow.feature)

    Scenario: Sold-out status
        Given all seats are taken for the chosen time
        Then a sold-out status will be displayed preventing the user from buying a ticket
        And will be asked to choose another time