(function(){
	'use strict';
	angular.module('app').controller('tagsController', tagsController);

	tagsController.$inject = ['$scope', 'storeService'];

	function tagsController($scope, storeService) {
		var vm = this;
		vm.tags = {};

		_activate();

		/*private functions*/
		function _activate(){
			storeService.getTags().then(function(tags){
				vm.tags = tags;
			});
		}
		/*end private functions*/

		/*public functions*/
		/*end public functions*/
	}
})();
