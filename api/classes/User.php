<?php

class User {
    
    public function validateSession(){
        if(isset($_SESSION['ID'])){
            return true;
        }else{
            return false;
        }
    }

    public function login($username, $password) {
        $password = md5($password);
        
        $link = Connection::connect();

        $query = 'SELECT ID, ROLE, USERNAME, EMAIL, FIRST_NAME, LAST_NAME, FLOOR, DEPARTMENT FROM USERS '
                . 'WHERE USERNAME = :username AND PASSWORD = :password';

        $stmt = $link->prepare($query);

        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
        
        $stmt ->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if($result){
            foreach($result as $key => $value){
                $_SESSION[$key] = $value;
            }
        }
        return $result;
    }
    
    public function logout(){
        session_unset();
        session_destroy();
        return true;
    }

    public function __construct() {
        session_start();
    }

}

?>
