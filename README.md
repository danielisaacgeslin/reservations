A PHP and AngularJS reservations system for apartment buildings

example: `<url>?route=getReservation&reservation_id=1`

#routes (always as GET parameter "route"):
* GET
* ping -> `N/A`
* getReservation -> `reservation_id(int)`
* getReservationList -> `N/A`
* getReservationTagList -> `reservation_id(int)`
* getComments -> `reservation_id(int)`
* getTags -> `N/A`

* POST
* saveReservation -> `title(string), description(string), body(string)`
* updateReservation -> `reservation_id(int), title(string), description(string), body(string)`
* deleteReservation -> `reservation_id(int)`
* addTag -> `reservation_id(int), tag_id(int)`
* removeTag -> `reservation_id(int), tag_id(int)`
* saveComment -> `comment(string), reservation_id(int)`
* deleteComment -> `comment_id(int)`
* updateComment -> `comment_id(int), comment(string)`
* saveTag -> `tag(string)`

#Instalation
* npm install

#Development
* gulp lint
* gulp dev

#Production
* gulp build
