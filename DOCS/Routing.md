# Api Routes

## Base Routing

The base route of the API is: `http(s)://www.<domain>.com/api/<apiVersion>/`. `http://localhost:<port>/api/<apiVersion>` is used for development.

## Routes

Verbs followed by [A] require Administration rights. Verbs followed by [U] require authenticated users.

### /users

*Various basic user actions.*

GET - Return an array of users, according to specified limits

POST [U]- Register a new user

PATCH [U]- Update a user's profile fields 

DELETE [A]- Delete a user from the database/platform immediately

### /users/:username

*Single user profile information*

GET - Return a single user by their username (not feeling so hot on this)

### /serials

*Various operations related to Serial stories*

GET - Retrieve serials from the database, according to specifications

POST [U]- Create a new serial

PATCH [U]- Update information on a specific serial

DELETE [U]- Delete a serial from the platform immediately

### /serials/:serialId

*Various Operations related to Parts/Episodes/Chapters/Etc of Serial Stories*

GET - Retrieve all parts belonging to a Serial 

POST [U]- Create a new part for a serial story

PATCH [U]- Update an existing part of a serial story

### /serials/:serialId/:partId

**In theory the same as above-- skeevy and should be revisited.**

GET - Return a single serial part

DELETE [U]- Delete a serial part immediately

PATCH [U]- Edit a serial part's *number* **(seriously revisit this)**

###  /serial-subscriptions/:serialId/

*Basic serial subscription operations*

POST [U]- Creates a serial subscription

DELETE [U]- Deletes a serial subscription immediately

### /like

*Basic "like" operations*

GET - Gets likes for an item by that item's id as a query param.

POST [U]- Creates a like related to some resource (right now, mainly serials/parts)

### /genre

*Genre operations, mostly moderator stuff aside from GET*

GET - Read genres

POST [A]- Create a new genre

PUT [A]- Update an existing genre

DELETE [A]- Remove a genre from the database immediately

### /report

*Operations for user-generated reports for moderation*

GET [A]- Retrieves all open reports 
POST [U]
- Creates a new Report