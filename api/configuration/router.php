<?php

$route = isset($_GET['route']) ? $_GET['route'] : '';
$user = new User();

$sessionValidity = $user->validateSession();

if ($route === 'login') {
    if (!$sessionValidity) {
        $result = $user->login($_POST['username'], $_POST['password']);
        ($result ? response(OK, $result) : response(ERROR, INVALID_LOGIN));
        return false;
    } else {
        response(ERROR, SESSION_ACTIVE);
        return false;
    }
}

if(!$sessionValidity){
    response(ERROR, INVALID_PRIVILEGES);
    return false;
}

switch ($route) {
    case 'ping':
        response(OK, array("time" => time()));
        break;
    case 'logout':
        response(OK, $user->logout());
        break;
    case 'getCurrentUser':
        response(OK, $_SESSION);
        break;
    case 'reservationValidity':
        $reservation = new Reservation();
        $result = $reservation->reservationValidity($_GET['day'], $_GET['month'], $_GET['year'], $_GET['time']);
        ($result ? response(OK, true) : response(ERROR, false));
        break;
    case 'getReservation':
        $reservation = new Reservation();
        response(OK, $reservation->getReservation($_GET['id']));
        break;
    case 'saveReservation':
        $reservation = new Reservation();
        $result = $reservation->setReservation($_POST['title'], $_POST['date'], $_POST['time']);
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    case 'updateReservation':
        $reservation = new Reservation();
        $result = $reservation->updateReservation($_POST['reservation_id'], $_POST['title'], $_POST['date'], $_POST['time']);
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    case 'deleteReservation':
        $reservation = new Reservation();
        $result = $reservation->deleteReservation($_POST['reservation_id']);
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    case 'addTag':
        $reservation = new Reservation();
        $result = $reservation->addTag($_POST['reservation_id'], $_POST['tag_id']);
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    case 'removeTag':
        $reservation = new Reservation();
        $result = $reservation->removeTag($_POST['reservation_id'], $_POST['tag_id']);
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    case 'getReservationList':
        $reservationList = new ReservationList();
        $result = $reservationList->getReservationList($_GET['month'], $_GET['year']);
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    case 'saveComment':
        $comment = new Comment();
        $result = $comment->setComment($_POST['comment'], $_POST['reservation_id']);
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    case 'deleteComment':
        $comment = new Comment();
        $result = $comment->deleteComment($_POST['comment_id']);
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    case 'updateComment':
        $comment = new Comment();
        $result = $comment->updateComment($_POST['comment_id'], $_POST['comment']);
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    case 'getComments':
        $commentList = new CommentList();
        $result = $commentList->getCommentList($_GET['reservation_id']);
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    case 'saveTag':
        $tag = new Tag();
        $result = $tag->setTag($_POST['tag']);
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    case 'getReservationTagList':
        $tagList = new TagList();
        $result = $tagList->getTagList($_GET['reservation_id']);
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    case 'getTags':
        $tagList = new TagList();
        $result = $tagList->getTags();
        ($result ? response(OK, $result) : response(ERROR, ""));
        break;
    default:
        response(ERROR, INVALID_ROUTE);
        break;
}
?>
