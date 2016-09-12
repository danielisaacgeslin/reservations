(function(){
	'use strict';
	angular.module('app').controller('mainController', mainController);

	mainController.$inject = ['$scope', 'storeService'];

	function mainController($scope, storeService) {
		var vm = this;
		vm.date = new Date();
		vm.reservations = {};

		vm.deleteReservation = deleteReservation;

		_activate();

		/*private functions*/
		function _activate(){
			storeService.getReservationList().then(function(reservations){
				vm.reservations = reservations;
			});
		}
		/*end private functions*/

		/*public functions*/
		function deleteReservation(articleId){
			storeService.deleteReservation(articleId);
		}
		/*end public functions*/
	}
})();
