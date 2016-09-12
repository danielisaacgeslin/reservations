(function(){
	'use strict';

	angular.module('app').config(config).constant('constants',constants());

	function config($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/');
		$stateProvider.state('/', {
			url : '/',
			templateUrl : 'main.html',
			controller: 'mainController',
			controllerAs: 'vm'
		}).state('/article', {
			url : '/article/:id',
      templateUrl : 'article.html',
      controller: 'articleController',
      controllerAs: 'vm'
		}).state('/tags', {
			url : '/tags',
      templateUrl : 'tags.html',
      controller: 'tagsController',
      controllerAs: 'vm'
		});
	}

	function constants(){
		return {
			serviceUrl: '/dgeslin/'
		};
	}

})();
