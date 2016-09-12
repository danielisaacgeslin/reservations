(function(){
	'use strict';
	angular.module('app').filter('monthFilter', monthFilter);

	function monthFilter() {
		return function(items, date){
      var newItems = {};
      for(var key in items){
        if(items[key].date.getMonth() === date.getMonth() && items[key].date.getFullYear() === date.getFullYear()){
          newItems[key] = items[key];
        }
      }
      return newItems;
    };
	}
})();
