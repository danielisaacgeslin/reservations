(function(){
	'use strict';
	angular.module('app').factory('ajaxService', ajaxService);

	ajaxService.$inject = ['$http', '$httpParamSerializerJQLike', 'constants'];

	function ajaxService($http, $httpParamSerializerJQLike, constants) {
		var url = constants.serviceUrl;

		return {
			/*GET*/
			ping: ping, // N/A,
			checkSession: checkSession,

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

		/*N/A*/
		function checkSession(){
			return $http.get(url.concat('?route=checkSession'));
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
