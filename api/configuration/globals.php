<?php
    function response($status, $payload) {
        echo json_encode(array(
            "status" => $status,
            "payload" => $payload
        ));
    }
?>