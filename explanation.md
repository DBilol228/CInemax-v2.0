# Cinemax


Cinemax is a cinema ticket booking application where users can browse movies, view showtimes, choose seats, and book tickets.

Users can create an account, sign in, update their profile, and manage their tickets. Tickets can be cancelled before a screening begins. An interactive seat map shows available, booked, and unavailable seats, while database protection prevents double booking.

Cinema managers can manage movies, halls, seats, and showtimes. Administrators can also view users and change their roles. The system checks for overlapping screenings in the same hall.

The interface supports English and Russian, light and dark themes, and cinematic curtain animations between pages.


# Cinemax APIs


1. POST /api/v1/auth/register

Creates user and uses name, password, email. It hashes the password and saves it, Email is unique

2. POST /api/v1/auth/login

When we login, it checks email and password and returns us JWT token if they are correct if no it responses Error

3. GET /api/v1/users/me

Returns the logged-in user's profile using their JWT token

4. PATCH /api/v1/users/me

Let's the logged in update their name or email. It rejects aan email already used by other users

5. GET /api/vi/users

Allows an admin to see other users with their roles 

6. PATCH /api/v1/users/{user_id}/role

Allows an admin to change users role

7. GET /api/v1/movies

Returns movies with search, filters, sorting and pagination.It returns movies

8. GET /api/v1/movies/{movie_id}

Returns the detail of one movie using its ID. If the movie doesn't exist, it returns status code "404"

9. POST /api/v1/movies

Allows admin or cinema-manager to create a movie

10. PATCH /api/v1/movies/{movie_id}

Allows admin or cinema-manager to update a movie partially

11. DELETE /api/v1/movies/{movie_id}

Allows admin or cinema-manager to delete a movie

12. GET /api/v1/halls

Returns the list of cinema halls ordered by ID

13. POST /api/v1/halls

Allows admin or cinema-manager to create a hall, The hall name must be unique, and capacity must be greater than zero

14. PATCH /api/v1/halls/{hall_id}

Allows admin or cinema-manager to update Hall's info

15. GET /api/v1/halls/{hall_id}/seats

Returns hall's seats ordered by row and seat number. If the doesn't exist it will return status code "404"

16. POST /api/v1/halls/{hall_id}/seats

Allows admin or cinema-manager to add seat to an active hall

17. PATCH /api/v1/seats/{seat_id}

Allows a manager or admin to update a seat’s row, number, or active status

18. POST /api/v1/showtimes

Allows a manager or admin to schedule a movie in a hall and calculates the ending time from the movie’s duration.

19. GET /api/v1/showtimes

Returns showtimes with filters for movie, hall, time range, and status. Results are ordered by starting time and include pagination.

20. GET /api/v1/showtimes/{showtime_id}

Returns the details of one showtime. If it does not exist, it returns 404.

21. PATCH /api/v1/showtimes/{showtime_id}

Allows a manager or admin to update a scheduled showtime while checking timing and overlap rules. Rescheduling is blocked when ticket history exists, and marking it completed is allowed only after it ends.

22. DELETE /api/v1/showtimes/{showtime_id}

Allows a manager or admin to cancel a scheduled showtime before it starts. It also cancels its booked tickets while preserving their history.

23. GET /api/v1/showtimes/{showtime_id}/seats

Returns a public seat map grouped by rows, with seat counts and availability statuses. Seats are marked available, booked, or unavailable based on their active status and tickets for that showtime.

24. POST /api/v1/tickets

Allows a customer to book a seat for a future scheduled showtime, using their identity from the JWT token. It checks the seat’s hall and availability, saves the current ticket price, and returns 409 if the seat is already booked.

25. GET /api/v1/tickets/my

Returns only the logged-in customer’s tickets. It supports status and showtime filters, pagination, and ordering by newest booking first.

26. GET /api/v1/tickets/{ticket_id}

Returns the details of one ticket. Only its owner, a manager, or an admin can view it.

27. POST /api/v1/tickets/{ticket_id}/cancel

Allows the ticket owner or an admin to cancel a booked ticket before the showtime starts. It records the cancellation time and makes the seat available again without deleting the ticket.

28. GET /api/v1/tickets

Allows managers and admins to view tickets from all users. It supports user, showtime, and status filters with pagination.


# Cinemax Functions


Registration and login: Users create an account and sign in.
Profile management: Users view and edit their name and email.
Movie browsing: Visitors search and filter movies and read their descriptions.
Showtime browsing: Visitors find screenings by movie, hall, date, and time.
Seat selection: An interactive map shows which seats are free, booked, or unavailable.
Ticket booking: Customers reserve a seat. The system prevents the same seat from being booked twice for one screening.
Ticket management: Customers view their tickets and cancel them before the screening starts.
Cinema management: Managers add and update movies, halls, seats, and showtimes. The system prevents overlapping screenings in one hall.
User management: Administrators view users and assign roles.
Interface settings: Visitors switch between English and Russian and choose a light or dark theme. Curtain animations play when navigating between pages.