(function(){
	'use strict';
	angular.module('app').controller('confirmationModalController', confirmationModalController);

	confirmationModalController.$inject = ['$scope', '$uibModalInstance', 'data'];

	function confirmationModalController($scope, $uibModalInstance, data) {
		var vm = this;
    vm.data = data;

    vm.cancel = cancel;
    vm.accept = accept;

		_activate();

		/*private functions*/
		function _activate(){

		}
		/*end private functions*/

		/*public functions*/
    function cancel(){
      $uibModalInstance.dismiss('delete');
    }

    function accept(){
      $uibModalInstance.close();
    }
		/*end public functions*/
	}
})();
