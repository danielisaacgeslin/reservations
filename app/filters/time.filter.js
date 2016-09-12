(function(){
	'use strict';
	angular.module('app').filter('time', timeFilter);

	function timeFilter() {
		return function(input){
      var output;
			input = String(input);
      switch(input){
        case '1':
          output = 'Morning';
          break;
        case '2':
          output = 'Afternoon';
          break;
        case '3':
          output = 'Evening';
          break;
        default:
          output = 'invalid time';
          break;
      }
      return output;
    }
	}
})();
