(function(){
	'use strict';
	angular.module('app').controller('mainController', mainController);

	mainController.$inject = ['$scope', 'storeService'];

	function mainController($scope, storeService) {
		var vm = this;
		vm.visualization = 'calendar';
		vm.date = new Date();
		vm.reservations = {};

		vm.deleteReservation = deleteReservation;
		vm.switchVisualization = switchVisualization;
		vm.next = next;
		vm.prev = prev;
		vm.getReservationList = getReservationList;

		_activate();

		/*private functions*/
		function _activate(){
			_getReservationList();
		}

		function _getReservationList(){
			var month = vm.date.getMonth() + 1;
			var year = vm.date.getFullYear();

			storeService.getReservationList(month, year).then(function(reservations){
				vm.reservations = reservations;
			});
		}
		/*end private functions*/

		/*public functions*/
		function deleteReservation(articleId){
			storeService.deleteReservation(articleId);
		}

		function switchVisualization(visualization){
			vm.visualization = visualization;
		}

		function next(){
			vm.date.setMonth(vm.date.getMonth() + 1);
			_getReservationList();
		}

		function prev(){
			vm.date.setMonth(vm.date.getMonth() - 1);
			_getReservationList();
		}

		function getReservationList(){
			_getReservationList();
		}
		/*end public functions*/
	}
})();
