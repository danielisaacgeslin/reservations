<?php
    class reservationList extends reservation{
        public function getReservationList(){
            $link = Connection::connect();
            
            $query = 'SELECT A.*, B.FLOOR, B.DEPARTMENT, B.FIRST_NAME, B.LAST_NAME FROM RESERVATIONS AS A '
                    . 'INNER JOIN USERS AS B ON A.CREATION_USER = B.ID';
            
            $stmt = $link->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        public function __construct(){
            
        }
    }
?>