(function(){
	'use strict';
	angular.module('app').controller('appController', appController);

	appController.$inject = ['$scope', '$state'];

	function appController($scope, $state) {
		var vm = this;
    vm.route = null;

    _activate();

    $scope.$watch(function(){return $state.current;}, _updateRoute);

		/*private functions*/
		function _activate(){
			_updateRoute();
		}

    function _updateRoute(){
      vm.route = $state.current.name;
    }
		/*end private functions*/

		/*public functions*/
		/*end public functions*/
	}
})();
