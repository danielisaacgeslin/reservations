<?php

class CommentList extends Comment {

    public function getCommentList($reservation_id) {
        if (!isset($reservation_id)) {
            return false;
        }
        $link = Connection::connect();

        $query = 'SELECT * FROM COMMENTS WHERE RESERVATION_ID = :reservation_id';

        $stmt = $link->prepare($query);
        $stmt->bindParam(':reservation_id', $reservation_id, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function __construct() {
        
    }

}

?>