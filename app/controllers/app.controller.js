(function(){
	'use strict';
	angular.module('app').controller('appController', appController);

	appController.$inject = ['$scope', '$state', 'storeService', 'ajaxService'];

	function appController($scope, $state, storeService, ajaxService) {
		var vm = this;
    vm.route = null;
		vm.currentUser = {};

		vm.logout = logout;

    _activate();

    $scope.$watch(function(){return $state.current;}, _updateRoute);

		/*private functions*/
		function _activate(){
			_updateRoute();
			_getCurrentUser();
		}

    function _updateRoute(){
      vm.route = $state.current.name;
    }

		function _getCurrentUser(){
			storeService.getCurrentUser().then(function(currentUser){
				vm.currentUser = currentUser;
			});
		}
		/*end private functions*/

		/*public functions*/
		function logout(){
			ajaxService.logout().then(function(){
				$state.reload();
			});
		}
		/*end public functions*/
	}
})();
