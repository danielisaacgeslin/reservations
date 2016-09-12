basic backend for a forum like app to serve as server in UI development exercises

example: <url>?route=getArticle&article_id=1

routes (always as GET parameter "route"):
    - GET
    - ping -> N/A
    - getArticle -> article_id(int)
    - getArticleList -> N/A
    - getArticleTagList -> article_id(int)
    - getComments -> article_id(int)
    - getTags -> N/A

    - POST
    - saveArticle -> title(string), description(string), body(string)
    - updateArticle -> article_id(int), title(string), description(string), body(string)
    - deleteArticle -> article_id(int)
    - addTag -> article_id(int), tag_id(int)
    - removeTag -> article_id(int), tag_id(int)
    - saveComment -> comment(string), article_id(int)
    - deleteComment -> comment_id(int)
    - updateComment -> comment_id(int), comment(string)
    - saveTag -> tag(string)
