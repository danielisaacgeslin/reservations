(function(){
	'use strict';
	angular.module('app').controller('loginController', loginController);

	loginController.$inject = ['$scope', '$state', 'storeService', 'ajaxService'];

	function loginController($scope, $state, storeService, ajaxService) {
		var vm = this;
    vm.status = null;
    vm.username = null;
    vm.password = null;

    vm.login = login;

    _activate();

		/*private functions*/
		function _activate(){
			
		}

		/*end private functions*/

		/*public functions*/
    function login(){
      vm.status = null;
      ajaxService.login(vm.username, vm.password).then(function(response){
        if(response.data.status === 'ERROR'){
          vm.status = response.data.payload;
        }else{
          $state.go('/');
        }
      });
    }
		/*end public functions*/
	}
})();
