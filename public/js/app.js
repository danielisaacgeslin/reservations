(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
			serviceUrl: '/reservations/api/'
		};
	}

})();

},{}],2:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('appController', appController);

	appController.$inject = ['$scope', '$state'];

	function appController($scope, $state) {
		var vm = this;
    vm.route = null;

    _activate();

    $scope.$watch(function(){return $state.current;}, _updateRoute);

		/*private functions*/
		function _activate(){
			_updateRoute();
		}

    function _updateRoute(){
      vm.route = $state.current.name;
    }
		/*end private functions*/

		/*public functions*/
		/*end public functions*/
	}
})();

},{}],3:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('mainController', mainController);

	mainController.$inject = ['$scope', 'storeService'];

	function mainController($scope, storeService) {
		var vm = this;
		vm.visualization = 'calendar';
		vm.date = new Date();
		vm.reservations = {};
		vm.reservationCount = 0;

		vm.deleteReservation = deleteReservation;
		vm.switchVisualization = switchVisualization;
		vm.next = next;
		vm.prev = prev;
		vm.getReservationList = getReservationList;

		_activate();

		/*private functions*/
		function _activate(){
			_getReservationList();
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
			storeService.deleteReservation(articleId);
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

},{}],4:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('reservationController', reservationController);

	reservationController.$inject = ['$scope', '$state', '$q', 'storeService'];

	function reservationController($scope, $state, $q, storeService) {
		var vm = this;
		vm.reservation = {};
    vm.edition = {
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

    vm.toggleEdit = toggleEdit;
    vm.saveReservation = saveReservation;
    vm.saveComment = saveComment;
    vm.editComment = editComment;
    vm.updateComment = updateComment;
    vm.deleteComment = deleteComment;
		vm.setTag = setTag;
		vm.deleteTag = deleteTag;

		_activate();
    /*private functions*/
		function _activate(){
      if(isNaN($state.params.id)){
				_getTags().then(_filterTags);
      }else{
        _getReservation().then(function(){
					_getComments();
					$q.all([_getReservationTagList(), _getTags()]).then(_filterTags);
				});
      }
		}

    function _getReservation(){
      return storeService.getReservation(vm.tempId ? vm.tempId : $state.params.id).then(function(reservation){
				vm.reservation = reservation;
        vm.edition = Object.assign({},reservation);
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
      });
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
      });
    }

    function updateComment(commentId){
      return storeService.setComment(vm.editableCommentText, null, commentId).then(editComment);
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
      return storeService.deleteComment(commentId, vm.reservation.id);
    }

		function setTag(){
			storeService.setTag(vm.reservation.id, vm.selectedTag.id).then(_getReservationTagList).then(_filterTags);
		}

		function deleteTag(tagId){
			return storeService.deleteTag(vm.reservation.id, tagId).then(_filterTags);
		}
    /*end public functions*/

	}
})();

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
					count: '='
      }
    };

    function link($scope){
			$scope.days = [];

			$scope.$watch('data', _updateCalendar);

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

},{}],7:[function(require,module,exports){
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
    }
	}
})();

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
          output = '';
          break;
      }
      return output;
    }
	}
})();

},{}],10:[function(require,module,exports){
require('./modules/app.module');
require('./config');
require('./services/process.service');
require('./services/ajax.service');
require('./services/store.service');
require('./filters/time.filter');
require('./filters/department.filter');
require('./filters/month.filter');
require('./directives/calendar.directive');
require('./controllers/app.controller');
require('./controllers/main.controller');
require('./controllers/reservation.controller');
require('./controllers/tags.controller');

},{"./config":1,"./controllers/app.controller":2,"./controllers/main.controller":3,"./controllers/reservation.controller":4,"./controllers/tags.controller":5,"./directives/calendar.directive":6,"./filters/department.filter":7,"./filters/month.filter":8,"./filters/time.filter":9,"./modules/app.module":11,"./services/ajax.service":12,"./services/process.service":13,"./services/store.service":14}],11:[function(require,module,exports){
(function(){
  'use strict';
  angular.module('app', ['ui.router','ngSanitize']);
})();

},{}],12:[function(require,module,exports){
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
			/*POST*/
			saveReservation: saveReservation, // title(string), description(string), body(string), date(string), time(int)
			updateReservation: updateReservation, // reservation_id(int), title(string), description(string), body(string), date(string), time(int)
			deleteReservation: deleteReservation, // reservation_id(int)
			addTag: addTag, // reservation_id(int), tag_id(int)
			removeTag: removeTag, // reservation_id(int), tag_id(int)
			saveComment: saveComment, // comment(string), reservation_id(int)
			deleteComment: deleteComment, // comment_id(int)
			updateComment: updateComment, // comment_id(int), comment(string)
			saveTag: saveTag // tag(string)
		};

		/*N/A*/
		function ping(){
			return $http.get(url.concat('?route=ping'));
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').factory('storeService', storeService);

	storeService.$inject = ['ajaxService', 'processService', '$q'];

	function storeService(ajaxService, processService, $q) {
    var reservations = {}, comments = {}, tags = {};

		return {
      getReservation: getReservation,
      getReservationList: getReservationList,
      getReservationTagList: getReservationTagList,
      getComments: getComments,
      getTags: getTags,

      setReservation: setReservation,
      setTag: setTag,
      setComment: setComment,

      deleteTag: deleteTag,
      deleteReservation: deleteReservation,
      deleteComment: deleteComment,

      resetReservations: resetReservations,
      resetComments: resetComments,
      resetTags: resetTags
    };

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
          newComment = {id: response.data.payload, text: comment, creation_timestamp: new Date()};
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

	}
})();

},{}]},{},[10]);
