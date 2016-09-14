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
          output = 'Evening';
          break;
        case '3':
          output = 'Afternoon';
          break;
        default:
          output = '';
          break;
      }
      return output;
    };
	}
})();
