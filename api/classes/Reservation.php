<?php
    class Reservation {
        public function setReservation($title, $description, $body, $date, $time){
            $creation_user = 1;

            if(!isset($title) or !isset($description) or !isset($body) or !isset($date) or !isset($time)){
                return false;
            }

            $link = Connection::connect();
            $query = 'INSERT INTO RESERVATIONS '
                    . '(TITLE, DESCRIPTION, BODY, DATE, TIME, CREATION_USER) '
                    . 'VALUES (:title, :description, :body, :date, :time, :creation_user)';
            $stmt = $link->prepare($query);

            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);
            $stmt->bindParam(':body', $body, PDO::PARAM_STR);
            $stmt->bindParam(':date', $date, PDO::PARAM_STR);
            $stmt->bindParam(':time', $time, PDO::PARAM_INT);
            $stmt->bindParam(':creation_user', $creation_user, PDO::PARAM_INT);

            if($stmt -> execute()){
                return $link -> lastInsertId();
            }else{
                return false;
            }
        }

        public function updateReservation($reservation_id, $title, $description, $body, $date, $time){
            $user = 1;

            if(!isset($reservation_id) or !isset($title) or !isset($description) or !isset($body) or !isset($date) or !isset($time)){
                return false;
            }

            $link = Connection::connect();
            $query = 'UPDATE RESERVATIONS SET '
                    . 'TITLE = :title, DESCRIPTION = :description, BODY = :body, DATE = :date, TIME = :time, '
                    . 'EDITION_USER = :edition_user, EDITION_TIMESTAMP = CURRENT_TIMESTAMP '
                    . 'WHERE ID = :reservation_id';
            $stmt = $link->prepare($query);

            $stmt->bindParam(':reservation_id', $reservation_id, PDO::PARAM_INT);
            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);
            $stmt->bindParam(':body', $body, PDO::PARAM_STR);
            $stmt->bindParam(':date', $date, PDO::PARAM_STR);
            $stmt->bindParam(':time', $time, PDO::PARAM_INT);
            $stmt->bindParam(':edition_user', $user, PDO::PARAM_INT);

            if($stmt -> execute()){
                return $stmt -> rowCount();
            }else{
                return false;
            }
        }

        public function getReservation($id){
            $link = Connection::connect();

            $query = 'SELECT A.*, B.FLOOR, B.DEPARTMENT, B.FIRST_NAME, B.LAST_NAME FROM RESERVATIONS AS A '
                    . 'INNER JOIN USERS AS B ON A.CREATION_USER = B.ID WHERE A.ID = :id';

            $stmt = $link->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function deleteReservation($id){
            $link = Connection::connect();

            /*deleting comments*/
            $query = 'DELETE FROM COMMENTS WHERE RESERVATION_ID = :id';

            $stmt = $link->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            $stmt -> execute();

            /*deleting tag list*/
            $query = 'DELETE FROM TAG_LISTS WHERE RESERVATION_ID = :id';

            $stmt = $link->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            $stmt -> execute();

            /*deleting reservation*/
            $query = 'DELETE FROM RESERVATIONS WHERE ID = :id';

            $stmt = $link->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            if($stmt -> execute()){
                return $stmt -> rowCount();
            }else{
                return false;
            }
        }

        public function addTag($reservation_id, $tag_id){
            $link = Connection::connect();

            $query = 'INSERT INTO TAG_LISTS (RESERVATION_ID, TAG_ID) VALUES (:reservation_id, :tag_id)';

            $stmt = $link->prepare($query);

            $stmt->bindParam(':reservation_id', $reservation_id, PDO::PARAM_INT);
            $stmt->bindParam(':tag_id', $tag_id, PDO::PARAM_INT);

            return $stmt->execute();
        }

        public function removeTag($reservation_id, $tag_id){
            $link = Connection::connect();

            $query = 'DELETE FROM TAG_LISTS WHERE RESERVATION_ID = :reservation_id AND TAG_ID = :tag_id';

            $stmt = $link->prepare($query);

            $stmt->bindParam(':reservation_id', $reservation_id, PDO::PARAM_INT);
            $stmt->bindParam(':tag_id', $tag_id, PDO::PARAM_INT);

            return $stmt->execute();
        }

        public function __construct(){

        }
    }
?>
