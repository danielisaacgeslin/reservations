(function(){
	'use strict';
	angular.module('app').directive('calendar', calendarDirective);

  calendarDirective.$inject = [];

	function calendarDirective() {
    return {
      restrict: 'E',
      templateUrl: 'calendar.directive.html',
      link: link,
      scope: {
          data: '='
      }
    };

    function link($scope){
      console.log($scope);
      /*private functions*/
      /*end private functions*/

      /*public functions*/
      /*end public functions*/
    }
	}
})();
