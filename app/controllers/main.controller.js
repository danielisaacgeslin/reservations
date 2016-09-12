(function(){
	'use strict';
	angular.module('app').controller('mainController', mainController);

	mainController.$inject = ['$scope', 'storeService'];

	function mainController($scope, storeService) {
		var vm = this;
		vm.articles = {};

		vm.deleteArticle = deleteArticle;

		_activate();

		/*private functions*/
		function _activate(){
			storeService.getArticleList().then(function(articles){
				vm.articles = articles;
			});
		}
		/*end private functions*/

		/*public functions*/
		function deleteArticle(articleId){
			storeService.deleteArticle(articleId);
		}
		/*end public functions*/
	}
})();
