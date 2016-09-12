(function(){
	'use strict';
	angular.module('app').factory('processService', processService);

	processService.$inject = [];

	function processService() {
		return {
      dbArrayAdapter: dbArrayAdapter
    };

    function dbArrayAdapter(dbArray){
      var dbObject = {}, tempObj = {}, value;
      if(typeof dbArray !== 'object'){
        return tempObj;
      }
      dbArray.forEach(function(object){
        tempObj = {};
        for(var key in object){
          value = object[key];
          if(new RegExp('timestamp','i').test(key)){
            value = new Date(value);
          }
					if(key === 'DATE'){
						value = new Date(value.replace('-','/').replace('-','/'));
					}
          tempObj[key.toLowerCase()] = value;
        }
        dbObject[tempObj.id] = tempObj;
      });
      return dbObject;
    }

	}
})();
