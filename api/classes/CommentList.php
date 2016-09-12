<?php
    class CommentList extends Comment {
        public function getCommentList($article_id){
            if(!isset($article_id)){
                return false;
            }
            $link = Connection::connect();
            
            $query = 'SELECT * FROM COMMENTS WHERE ARTICLE_ID = :article_id';
            
            $stmt = $link->prepare($query);
            $stmt->bindParam(':article_id', $article_id, PDO::PARAM_INT);
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        public function __construct(){
            
        }
    }
?>