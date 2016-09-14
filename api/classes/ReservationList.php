<?php

class ReservationList extends Reservation {

    public function getReservationList($month, $year) {
        $link = Connection::connect();

        $query = 'SELECT A.*, B.FLOOR, B.DEPARTMENT, B.FIRST_NAME, B.LAST_NAME FROM RESERVATIONS AS A '
                . 'INNER JOIN USERS AS B ON A.CREATION_USER = B.ID '
                . 'WHERE MONTH(A.DATE) = :month AND YEAR(A.DATE) = :year ORDER BY DAY(A.DATE) ASC, A.TIME ASC';

        $stmt = $link->prepare($query);
        $stmt->bindParam(':month', $month, PDO::PARAM_INT);
        $stmt->bindParam(':year', $year, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function __construct() {
        
    }

}

?>
