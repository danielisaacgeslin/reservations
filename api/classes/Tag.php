<?php
    class Tag {
        public function setTag($tag){
            $creation_user = 1;
            
            if(!isset($tag)){
                return false;
            }
            $link = Connection::connect();
            
            $query = 'INSERT INTO TAGS (TEXT, CREATION_USER) VALUES (:text, :creation_user)';
            $stmt = $link->prepare($query);
            
            $stmt->bindParam(':text', $tag, PDO::PARAM_STR);
            $stmt->bindParam(':creation_user', $creation_user, PDO::PARAM_INT);
            
            return $stmt -> execute();
        }
        
        public function __construct(){
            
        }
    }
?>