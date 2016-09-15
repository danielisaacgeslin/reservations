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
          data: '=',
					date: '=',
					count: '=',
					user: '=',
					delete: '=',
					newReservation: '='
      }
    };

    function link($scope){
			$scope.days = [];

			$scope.checkVaidity = checkVaidity;
			$scope.getNewHref = getNewHref;

			$scope.$watch('data', _updateCalendar);
			$scope.$on('updateCalendar',_updateCalendar);

      /*private functions*/
			function _updateCalendar(){
				var month = $scope.date.getMonth();
				var year = $scope.date.getFullYear();
				var days = _getDaysInMonth(month, year);
				var count = 0;

				days = days.map(function(day){
					day.items = [];
					day.empty = true;
					for(var item in $scope.data){
						if(_compareDates(day.date, $scope.data[item].date)){
							day.items.push($scope.data[item]);
							day.empty = false;
							count++;
						}
					}
					return day;
				});
				$scope.count = count;
				$scope.days = days;
			}

			function _getDaysInMonth(month, year) {
				var date = new Date(year, month, 1);
				var days = [];
				while (date.getMonth() === month) {
					days.push({date: new Date(date)});
					date.setDate(date.getDate() + 1);
				}
				return days;
			}

			function _compareDates(date1, date2){
				return date1.getTime() === date2.getTime();
			}
      /*end private functions*/

      /*public functions*/
			function checkVaidity(date){
				var time = date.getTime();
				var yesterday = new Date().setDate(new Date().getDate() - 1);
				return time > yesterday;
			}

			function getNewHref(date){
				return checkVaidity(date) ? '#/reservation/new/'.concat(date.getTime()) : '';
			}
      /*end public functions*/
    }
	}
})();
