<?php
    class Article {  
        public function setArticle($title, $description, $body){
            $creation_user = 1;
            
            if(!isset($title) or !isset($description) or !isset($body)){
                return false;
            }
            
            $link = Connection::connect();
            $query = 'INSERT INTO ARTICLES '
                    . '(TITLE, DESCRIPTION, BODY, CREATION_USER) '
                    . 'VALUES (:title, :description, :body, :creation_user)';
            $stmt = $link->prepare($query);
            
            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);
            $stmt->bindParam(':body', $body, PDO::PARAM_STR);
            $stmt->bindParam(':creation_user', $creation_user, PDO::PARAM_INT);
            
            if($stmt -> execute()){
                return $link -> lastInsertId();
            }else{
                return false;
            }
        }
        
        public function updateArticle($article_id, $title, $description, $body){
            $user = 1;
            
            if(!isset($article_id) or !isset($title) or !isset($description) or !isset($body)){
                return false;
            }
            
            $link = Connection::connect();
            $query = 'UPDATE ARTICLES SET '
                    . 'TITLE = :title, DESCRIPTION = :description, BODY = :body, '
                    . 'EDITION_USER = :edition_user, EDITION_TIMESTAMP = CURRENT_TIMESTAMP '
                    . 'WHERE ID = :article_id';
            $stmt = $link->prepare($query);
            
            $stmt->bindParam(':article_id', $article_id, PDO::PARAM_INT);
            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);
            $stmt->bindParam(':body', $body, PDO::PARAM_STR);
            $stmt->bindParam(':edition_user', $user, PDO::PARAM_INT);
            
            if($stmt -> execute()){
                return $stmt -> rowCount();
            }else{
                return false;
            }
        }
        
        public function getArticle($id){
            $link = Connection::connect();
            
            $query = 'SELECT * FROM ARTICLES WHERE ID = :id';
            
            $stmt = $link->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        public function deleteArticle($id){
            $link = Connection::connect();
            
            /*deleting comments*/
            $query = 'DELETE FROM COMMENTS WHERE ARTICLE_ID = :id';
            
            $stmt = $link->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            
            $stmt -> execute();
            
            /*deleting tag list*/
            $query = 'DELETE FROM TAG_LISTS WHERE ARTICLE_ID = :id';
            
            $stmt = $link->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            
            $stmt -> execute();
            
            /*deleting article*/
            $query = 'DELETE FROM ARTICLES WHERE ID = :id';
            
            $stmt = $link->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            
            if($stmt -> execute()){
                return $stmt -> rowCount();
            }else{
                return false;
            }
        }
        
        public function addTag($article_id, $tag_id){
            $link = Connection::connect();
            
            $query = 'INSERT INTO TAG_LISTS (ARTICLE_ID, TAG_ID) VALUES (:article_id, :tag_id)';
            
            $stmt = $link->prepare($query);
            
            $stmt->bindParam(':article_id', $article_id, PDO::PARAM_INT);
            $stmt->bindParam(':tag_id', $tag_id, PDO::PARAM_INT);
            
            return $stmt->execute();
        }
        
        public function removeTag($article_id, $tag_id){
            $link = Connection::connect();
            
            $query = 'DELETE FROM TAG_LISTS WHERE ARTICLE_ID = :article_id AND TAG_ID = :tag_id';
            
            $stmt = $link->prepare($query);
            
            $stmt->bindParam(':article_id', $article_id, PDO::PARAM_INT);
            $stmt->bindParam(':tag_id', $tag_id, PDO::PARAM_INT);
            
            return $stmt->execute();
        }
        
        public function __construct(){
            
        }
    }
?>