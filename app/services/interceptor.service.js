(function(){
	'use strict';
	angular.module('app').factory('interceptor', interceptor);

	interceptor.$inject = ['$q','$rootScope'];

	function interceptor($q, $rootScope) {
		return {
      request: request,
      requestError: requestError,
      response: response,
      responseError: responseError
    };

    function request(config){
      return config;
    }

    function requestError(rejection){
      return $q.reject(rejection);
    }

    function response(response){
      if(response.data.status === 'ERROR'){
        $rootScope.$broadcast('ERROR', response.data.payload);
        return $q.reject(response);
      }
      return response;
    }

    function responseError(rejection){
      $rootScope.$broadcast('ERROR', '');
      return $q.reject(rejection);
    }

	}
})();
