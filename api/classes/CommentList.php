<?php

class CommentList extends Comment {

    public function getCommentList($reservation_id) {
        if (!isset($reservation_id)) {
            return false;
        }
        $link = Connection::connect();

        $query = 'SELECT A.*, B.FIRST_NAME, B.LAST_NAME, B.FLOOR, B.DEPARTMENT '
                . 'FROM COMMENTS AS A INNER JOIN USERS AS B ON A.CREATION_USER = B.ID '
                . 'WHERE A.RESERVATION_ID = :reservation_id';

        $stmt = $link->prepare($query);
        $stmt->bindParam(':reservation_id', $reservation_id, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function __construct() {
        
    }

}

?>