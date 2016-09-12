(function(){
	'use strict';
	angular.module('app').factory('ajaxService', ajaxService);

	ajaxService.$inject = ['$http', '$httpParamSerializerJQLike', 'constants'];

	function ajaxService($http, $httpParamSerializerJQLike, constants) {
    var url = constants.serviceUrl;

		return {
      /*GET*/
      ping: ping, // N/A
      getArticle: getArticle, // article_id(int)
      getArticleList: getArticleList, // N/A
      getArticleTagList: getArticleTagList, // article_id(int)
      getComments: getComments, // article_id(int)
      getTags: getTags, // N/A
      /*POST*/
      saveArticle: saveArticle, // title(string), description(string), body(string)
      updateArticle: updateArticle, // article_id(int), title(string), description(string), body(string)
      deleteArticle: deleteArticle, // article_id(int)
      addTag: addTag, // article_id(int), tag_id(int)
      removeTag: removeTag, // article_id(int), tag_id(int)
      saveComment: saveComment, // comment(string), article_id(int)
      deleteComment: deleteComment, // comment_id(int)
      updateComment: updateComment, // comment_id(int), comment(string)
      saveTag: saveTag // tag(string)
    };

    /*N/A*/
    function ping(){
      return $http.get(url.concat('?route=ping'));
    }

    /*article_id(int)*/
    function getArticle(articleId){
      return $http.get(url.concat('?route=getArticle&id=').concat(articleId));
    }

    /*N/A*/
    function getArticleList(){
      return $http.get(url.concat('?route=getArticleList'));
    }

    /*article_id(int)*/
    function getArticleTagList(articleId){
      return $http.get(url.concat('?route=getArticleTagList&article_id=').concat(articleId));
    }

    /*article_id(int)*/
    function getComments(articleId){
      return $http.get(url.concat('?route=getComments&article_id=').concat(articleId));
    }

    /*N/A*/
    function getTags(){
      return $http.get(url.concat('?route=getTags'));
    }

    /*title(string), description(string), body(string)*/
    function saveArticle(title, description, body){
      return $http({
				url:url.concat('?route=saveArticle'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data:$httpParamSerializerJQLike({
	        title:title,
	        description:description,
	        body:body
	      })
			});
    }

    /*article_id(int), title(string), description(string), body(string)*/
    function updateArticle(articleId, title, description, body){
      return $http({
				url:url.concat('?route=updateArticle'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
	        article_id: articleId,
	        title:title,
	        description:description,
	        body:body
	      })
			});
    }

    /*article_id(int)*/
    function deleteArticle(articleId){
			return $http({
				url:url.concat('?route=deleteArticle'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
	        article_id: articleId
	      })
			});
    }

    /*article_id(int), tag_id(int)*/
    function addTag(articleId, tagId){
			return $http({
				url:url.concat('?route=addTag'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					article_id: articleId,
	        tag_id: tagId
	      })
			});
    }

    /*article_id(int), tag_id(int)*/
    function removeTag(articleId, tagId){
			return $http({
				url:url.concat('?route=removeTag'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					article_id: articleId,
	        tag_id: tagId
	      })
			});
    }

    /*comment(string), article_id(int)*/
    function saveComment(comment, articleId){
			return $http({
				url:url.concat('?route=saveComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					comment: comment,
	        article_id: articleId
	      })
			});
    }

    /*comment_id(int)*/
    function deleteComment(commentId){
			return $http({
				url:url.concat('?route=deleteComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					comment_id: commentId
	      })
			});
    }

    /*comment_id(int), comment(string)*/
    function updateComment (comment, commentId){
			return $http({
				url:url.concat('?route=updateComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					comment_id: commentId,
					comment: comment
	      })
			});
    }

    /*tag(string)*/
    function saveTag(tag){
			return $http({
				url:url.concat('?route=saveTag'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					tag: tag
	      })
			});
    }

	}
})();
