(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
			controllerAs: 'vm'
		}).state('/login', {
			url : '/login',
      templateUrl : 'login.html',
      controller: 'loginController',
      controllerAs: 'vm'
		}).state('/reservation', {
			url : '/reservation/:id',
      templateUrl : 'reservation.html',
      controller: 'reservationController',
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
			serviceUrl: '/reservations/api/',
			genericErrorMessage: 'An error has occurred',
			genericSuccessMessage: 'Operation successfully achieved',
			toasterTime: 3000
		};
	}

})();

},{}],2:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('appController', appController);

	appController.$inject = ['$scope', '$state', 'storeService', 'ajaxService', 'constants'];

	function appController($scope, $state, storeService, ajaxService, constants) {
		var vm = this;
    vm.route = null;
		vm.currentUser = {};
		vm.toasterData = {};

		vm.logout = logout;

    _activate();

    $scope.$watch(function(){return $state.current;}, _updateRoute);
		$scope.$on('ERROR', _toastError);
		$scope.$on('OK', _toastSuccess);

		/*private functions*/
		function _activate(){
			_updateRoute();
			_getCurrentUser();
		}

		function _toastError(e,data){
			var type = e.name;
			var message = data ? data : constants.genericErrorMessage;
			vm.toasterData = {type: type, message: message};
		}

		function _toastSuccess(e,data){
			var type = e.name;
			var message = data ? data : constants.genericSuccessMessage;
			vm.toasterData = {type: type, message: message};
		}

    function _updateRoute(){
			_getCurrentUser().then(function(){
				vm.route = $state.current.name;
				if(!vm.currentUser.id && $state.current.name && $state.current.name !== '/login'){
					$state.go('/login');
				}
			});
    }

		function _getCurrentUser(){
			return storeService.getCurrentUser().then(function(currentUser){
				vm.currentUser = currentUser;
			});
		}
		/*end private functions*/

		/*public functions*/
		function logout(){
			ajaxService.logout().then(function(){
				vm.currentUser = {};
				storeService.resetCurrentUser();
				$state.go('/login');
			});
		}
		/*end public functions*/
	}
})();

},{}],3:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('loginController', loginController);

	loginController.$inject = ['$scope', '$state', 'storeService', 'ajaxService'];

	function loginController($scope, $state, storeService, ajaxService) {
		var vm = this;
    vm.status = null;
    vm.username = null;
    vm.password = null;

    vm.login = login;

    _activate();

		/*private functions*/
		function _activate(){
      storeService.getCurrentUser().then(function(user){
        if(user.id){
          $state.go('/');
        }
      });
		}

		/*end private functions*/

		/*public functions*/
    function login(){
      vm.status = null;
      ajaxService.login(vm.username, vm.password).then(function(response){
        if(response.data.status === 'ERROR'){
          vm.status = response.data.payload;
        }else{
          storeService.getCurrentUser().then(function(user){
            $state.go('/');
          });
        }
      });
    }
		/*end public functions*/
	}
})();

},{}],4:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('mainController', mainController);

	mainController.$inject = ['$scope', '$q', '$rootScope', 'storeService'];

	function mainController($scope, $q, $rootScope, storeService) {
		var vm = this;
		vm.visualization = 'calendar';
		vm.date = new Date();
		vm.reservations = {};
		vm.reservationCount = 0;
		vm.currentUser = {};

		vm.deleteReservation = deleteReservation;
		vm.switchVisualization = switchVisualization;
		vm.next = next;
		vm.prev = prev;
		vm.getReservationList = getReservationList;

		_activate();

		/*private functions*/
		function _activate(){
			_getReservationList();
			storeService.getCurrentUser().then(function(user){
				vm.currentUser = user;
			});
		}

		function _toastSuccess(){
			var defer = $q.defer();
			$rootScope.$broadcast('OK', '');
			defer.resolve();
			return defer.promise;
		}

		function _getReservationList(){
			var month = vm.date.getMonth() + 1;
			var year = vm.date.getFullYear();

			storeService.getReservationList(month, year).then(function(reservations){
				vm.reservations = reservations;
			});
		}
		/*end private functions*/

		/*public functions*/
		function deleteReservation(articleId){
			storeService.deleteReservation(articleId).then(_toastSuccess).then(function(){
				$scope.$broadcast('updateCalendar');
			});
		}

		function switchVisualization(visualization){
			vm.visualization = visualization;
		}

		function next(){
			vm.date.setMonth(vm.date.getMonth() + 1);
			_getReservationList();
		}

		function prev(asd){
			vm.date.setMonth(vm.date.getMonth() - 1);
			_getReservationList();
		}

		function getReservationList(){
			_getReservationList();
		}
		/*end public functions*/
	}
})();

},{}],5:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('reservationController', reservationController);

	reservationController.$inject = ['$scope', '$rootScope', '$state', '$q', 'storeService', 'ajaxService'];

	function reservationController($scope, $rootScope, $state, $q, storeService, ajaxService) {
		var vm = this;
		vm.reservation = {};
    vm.edition = {
			title: null,
			description: null,
			body: null,
			time: '1',
			date: new Date()
		};
    vm.newComment = '';
    vm.editableComment = -1;
    vm.editableCommentText = '';
		vm.filteredTags = {};
		vm.noTagOption = {0: {id: 0, text: 'No tags available'}};
		vm.selectedTag = null;
		vm.tempId = null;
		vm.editEnabled = true;
		vm.times = [1,2,3];
		vm.reservationValidity = true;
		vm.currentUser = {};

    vm.toggleEdit = toggleEdit;
    vm.saveReservation = saveReservation;
    vm.saveComment = saveComment;
    vm.editComment = editComment;
    vm.updateComment = updateComment;
    vm.deleteComment = deleteComment;
		vm.setTag = setTag;
		vm.deleteTag = deleteTag;
		vm.ableToCheckVailidity = false;

		$scope.$watch('vm.edition.date', _checkValidity);
		$scope.$watch('vm.edition.time', _checkValidity);

		_activate();
    /*private functions*/
		function _activate(){
      if(isNaN($state.params.id)){
				vm.ableToCheckVailidity = true;
				$q.all([_getCurrentUser(),_getTags()]).then(_filterTags);
      }else{
        _getCurrentUser().then(_getReservation).then(function(){
					vm.ableToCheckVailidity = true;
					_getComments();
					_checkValidity();
					$q.all([_getReservationTagList(), _getTags()]).then(_filterTags);
				});
      }
		}

		function _toastSuccess(){
			var defer = $q.defer();
			$rootScope.$broadcast('OK', '');
			defer.resolve();
			return defer.promise;
		}

		function _getCurrentUser(){
			return storeService.getCurrentUser().then(function(user){
				vm.currentUser = user;
			});
		}

		function _checkValidity(){
			var day = vm.edition.date.getDate();
			var month = vm.edition.date.getMonth() + 1;
			var year = vm.edition.date.getFullYear();
			var time = vm.edition.time;

			if(!vm.ableToCheckVailidity){
				return false;
			}

			if(vm.edition.date &&
				 vm.reservation.date &&
				 vm.edition.date.getTime() === vm.reservation.date.getTime() &&
				 vm.edition.time === vm.reservation.time){
				vm.reservationValidity = true;
				return true;
			}

			if(!day || !month || !year || !time){
				vm.reservationValidity = false;
				return false;
			}

			ajaxService.reservationValidity(day, month, year, time).then(function(response){
				vm.reservationValidity = response.data.payload;
			});
		}

    function _getReservation(){
      return storeService.getReservation(vm.tempId ? vm.tempId : $state.params.id).then(function(reservation){
				vm.reservation = reservation;
        vm.edition = Object.assign({},reservation);
				vm.editEnabled = vm.currentUser.id === reservation.creation_user;
			});
    }

    function _getComments(){
      return storeService.getComments(vm.reservation.id);
    }

		function _getReservationTagList(){
			return storeService.getReservationTagList(vm.reservation.id);
		}

		function _getTags(){
			return storeService.getTags().then(function(tags){
				vm.tags = tags;
			});
		}

		function _filterTags(){
			var filteredTags = {},  marker;
			if(!vm.reservation.id){
				vm.filteredTags = vm.noTagOption;
				vm.selectedTag = vm.filteredTags[Object.keys(vm.filteredTags)[0]];
				return false;
			}
			for(var tagKey in vm.tags){
				marker = true;
					for(var reservationTagKey in vm.reservation.tags){
						if(reservationTagKey === vm.tags[tagKey].id){
							marker = false;
							break;
						}
					}
					if(marker){
						filteredTags[tagKey] = Object.assign({}, vm.tags[tagKey]);
					}
			}
			vm.filteredTags = filteredTags;
			if(!Object.keys(vm.filteredTags).length){
				vm.filteredTags = vm.noTagOption;
			}
			vm.selectedTag = vm.filteredTags[Object.keys(vm.filteredTags)[0]];
		}

		function _setReservation(){
			vm.edition.title = vm.edition.title ? vm.edition.title : ' ';
			return storeService.setReservation(vm.edition.title,
				 vm.edition.description,
				 vm.edition.body,
				 vm.edition.date,
				 vm.edition.time,
				 vm.reservation.id).then(function(id){
        if(!vm.reservation.id){
					vm.tempId = id;
          $state.go('/reservation', {id: id}, {
					    notify:false,
					    reload:false,
					    location:'replace',
					    inherit:true
					});
        }
      }).then(_toastSuccess);
		}
    /*end private functions*/

    /*public functions*/
    function toggleEdit(){
      vm.editEnabled = !vm.editEnabled;
      if(!vm.editEnabled){
        vm.edition = Object.assign({},vm.reservation);
      }
    }

    function saveReservation(){
      _setReservation().then(_getReservation).then(_getReservationTagList).then(_getComments).then(_filterTags);
    }

    function saveComment(){
      return storeService.setComment(vm.newComment, vm.reservation.id).then(function(){
        vm.newComment = '';
      }).then(_toastSuccess);
    }

    function updateComment(commentId){
      return storeService.setComment(vm.editableCommentText, null, commentId).then(_toastSuccess).then(editComment);
    }

    function editComment(index, commentId){
      vm.editableCommentText = '';
      if(vm.editableComment === index){
        vm.editableComment = -1;
      }else{
        vm.editableComment = index;
        vm.editableCommentText = !commentId ? '' : vm.reservation.comments[commentId].text;
      }
    }

    function deleteComment(commentId){
      return storeService.deleteComment(commentId, vm.reservation.id).then(_toastSuccess);
    }

		function setTag(){
			storeService.setTag(vm.reservation.id, vm.selectedTag.id)
			.then(_toastSuccess)
			.then(_getReservationTagList)
			.then(_filterTags);
		}

		function deleteTag(tagId){
			return storeService.deleteTag(vm.reservation.id, tagId).then(_toastSuccess).then(_filterTags);
		}
    /*end public functions*/

	}
})();

},{}],6:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('tagsController', tagsController);

	tagsController.$inject = ['$scope', 'storeService'];

	function tagsController($scope, storeService) {
		var vm = this;
		vm.tags = {};

		_activate();

		/*private functions*/
		function _activate(){
			storeService.getTags().then(function(tags){
				vm.tags = tags;
			});
		}
		/*end private functions*/

		/*public functions*/
		/*end public functions*/
	}
})();

},{}],7:[function(require,module,exports){
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
					delete: '='
      }
    };

    function link($scope){
			$scope.days = [];

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
      /*end public functions*/
    }
	}
})();

},{}],8:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').directive('toaster', toaster);

  toaster.$inject = ['constants'];

	function toaster(constants) {
    return {
      restrict: 'E',
      templateUrl: 'toaster.directive.html',
      link: link,
      scope: {
        data: '='
      }
    };

    function link($scope, $element, $attr){
      var timeout = 0;

      $scope.$watch('data',_toast);
      
      /*private functions*/
      function _toast(){
        if(!$scope.data.type){
          return false;
        }
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          $scope.data = {};
          $scope.$digest();
        }, constants.toasterTime);
      }
      /*end private functions*/

      /*public functions*/
      /*end public functions*/
    }
	}
})();

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
require('./modules/app.module');
require('./config');
require('./services/interceptor.service');
require('./services/process.service');
require('./services/ajax.service');
require('./services/store.service');
require('./filters/time.filter');
require('./filters/department.filter');
require('./filters/month.filter');
require('./directives/toaster.directive');
require('./directives/calendar.directive');
require('./controllers/app.controller');
require('./controllers/login.controller');
require('./controllers/main.controller');
require('./controllers/reservation.controller');
require('./controllers/tags.controller');

},{"./config":1,"./controllers/app.controller":2,"./controllers/login.controller":3,"./controllers/main.controller":4,"./controllers/reservation.controller":5,"./controllers/tags.controller":6,"./directives/calendar.directive":7,"./directives/toaster.directive":8,"./filters/department.filter":9,"./filters/month.filter":10,"./filters/time.filter":11,"./modules/app.module":13,"./services/ajax.service":14,"./services/interceptor.service":15,"./services/process.service":16,"./services/store.service":17}],13:[function(require,module,exports){
(function(){
  'use strict';
  angular.module('app', ['ui.router','ngSanitize']);
})();

},{}],14:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').factory('ajaxService', ajaxService);

	ajaxService.$inject = ['$http', '$httpParamSerializerJQLike', 'constants'];

	function ajaxService($http, $httpParamSerializerJQLike, constants) {
		var url = constants.serviceUrl;

		return {
			/*GET*/
			ping: ping, // N/A
			getReservation: getReservation, // reservation_id(int)
			getReservationList: getReservationList, // N/A
			getReservationTagList: getReservationTagList, // reservation_id(int)
			getComments: getComments, // reservation_id(int)
			getTags: getTags, // N/A
			logout: logout,
			reservationValidity: reservationValidity,
			getCurrentUser: getCurrentUser,
			/*POST*/
			saveReservation: saveReservation, // title(string), description(string), body(string), date(string), time(int)
			updateReservation: updateReservation, // reservation_id, title, description, body, date, time
			deleteReservation: deleteReservation, // reservation_id(int)
			addTag: addTag, // reservation_id(int), tag_id(int)
			removeTag: removeTag, // reservation_id(int), tag_id(int)
			saveComment: saveComment, // comment(string), reservation_id(int)
			deleteComment: deleteComment, // comment_id(int)
			updateComment: updateComment, // comment_id(int), comment(string)
			saveTag: saveTag, // tag(string)
			login: login
		};

		/*N/A*/
		function ping(){
			return $http.get(url.concat('?route=ping'));
		}

		function login(username, password){
			return $http({
				url:url.concat('?route=login'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data:$httpParamSerializerJQLike({
					username:username,
					password:password
				})
			});
		}

		function logout(){
			return $http.get(url.concat('?route=logout'));
		}

		function getCurrentUser(){
			return $http.get(url.concat('?route=getCurrentUser'));
		}

		function reservationValidity(day, month, year, time){
			return $http.get(url
			.concat('?route=reservationValidity&day=').concat(day)
			.concat('&month=').concat(month)
			.concat('&year=').concat(year)
			.concat('&time=').concat(time));
		}

		/*reservation_id(int)*/
		function getReservation(reservationId){
			return $http.get(url.concat('?route=getReservation&id=').concat(reservationId));
		}

		/*N/A*/
		function getReservationList(month, year){
			return $http.get(url.concat('?route=getReservationList&month=').concat(month).concat('&year=').concat(year));
		}

		/*reservation_id(int)*/
		function getReservationTagList(reservationId){
			return $http.get(url.concat('?route=getReservationTagList&reservation_id=').concat(reservationId));
		}

		/*reservation_id(int)*/
		function getComments(reservationId){
			return $http.get(url.concat('?route=getComments&reservation_id=').concat(reservationId));
		}

		/*N/A*/
		function getTags(){
			return $http.get(url.concat('?route=getTags'));
		}

		/*title(string), description(string), body(string)*/
		function saveReservation(title, description, body, date, time){
			return $http({
				url:url.concat('?route=saveReservation'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data:$httpParamSerializerJQLike({
					title:title,
					description:description,
					body:body,
					date:date,
					time:time
				})
			});
		}

		/*reservation_id(int), title(string), description(string), body(string)*/
		function updateReservation(reservationId, title, description, body, date, time){
			return $http({
				url:url.concat('?route=updateReservation'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					reservation_id: reservationId,
					title:title,
					description:description,
					body:body,
					date:date,
					time:time
				})
			});
		}

		/*reservation_id(int)*/
		function deleteReservation(reservationId){
			return $http({
				url:url.concat('?route=deleteReservation'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					reservation_id: reservationId
				})
			});
		}

		/*reservation_id(int), tag_id(int)*/
		function addTag(reservationId, tagId){
			return $http({
				url:url.concat('?route=addTag'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					reservation_id: reservationId,
					tag_id: tagId
				})
			});
		}

		/*reservation_id(int), tag_id(int)*/
		function removeTag(reservationId, tagId){
			return $http({
				url:url.concat('?route=removeTag'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					reservation_id: reservationId,
					tag_id: tagId
				})
			});
		}

		/*comment(string), reservation_id(int)*/
		function saveComment(comment, reservationId){
			return $http({
				url:url.concat('?route=saveComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					comment: comment,
					reservation_id: reservationId
				})
			});
		}

		/*comment_id(int)*/
		function deleteComment(commentId){
			return $http({
				url:url.concat('?route=deleteComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					comment_id: commentId
				})
			});
		}

		/*comment_id(int), comment(string)*/
		function updateComment (comment, commentId){
			return $http({
				url:url.concat('?route=updateComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					comment_id: commentId,
					comment: comment
				})
			});
		}

		/*tag(string)*/
		function saveTag(tag){
			return $http({
				url:url.concat('?route=saveTag'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					tag: tag
				})
			});
		}
	}
})();

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').factory('storeService', storeService);

	storeService.$inject = ['ajaxService', 'processService', '$q'];

	function storeService(ajaxService, processService, $q) {
    var reservations = {}, comments = {}, tags = {}, currentUser = {};

		return {
      getReservation: getReservation,
      getReservationList: getReservationList,
      getReservationTagList: getReservationTagList,
      getComments: getComments,
      getTags: getTags,
			getCurrentUser: getCurrentUser,

      setReservation: setReservation,
      setTag: setTag,
      setComment: setComment,

      deleteTag: deleteTag,
      deleteReservation: deleteReservation,
      deleteComment: deleteComment,

      resetReservations: resetReservations,
      resetComments: resetComments,
      resetTags: resetTags,
			resetCurrentUser: resetCurrentUser
    };

		function getCurrentUser(){
			var defer = $q.defer();
			var adapted = null;
			if(currentUser.id){
				defer.resolve(currentUser);
			}else{
				ajaxService.getCurrentUser().then(function(response){
					adapted = processService.dbArrayAdapter([response.data.payload]);
					currentUser = adapted[Object.keys(adapted)[0]];
					defer.resolve(currentUser);
				});
			}
			return defer.promise;
		}

    function getReservation(reservationId){
      var defer = $q.defer();
      var reservation;
      if(reservations[reservationId]){
        defer.resolve(reservations[reservationId]);
      }else{
        ajaxService.getReservation(reservationId).then(function(response){
          reservation = processService.dbArrayAdapter(response.data.payload);
          reservations[reservationId] = reservation[Object.keys(reservation)[0]];
					defer.resolve(reservations[reservationId]);
        });
      }
      return defer.promise;
    }

    function getReservationList(month, year){
      var defer = $q.defer();
      ajaxService.getReservationList(month, year).then(function(response){
        /*keeping old reservations as they were stored*/
        reservations = Object.assign(processService.dbArrayAdapter(response.data.payload), reservations);
        defer.resolve(reservations);
      });
      return defer.promise;
    }

    function getReservationTagList(reservationId){
      var defer = $q.defer();
			var reservationTags;
			ajaxService.getReservationTagList(reservationId).then(function(response){
				reservationTags = processService.dbArrayAdapter(response.data.payload);
				Object.assign(tags, reservationTags);
				reservations[reservationId].tags = reservationTags;
        defer.resolve(reservationTags);
			});
      return defer.promise;
    }

    function getComments(reservationId){
      var defer = $q.defer();
      var newComments;
      ajaxService.getComments(reservationId).then(function(response){
        newComments = processService.dbArrayAdapter(response.data.payload);
        Object.assign(comments,newComments);
        reservations[reservationId].comments = newComments;
        defer.resolve();
      });
      return defer.promise;
    }

    function getTags(){
      var defer = $q.defer();
			ajaxService.getTags().then(function(response){
				tags = Object.assign(processService.dbArrayAdapter(response.data.payload), tags);
				defer.resolve(tags);
			});
      return defer.promise;
    }

    function setReservation(title, description, body, date, time, reservationId){
      var defer = $q.defer();
      /*save*/
      if(!reservationId){
        ajaxService.saveReservation(title, description, body, date, time).then(function(response){
          defer.resolve(response.data.payload);
        });
      /*update*/
      }else{
        ajaxService.updateReservation(reservationId, title, description, body, date, time).then(function(response){
          resetReservation(reservationId);
          defer.resolve(reservationId);
        });
      }
      return defer.promise;
    }

    function setTag(reservationId, tagId, tag){
      var defer = $q.defer();
			ajaxService.addTag(reservationId, tagId).then(function(response){
				defer.resolve(response.data.payload);
			});
      return defer.promise;
    }

    function setComment(comment, reservationId, commentId){
      var defer = $q.defer();
			var newComment = {};
      if(comment, commentId){
        ajaxService.updateComment(comment, commentId).then(function(response){
          comments[commentId].text = comment;
          defer.resolve(response);
        });
      }else{
        ajaxService.saveComment(comment, reservationId).then(function(response){
          newComment = {
						id: response.data.payload,
						text: comment,
						creation_timestamp: new Date(),
						creation_user: currentUser.id,
						floor: currentUser.floor,
						department: currentUser.department
					};
					comments[response.data.payload] = newComment;
					reservations[reservationId].comments[response.data.payload] = newComment;
          defer.resolve(response);
        });
      }
      return defer.promise;
    }

    function deleteTag(reservationId, tagId){
      var defer = $q.defer();
			ajaxService.removeTag(reservationId, tagId).then(function(response){
				delete reservations[reservationId].tags[tagId];
				defer.resolve();
			});
      return defer.promise;
    }

    function deleteReservation(reservationId){
      var defer = $q.defer();
      ajaxService.deleteReservation(reservationId).then(function(response){
        if(reservations[reservationId].comments){
          for(var key in reservations[reservationId].comments){
            delete comments[key];
          }
        }
        delete reservations[reservationId];
        defer.resolve(response);
      });
      return defer.promise;
    }

    function deleteComment(commentId, reservationId){
      var defer = $q.defer();
      ajaxService.deleteComment(commentId).then(function(response){
        delete comments[commentId];
        delete reservations[reservationId].comments[commentId];
        defer.resolve(response);
      });
      return defer.promise;
    }

    function resetReservations(){
      reservations = {};
    }

    function resetReservation(reservationId){
      delete reservations[reservationId];
    }

    function resetTags(){
      tags = {};
    }

    function resetComments(){
      comments = {};
    }

		function resetCurrentUser(){
      currentUser = {};
    }

	}
})();

},{}]},{},[12]);
