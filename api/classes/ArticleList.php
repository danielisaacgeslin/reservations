<?php
    class ArticleList extends Article{
        public function getArticleList(){
            $link = Connection::connect();
            
            $query = 'SELECT * FROM ARTICLES';
            
            $stmt = $link->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        public function __construct(){
            
        }
    }
?>