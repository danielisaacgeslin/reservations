<?php
    $route = isset($_GET['route']) ? $_GET['route'] : '';
    
    switch($route){
        case 'ping':
            response(OK, array("time" => time()));
            break;
        case 'getArticle':
            $article = new Article();
            response(OK, $article -> getArticle($_GET['id']));
            break;
        case 'saveArticle':
            $article = new Article();
            $result = $article -> setArticle($_POST['title'], $_POST['description'], $_POST['body']);
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        case 'updateArticle':
            $article = new Article();
            $result = $article -> updateArticle($_POST['article_id'], $_POST['title'], $_POST['description'], $_POST['body']);
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        case 'deleteArticle':
            $article = new Article();
            $result = $article -> deleteArticle($_POST['article_id']);
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        case 'addTag':
            $article = new Article();
            $result = $article -> addTag($_POST['article_id'], $_POST['tag_id']);
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        case 'removeTag':
            $article = new Article();
            $result = $article -> removeTag($_POST['article_id'], $_POST['tag_id']);
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        case 'getArticleList':
            $articleList = new ArticleList();
            $result = $articleList -> getArticleList();
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        case 'saveComment':
            $comment = new Comment();
            $result = $comment -> setComment($_POST['comment'], $_POST['article_id']);
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        case 'deleteComment':
            $comment = new Comment();
            $result = $comment -> deleteComment($_POST['comment_id']);
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        case 'updateComment':
            $comment = new Comment();
            $result = $comment -> updateComment($_POST['comment_id'], $_POST['comment']);
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        case 'getComments':
            $commentList = new CommentList();
            $result = $commentList -> getCommentList($_GET['article_id']);
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        case 'saveTag':
            $tag = new Tag();
            $result = $tag ->setTag($_POST['tag']);
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        case 'getArticleTagList':
            $tagList = new TagList();
            $result = $tagList ->getTagList($_GET['article_id']);
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        case 'getTags':
            $tagList = new TagList();
            $result = $tagList ->getTags();
            ($result ? response(OK, $result) : response(ERROR, ""));
            break;
        default:
            response(ERROR, INVALID_ROUTE);
            break;
    }
?>