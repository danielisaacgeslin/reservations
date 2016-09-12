basic backend for a forum like app to serve as server in UI development exercises

example: <url>?route=getreservation&reservation_id=1

routes (always as GET parameter "route"):
    - GET
    - ping -> N/A
    - getreservation -> reservation_id(int)
    - getreservationList -> N/A
    - getreservationTagList -> reservation_id(int)
    - getComments -> reservation_id(int)
    - getTags -> N/A

    - POST
    - savereservation -> title(string), description(string), body(string)
    - updatereservation -> reservation_id(int), title(string), description(string), body(string)
    - deletereservation -> reservation_id(int)
    - addTag -> reservation_id(int), tag_id(int)
    - removeTag -> reservation_id(int), tag_id(int)
    - saveComment -> comment(string), reservation_id(int)
    - deleteComment -> comment_id(int)
    - updateComment -> comment_id(int), comment(string)
    - saveTag -> tag(string)
