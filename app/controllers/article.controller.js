(function(){
	'use strict';
	angular.module('app').controller('articleController', articleController);

	articleController.$inject = ['$scope', '$state', '$q', 'storeService'];

	function articleController($scope, $state, $q, storeService) {
		var vm = this;
		vm.article = {};
    vm.edition = {};
    vm.newComment = '';
    vm.editableComment = -1;
    vm.editableCommentText = '';
		vm.filteredTags = {};
		vm.noTagOption = {0: {id: 0, text: 'No tags available'}};
		vm.selectedTag = null;
		vm.tempId = null;
		vm.editEnabled = true;

    vm.toggleEdit = toggleEdit;
    vm.saveArticle = saveArticle;
    vm.saveComment = saveComment;
    vm.editComment = editComment;
    vm.updateComment = updateComment;
    vm.deleteComment = deleteComment;
		vm.setTag = setTag;
		vm.deleteTag = deleteTag;

		_activate();
    /*private functions*/
		function _activate(){
      if(isNaN($state.params.id)){
				_getTags().then(_filterTags);
      }else{
        _getArticle().then(function(){
					_getComments();
					$q.all([_getArticleTagList(), _getTags()]).then(_filterTags);
				});
      }
		}

    function _getArticle(){
      return storeService.getArticle(vm.tempId ? vm.tempId : $state.params.id).then(function(article){
				vm.article = article;
        vm.edition = Object.assign({},article);
			});
    }

    function _getComments(){
      return storeService.getComments(vm.article.id);
    }

		function _getArticleTagList(){
			return storeService.getArticleTagList(vm.article.id);
		}

		function _getTags(){
			return storeService.getTags().then(function(tags){
				vm.tags = tags;
			});
		}

		function _filterTags(){
			var filteredTags = {},  marker;
			if(!vm.article.id){
				vm.filteredTags = vm.noTagOption;
				vm.selectedTag = vm.filteredTags[Object.keys(vm.filteredTags)[0]];
				return false;
			}
			for(var tagKey in vm.tags){
				marker = true;
					for(var articleTagKey in vm.article.tags){
						if(articleTagKey === vm.tags[tagKey].id){
							marker = false;
							break;
						}
					}
					if(marker){
						filteredTags[tagKey] = Object.assign({}, vm.tags[tagKey]);
					}
			}
			vm.filteredTags = filteredTags;
			if(!Object.keys(vm.filteredTags).length){
				vm.filteredTags = vm.noTagOption;
			}
			vm.selectedTag = vm.filteredTags[Object.keys(vm.filteredTags)[0]];
		}

		function _setArticle(){
			return storeService.setArticle(vm.edition.title, vm.edition.description, vm.edition.body, vm.article.id).then(function(id){
        if(!vm.article.id){
					vm.tempId = id;
          $state.go('/article', {id: id}, {
					    notify:false,
					    reload:false,
					    location:'replace',
					    inherit:true
					});
        }
      });
		}
    /*end private functions*/

    /*public functions*/
    function toggleEdit(){
      vm.editEnabled = !vm.editEnabled;
      if(!vm.editEnabled){
        vm.edition = Object.assign({},vm.article);
      }
    }

    function saveArticle(){
      _setArticle().then(_getArticle).then(_getArticleTagList).then(_filterTags);
    }

    function saveComment(){
      return storeService.setComment(vm.newComment, vm.article.id).then(function(){
        vm.newComment = '';
      });
    }

    function updateComment(commentId){
      return storeService.setComment(vm.editableCommentText, null, commentId).then(editComment);
    }

    function editComment(index, commentId){
      vm.editableCommentText = '';
      if(vm.editableComment === index){
        vm.editableComment = -1;
      }else{
        vm.editableComment = index;
        vm.editableCommentText = !commentId ? '' : vm.article.comments[commentId].text;
      }
    }

    function deleteComment(commentId){
      return storeService.deleteComment(commentId, vm.article.id);
    }

		function setTag(){
			storeService.setTag(vm.article.id, vm.selectedTag.id).then(_getArticleTagList).then(_filterTags);
		}

		function deleteTag(tagId){
			return storeService.deleteTag(vm.article.id, tagId).then(_filterTags);
		}
    /*end public functions*/

	}
})();
