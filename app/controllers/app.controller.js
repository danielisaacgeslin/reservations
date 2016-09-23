(function(){
	'use strict';
	angular.module('app').controller('appController', appController);

	appController.$inject = ['$scope', '$state', 'storeService', 'ajaxService', 'constants'];

	function appController($scope, $state, storeService, ajaxService, constants) {
		var vm = this;
    vm.route = null;
		vm.currentUser = {};
		vm.toasterData = {};

		vm.logout = logout;

    _activate();

    $scope.$watch(function(){return $state.current;}, _updateRoute);
		$scope.$on('ERROR', _toastError);
		$scope.$on('OK', _toastSuccess);
		$scope.$on('goToLogin', _goToLogin);
		$scope.$on('goToRoot', _goToRoot);

		/*private functions*/
		function _activate(){
			_updateRoute();
		}

		function _goToLogin(){
			$state.go('/login');
		}

		function _goToRoot(){
			$state.go('/');
		}

		function _toastError(e,data){
			var type = e.name;
			var message = data ? data : constants.genericErrorMessage;
			vm.toasterData = {type: type, message: message};
		}

		function _toastSuccess(e,data){
			var type = e.name;
			var message = data ? data : constants.genericSuccessMessage;
			vm.toasterData = {type: type, message: message};
		}

    function _updateRoute(){
			if(!$state.current.name || $state.current.name === '/login'){
				storeService.resetCurrentUser();
				vm.currentUser = {};
				return false;
			}
			_getCurrentUser().then(function(){
				vm.route = $state.current.name;
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
			storeService.logout().then(function(){
				$state.go('/login');
			});
		}
		/*end public functions*/
	}
})();
