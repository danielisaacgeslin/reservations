(function(){
	'use strict';
	angular.module('app').controller('reservationController', reservationController);

	reservationController.$inject = ['$scope', '$state', '$q', 'storeService'];

	function reservationController($scope, $state, $q, storeService) {
		var vm = this;
		vm.reservation = {};
    vm.edition = {};
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
      _setReservation().then(_getReservation).then(_getReservationTagList).then(_filterTags);
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
