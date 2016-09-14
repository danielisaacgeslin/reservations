(function(){
	'use strict';
	angular.module('app').filter('dateToNumber', dateToNumberFilter);

	function dateToNumberFilter() {
		return function(input){
      var output = null;
      output = input.getTime();
      return output;
    };
	}
})();
