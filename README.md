#Reservations
> A PHP and AngularJS system for apartment buildings

##Quick start

###Instalation
* npm run install

###Development
* gulp test
* gulp dev

###Production
* gulp build

##Routes
> Always as GET parameter "route". Example: `<url>?route=getReservation&reservation_id=1`

###GET
* ping -> `N/A`
* getReservation -> `reservation_id(int)`
* getReservationList -> `N/A`
* getReservationTagList -> `reservation_id(int)`
* getComments -> `reservation_id(int)`
* getTags -> `N/A`

###POST
* saveReservation -> `title(string), description(string), body(string)`
* updateReservation -> `reservation_id(int), title(string), description(string), body(string)`
* deleteReservation -> `reservation_id(int)`
* addTag -> `reservation_id(int), tag_id(int)`
* removeTag -> `reservation_id(int), tag_id(int)`
* saveComment -> `comment(string), reservation_id(int)`
* deleteComment -> `comment_id(int)`
* updateComment -> `comment_id(int), comment(string)`
* saveTag -> `tag(string)`
