<?php
    class Comment {
        public function setComment($comment, $reservation_id){
            $creation_user = 1;
            
            if(!isset($comment) or !isset($reservation_id)){
                return false;
            }
            
            $link = Connection::connect();
            
            $query = 'INSERT INTO COMMENTS (TEXT, CREATION_USER, RESERVATION_ID) VALUES (:text, :creation_user, :reservation_id)';
            
            $stmt = $link->prepare($query);
            
            $stmt->bindParam(':text', $comment, PDO::PARAM_STR);
            $stmt->bindParam(':reservation_id', $reservation_id, PDO::PARAM_INT);
            $stmt->bindParam(':creation_user', $creation_user, PDO::PARAM_INT);
            
            if($stmt -> execute()){
                return $link->lastInsertId();
            }else{
                return false;
            }
        }
        
        public function deleteComment($comment_id){
            $link = Connection::connect();
            
            $query = 'DELETE FROM COMMENTS WHERE ID = :comment_id';
            $stmt = $link->prepare($query);
            $stmt->bindParam(':comment_id', $comment_id, PDO::PARAM_INT);
            
            if($stmt -> execute()){
                return true;
            }else{
                return false;
            }
        }
        
        public function updateComment($comment_id, $comment){
            $link = Connection::connect();
            
            $query = 'UPDATE COMMENTS SET TEXT = :comment WHERE ID = :comment_id';
            $stmt = $link->prepare($query);
            $stmt->bindParam(':comment', $comment, PDO::PARAM_STR);
            $stmt->bindParam(':comment_id', $comment_id, PDO::PARAM_INT);
            
            if($stmt -> execute()){
                return true;
            }else{
                return false;
            }
        }
        
        public function __construct(){
            
        }
    }
?>