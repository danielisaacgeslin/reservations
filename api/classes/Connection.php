<?php
    class Connection {
        private function __construct() {

        }

        static function connect() {
            $options = array(PDO::MYSQL_ATTR_INIT_COMMAND => "set names UTF8");
            $link = new PDO("mysql:host=" . HOST . ";dbname=" . DATA_BASE, DB_USER, DB_PASSWORD, $options);
            $link->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
            return $link;
        }
    }
?>