<?php
    /* DIRECTORIES */
    define("ROOT", $_SERVER["DOCUMENT_ROOT"] . "/reservations/api/");
    define("ROOT_URL", "https://" . $_SERVER["SERVER_NAME"] . "/reservations/api/");
    
    /* DATABASE */
    define("DATA_BASE", "RESERVATIONS");
    define("HOST", "localhost");
    define("DB_USER", "root");
    define("DB_PASSWORD", "");
    
    /*RESPONSES*/
    define("OK", "OK");
    define("ERROR", "ERROR");
    define("INVALID_ROUTE", "route is missing or unrecognized");
?>