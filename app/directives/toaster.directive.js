(function(){
	'use strict';
	angular.module('app').directive('toaster', toaster);

  toaster.$inject = ['constants'];

	function toaster(constants) {
    return {
      restrict: 'E',
      templateUrl: 'toaster.directive.html',
      link: link,
      scope: {
        data: '='
      }
    };

    function link($scope, $element, $attr){
      var timeout = 0;

      $scope.$watch('data',_toast);
      
      /*private functions*/
      function _toast(){
        if(!$scope.data.type){
          return false;
        }
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          $scope.data = {};
          $scope.$digest();
        }, constants.toasterTime);
      }
      /*end private functions*/

      /*public functions*/
      /*end public functions*/
    }
	}
})();
