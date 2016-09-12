<?php
    class reservationList extends reservation{
        public function getReservationList(){
            $link = Connection::connect();
            
            $query = 'SELECT * FROM reservationS';
            
            $stmt = $link->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        public function __construct(){
            
        }
    }
?>