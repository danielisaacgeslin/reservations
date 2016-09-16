(function(){
	'use strict';

	angular.module('app').config(config).constant('constants',constants());

	function config($stateProvider, $urlRouterProvider, $httpProvider){
		$httpProvider.interceptors.push('interceptor');

		$urlRouterProvider.otherwise('/');
		$stateProvider.state('/', {
			url : '/',
			templateUrl : 'main.html',
			controller: 'mainController',
			controllerAs: 'vm',
			resolve: {ping: ping}
		}).state('/login', {
			url : '/login',
      templateUrl : 'login.html',
      controller: 'loginController',
      controllerAs: 'vm',
			resolve: {checkSession:checkSession}
		}).state('/reservation', {
			url : '/reservation/:id/:date',
      templateUrl : 'reservation.html',
      controller: 'reservationController',
      controllerAs: 'vm',
			resolve: {ping: ping}
		}).state('/tags', {
			url : '/tags',
      templateUrl : 'tags.html',
      controller: 'tagsController',
      controllerAs: 'vm',
			resolve: {ping: ping}
		});
	}

	ping.$inject = ['ajaxService'];
	function ping(ajaxService){
		return ajaxService.ping();
	}

	checkSession.$inject = ['ajaxService'];
	function checkSession(ajaxService){
		return ajaxService.checkSession();
	}

	function constants(){
		return {
			serviceUrl: '/reservations/api/',
			genericErrorMessage: 'An error has occurred',
			genericSuccessMessage: 'Operation successfully achieved',
			toasterTime: 3000
		};
	}

})();
