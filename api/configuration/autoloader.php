<?php
    function autoloader($class) {
        include_once ROOT . "classes/" . $class . ".php";
    }

    spl_autoload_register("autoloader");
?>