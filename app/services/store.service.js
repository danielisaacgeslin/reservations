(function(){
	'use strict';
	angular.module('app').factory('storeService', storeService);

	storeService.$inject = ['ajaxService', 'processService', '$q'];

	function storeService(ajaxService, processService, $q) {
    var reservations = {}, comments = {}, tags = {}, currentUser = {};

		var currentUserDefer = null;

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
			resetCurrentUser: resetCurrentUser,

			logout: logout
    };

		function logout(){
			var defer = $q.defer();
			ajaxService.logout().then(function(){
				resetCurrentUser();
				resetReservations();
				resetTags();
				resetComments();
				defer.resolve();
			});
			return defer.promise;
		}

		function getCurrentUser(){
			var adapted = null;
			var firstRequest = false;

			if(!currentUserDefer){
				firstRequest = true;
				currentUserDefer = $q.defer();
			}

			if(currentUser.id){
				currentUserDefer.resolve(currentUser);
			}

			if(!currentUser.id && firstRequest){
				ajaxService.getCurrentUser().then(function(response){
					adapted = processService.dbArrayAdapter([response.data.payload]);
					currentUser = adapted[Object.keys(adapted)[0]];
					currentUserDefer.resolve(currentUser);
				});
			}

			return currentUserDefer.promise;
		}

    function getReservation(reservationId){
      var defer = $q.defer();
      var reservation;
      if(reservations[reservationId]){
        defer.resolve(reservations[reservationId]);
      }else{
        ajaxService.getReservation(reservationId).then(function(response){
					if(!response.data.payload.length){
						defer.reject();
						return defer.promise;
					}
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
			if(Object.keys(tags).length){
				defer.resolve(tags);
			}else{
				ajaxService.getTags().then(function(response){
					tags = Object.assign(processService.dbArrayAdapter(response.data.payload), tags);
					defer.resolve(tags);
				});
			}
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
			currentUserDefer = null;
      currentUser = {};
    }

	}
})();
