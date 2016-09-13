(function(){
	'use strict';
	angular.module('app').filter('department', departmentFilter);

	function departmentFilter() {
		return function(input){
      var output;
			input = String(input);
      switch(input){
        case '1':
          output = 'A';
          break;
        case '2':
          output = 'B';
          break;
        case '3':
          output = 'C';
          break;
				case '4':
          output = 'D';
          break;
				case '5':
          output = 'E';
          break;
				case '6':
          output = 'F';
          break;
				case '7':
          output = 'G';
          break;
        default:
          output = 'invalid time';
          break;
      }
      return output;
    };
	}
})();
