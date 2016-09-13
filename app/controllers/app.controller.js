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
			_getCurrentUser().then(function(){
				vm.route = $state.current.name;
				if(!vm.currentUser.id && $state.current.name && $state.current.name !== '/login'){
					$state.go('/login');
				}
			});
    }

		function _getCurrentUser(){
			return storeService.getCurrentUser().then(function(currentUser){
				vm.currentUser = currentUser;
			});
		}
		/*end private functions*/

		/*public functions*/
		function logout(){
			ajaxService.logout().then(function(){
				vm.currentUser = {};
				storeService.resetCurrentUser();
				$state.go('/login');
			});
		}
		/*end public functions*/
	}
})();
