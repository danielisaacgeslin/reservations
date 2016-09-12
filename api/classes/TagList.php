<?php
    class TagList extends Tag {
        public function getTagList($reservation_id){
            $link = Connection::connect();
            
            $query = 'SELECT B.ID, B.TEXT FROM TAG_LISTS AS A INNER JOIN TAGS AS B ON A.TAG_ID = B.ID '
                    . 'WHERE A.reservation_ID = :reservation_id';
            
            $stmt = $link->prepare($query);
            $stmt->bindParam(':reservation_id', $reservation_id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        public function getTags(){
            $link = Connection::connect();
            
            $query = 'SELECT * FROM TAGS';
            
            $stmt = $link->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        public function __construct(){
            
        }
    }
?>