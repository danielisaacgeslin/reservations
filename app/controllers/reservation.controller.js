(function(){
	'use strict';
	angular.module('app').controller('reservationController', reservationController);

	reservationController.$inject = ['$scope', '$rootScope', '$state', '$q', '$uibModal', 'storeService', 'ajaxService', 'processService'];

	function reservationController($scope, $rootScope, $state, $q, $uibModal, storeService, ajaxService, processService) {
		var vm = this;

		_activate();

    /*private functions*/
		function _activate(){
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

      if(isNaN($state.params.id)){
				vm.ableToCheckVailidity = true;
				if($state.params.date && !isNaN($state.params.date)){
					vm.edition.date = new Date(Number($state.params.date));
				}
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
			var day = processService.addZeros(vm.edition.date.getDate());
			var month = processService.addZeros(vm.edition.date.getMonth() + 1);
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
			var defer = $q.defer();
      storeService.getReservation(vm.tempId ? vm.tempId : $state.params.id).then(function(reservation){
				vm.reservation = reservation;
        vm.edition = Object.assign({},reservation);
				vm.editEnabled = (vm.currentUser.id === reservation.creation_user) && reservation.date.getTime() > Date.now();
				defer.resolve();
			}).catch(function(){
				$state.go('/reservation',{id:'new', date: Date.now()});
				storeService.resetReservations();
				defer.reject();
			});
			return defer.promise;
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
			var date = vm.edition.date;
			var title = 'About to save a reservation';
			var body = 'You are about to save "'
			.concat(vm.edition.title)
			.concat(' - ')
			.concat(date.getDate()).concat('/').concat(date.getMonth()).concat('/').concat(date.getFullYear())
			.concat('". Are you sure?');

			var modalInstance = $uibModal.open({
				templateUrl : 'confirmation.modal.html',
				controller : 'confirmationModalController',
				controllerAs: 'vm',
				//windowClass : '',
				//backdrop : 'static',
				//keyboard : false,
				resolve: {
					data: {
						title: title,
						body: body
					}
				}
			});

			/*accepting deletion*/
			modalInstance.result
			.then(_setReservation)
			.then(_getReservation)
			.then(_getReservationTagList)
			.then(_getComments)
			.then(_filterTags);
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
			var date = vm.edition.date;
			var title = 'About to delete a comment';
			var body = 'Are you sure?';

			var modalInstance = $uibModal.open({
				templateUrl : 'confirmation.modal.html',
				controller : 'confirmationModalController',
				controllerAs: 'vm',
				//windowClass : '',
				//backdrop : 'static',
				//keyboard : false,
				resolve: {
					data: {
						title: title,
						body: body
					}
				}
			});

			modalInstance.result.then(function(){
				return storeService.deleteComment(commentId, vm.reservation.id).then(_toastSuccess);
			});
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
