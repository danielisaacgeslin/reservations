!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){!function(){"use strict";function config($stateProvider,$urlRouterProvider,$httpProvider){$httpProvider.interceptors.push("interceptor"),$urlRouterProvider.otherwise("/"),$stateProvider.state("/",{url:"/",templateUrl:"main.html",controller:"mainController",controllerAs:"vm"}).state("/login",{url:"/login",templateUrl:"login.html",controller:"loginController",controllerAs:"vm"}).state("/reservation",{url:"/reservation/:id/:date",templateUrl:"reservation.html",controller:"reservationController",controllerAs:"vm"}).state("/tags",{url:"/tags",templateUrl:"tags.html",controller:"tagsController",controllerAs:"vm"})}function constants(){return{serviceUrl:"/reservations/api/",genericErrorMessage:"An error has occurred",genericSuccessMessage:"Operation successfully achieved",toasterTime:3e3}}angular.module("app").config(config).constant("constants",constants())}()},{}],2:[function(require,module,exports){!function(){"use strict";function appController($scope,$state,storeService,ajaxService,constants){function _activate(){_updateRoute(),_getCurrentUser()}function _toastError(e,data){var type=e.name,message=data?data:constants.genericErrorMessage;vm.toasterData={type:type,message:message}}function _toastSuccess(e,data){var type=e.name,message=data?data:constants.genericSuccessMessage;vm.toasterData={type:type,message:message}}function _updateRoute(){_getCurrentUser().then(function(){vm.route=$state.current.name,!vm.currentUser.id&&$state.current.name&&"/login"!==$state.current.name&&$state.go("/login")})}function _getCurrentUser(){return storeService.getCurrentUser().then(function(currentUser){vm.currentUser=currentUser})}function logout(){ajaxService.logout().then(function(){vm.currentUser={},storeService.resetCurrentUser(),$state.go("/login")})}var vm=this;vm.route=null,vm.currentUser={},vm.toasterData={},vm.logout=logout,_activate(),$scope.$watch(function(){return $state.current},_updateRoute),$scope.$on("ERROR",_toastError),$scope.$on("OK",_toastSuccess)}angular.module("app").controller("appController",appController),appController.$inject=["$scope","$state","storeService","ajaxService","constants"]}()},{}],3:[function(require,module,exports){!function(){"use strict";function loginController($scope,$state,storeService,ajaxService){function _activate(){storeService.getCurrentUser().then(function(user){user.id&&$state.go("/")})}function login(){vm.status=null,ajaxService.login(vm.username,vm.password).then(function(response){"ERROR"===response.data.status?vm.status=response.data.payload:storeService.getCurrentUser().then(function(user){$state.go("/")})})}var vm=this;vm.status=null,vm.username=null,vm.password=null,vm.login=login,_activate()}angular.module("app").controller("loginController",loginController),loginController.$inject=["$scope","$state","storeService","ajaxService"]}()},{}],4:[function(require,module,exports){!function(){"use strict";function mainController($scope,$q,$rootScope,$state,storeService){function _activate(){_getReservationList(),storeService.getCurrentUser().then(function(user){vm.currentUser=user})}function _toastSuccess(){var defer=$q.defer();return $rootScope.$broadcast("OK",""),defer.resolve(),defer.promise}function _getReservationList(){var month=vm.date.getMonth()+1,year=vm.date.getFullYear();storeService.getReservationList(month,year).then(function(reservations){vm.reservations=reservations})}function deleteReservation(articleId){storeService.deleteReservation(articleId).then(_toastSuccess).then(function(){$scope.$broadcast("updateCalendar")})}function switchVisualization(visualization){vm.visualization=visualization}function next(){vm.date.setMonth(vm.date.getMonth()+1),_getReservationList()}function prev(asd){vm.date.setMonth(vm.date.getMonth()-1),_getReservationList()}function goToNewReservaton(date){$state.go("/reservation",{id:"new",date:date.getTime()})}function getReservationList(){_getReservationList()}var vm=this;vm.visualization="calendar",vm.date=new Date,vm.reservations={},vm.reservationCount=0,vm.currentUser={},vm.deleteReservation=deleteReservation,vm.switchVisualization=switchVisualization,vm.next=next,vm.prev=prev,vm.getReservationList=getReservationList,vm.goToNewReservaton=goToNewReservaton,_activate()}angular.module("app").controller("mainController",mainController),mainController.$inject=["$scope","$q","$rootScope","$state","storeService"]}()},{}],5:[function(require,module,exports){!function(){"use strict";function reservationController($scope,$rootScope,$state,$q,storeService,ajaxService){function _activate(){isNaN($state.params.id)?(vm.ableToCheckVailidity=!0,$state.params.date&&!isNaN($state.params.date)&&(vm.edition.date=new Date(Number($state.params.date))),$q.all([_getCurrentUser(),_getTags()]).then(_filterTags)):_getCurrentUser().then(_getReservation).then(function(){return!(!vm.reservation||!vm.reservation.id)&&(vm.ableToCheckVailidity=!0,_getComments(),_checkValidity(),void $q.all([_getReservationTagList(),_getTags()]).then(_filterTags))})}function _toastSuccess(){var defer=$q.defer();return $rootScope.$broadcast("OK",""),defer.resolve(),defer.promise}function _getCurrentUser(){return storeService.getCurrentUser().then(function(user){vm.currentUser=user})}function _checkValidity(){var day=vm.edition.date.getDate(),month=vm.edition.date.getMonth()+1,year=vm.edition.date.getFullYear(),time=vm.edition.time;return!!vm.ableToCheckVailidity&&(vm.edition.date&&vm.reservation.date&&vm.edition.date.getTime()===vm.reservation.date.getTime()&&vm.edition.time===vm.reservation.time?(vm.reservationValidity=!0,!0):day&&month&&year&&time?void ajaxService.reservationValidity(day,month,year,time).then(function(response){vm.reservationValidity=response.data.payload}):(vm.reservationValidity=!1,!1))}function _getReservation(){return storeService.getReservation(vm.tempId?vm.tempId:$state.params.id).then(function(reservation){return reservation?(vm.reservation=reservation,vm.edition=Object.assign({},reservation),void(vm.editEnabled=vm.currentUser.id===reservation.creation_user)):($state.go("/reservation",{id:"new",date:Date.now()}),storeService.resetReservations(),!1)})}function _getComments(){return storeService.getComments(vm.reservation.id)}function _getReservationTagList(){return storeService.getReservationTagList(vm.reservation.id)}function _getTags(){return storeService.getTags().then(function(tags){vm.tags=tags})}function _filterTags(){var marker,filteredTags={};if(!vm.reservation.id)return vm.filteredTags=vm.noTagOption,vm.selectedTag=vm.filteredTags[Object.keys(vm.filteredTags)[0]],!1;for(var tagKey in vm.tags){marker=!0;for(var reservationTagKey in vm.reservation.tags)if(reservationTagKey===vm.tags[tagKey].id){marker=!1;break}marker&&(filteredTags[tagKey]=Object.assign({},vm.tags[tagKey]))}vm.filteredTags=filteredTags,Object.keys(vm.filteredTags).length||(vm.filteredTags=vm.noTagOption),vm.selectedTag=vm.filteredTags[Object.keys(vm.filteredTags)[0]]}function _setReservation(){return vm.edition.title=vm.edition.title?vm.edition.title:" ",storeService.setReservation(vm.edition.title,vm.edition.description,vm.edition.body,vm.edition.date,vm.edition.time,vm.reservation.id).then(function(id){vm.reservation.id||(vm.tempId=id,$state.go("/reservation",{id:id},{notify:!1,reload:!1,location:"replace",inherit:!0}))}).then(_toastSuccess)}function toggleEdit(){vm.editEnabled=!vm.editEnabled,vm.editEnabled||(vm.edition=Object.assign({},vm.reservation))}function saveReservation(){_setReservation().then(_getReservation).then(_getReservationTagList).then(_getComments).then(_filterTags)}function saveComment(){return storeService.setComment(vm.newComment,vm.reservation.id).then(function(){vm.newComment=""}).then(_toastSuccess)}function updateComment(commentId){return storeService.setComment(vm.editableCommentText,null,commentId).then(_toastSuccess).then(editComment)}function editComment(index,commentId){vm.editableCommentText="",vm.editableComment===index?vm.editableComment=-1:(vm.editableComment=index,vm.editableCommentText=commentId?vm.reservation.comments[commentId].text:"")}function deleteComment(commentId){return storeService.deleteComment(commentId,vm.reservation.id).then(_toastSuccess)}function setTag(){storeService.setTag(vm.reservation.id,vm.selectedTag.id).then(_toastSuccess).then(_getReservationTagList).then(_filterTags)}function deleteTag(tagId){return storeService.deleteTag(vm.reservation.id,tagId).then(_toastSuccess).then(_filterTags)}var vm=this;vm.reservation={},vm.edition={title:null,description:null,body:null,time:"1",date:new Date},vm.newComment="",vm.editableComment=-1,vm.editableCommentText="",vm.filteredTags={},vm.noTagOption={0:{id:0,text:"No tags available"}},vm.selectedTag=null,vm.tempId=null,vm.editEnabled=!0,vm.times=[1,2,3],vm.reservationValidity=!0,vm.currentUser={},vm.toggleEdit=toggleEdit,vm.saveReservation=saveReservation,vm.saveComment=saveComment,vm.editComment=editComment,vm.updateComment=updateComment,vm.deleteComment=deleteComment,vm.setTag=setTag,vm.deleteTag=deleteTag,vm.ableToCheckVailidity=!1,$scope.$watch("vm.edition.date",_checkValidity),$scope.$watch("vm.edition.time",_checkValidity),_activate()}angular.module("app").controller("reservationController",reservationController),reservationController.$inject=["$scope","$rootScope","$state","$q","storeService","ajaxService"]}()},{}],6:[function(require,module,exports){!function(){"use strict";function tagsController($scope,storeService){function _activate(){storeService.getTags().then(function(tags){vm.tags=tags})}var vm=this;vm.tags={},_activate()}angular.module("app").controller("tagsController",tagsController),tagsController.$inject=["$scope","storeService"]}()},{}],7:[function(require,module,exports){!function(){"use strict";function calendarDirective(){function link($scope){function _updateCalendar(){var month=$scope.date.getMonth(),year=$scope.date.getFullYear(),days=_getDaysInMonth(month,year),count=0;days=days.map(function(day){day.items=[],day.empty=!0;for(var item in $scope.data)_compareDates(day.date,$scope.data[item].date)&&(day.items.push($scope.data[item]),day.empty=!1,count++);return day}),$scope.count=count,$scope.days=days}function _getDaysInMonth(month,year){for(var date=new Date(year,month,1),days=[];date.getMonth()===month;)days.push({date:new Date(date)}),date.setDate(date.getDate()+1);return days}function _compareDates(date1,date2){return date1.getTime()===date2.getTime()}$scope.days=[],$scope.$watch("data",_updateCalendar),$scope.$on("updateCalendar",_updateCalendar)}return{restrict:"E",templateUrl:"calendar.directive.html",link:link,scope:{data:"=",date:"=",count:"=",user:"=",delete:"=",newReservation:"="}}}angular.module("app").directive("calendar",calendarDirective),calendarDirective.$inject=[]}()},{}],8:[function(require,module,exports){!function(){"use strict";function toaster(constants){function link($scope,$element,$attr){function _toast(){return!!$scope.data.type&&(clearTimeout(timeout),void(timeout=setTimeout(function(){$scope.data={},$scope.$digest()},constants.toasterTime)))}var timeout=0;$scope.$watch("data",_toast)}return{restrict:"E",templateUrl:"toaster.directive.html",link:link,scope:{data:"="}}}angular.module("app").directive("toaster",toaster),toaster.$inject=["constants"]}()},{}],9:[function(require,module,exports){!function(){"use strict";function dateToNumberFilter(){return function(input){var output=null;return output=input.getTime()}}angular.module("app").filter("dateToNumber",dateToNumberFilter)}()},{}],10:[function(require,module,exports){!function(){"use strict";function departmentFilter(){return function(input){var output;switch(input=String(input)){case"1":output="A";break;case"2":output="B";break;case"3":output="C";break;case"4":output="D";break;case"5":output="E";break;case"6":output="F";break;case"7":output="G";break;default:output="invalid time"}return output}}angular.module("app").filter("department",departmentFilter)}()},{}],11:[function(require,module,exports){!function(){"use strict";function monthFilter(){return function(items,date){var newItems={};for(var key in items)items[key].date.getMonth()===date.getMonth()&&items[key].date.getFullYear()===date.getFullYear()&&(newItems[key]=items[key]);return newItems}}angular.module("app").filter("monthFilter",monthFilter)}()},{}],12:[function(require,module,exports){!function(){"use strict";function timeFilter(){return function(input){var output;switch(input=String(input)){case"1":output="Morning";break;case"2":output="Evening";break;case"3":output="Afternoon";break;default:output=""}return output}}angular.module("app").filter("time",timeFilter)}()},{}],13:[function(require,module,exports){require("./modules/app.module"),require("./config"),require("./services/interceptor.service"),require("./services/process.service"),require("./services/ajax.service"),require("./services/store.service"),require("./filters/time.filter"),require("./filters/department.filter"),require("./filters/month.filter"),require("./filters/dateToNumber.filter"),require("./directives/toaster.directive"),require("./directives/calendar.directive"),require("./controllers/app.controller"),require("./controllers/login.controller"),require("./controllers/main.controller"),require("./controllers/reservation.controller"),require("./controllers/tags.controller")},{"./config":1,"./controllers/app.controller":2,"./controllers/login.controller":3,"./controllers/main.controller":4,"./controllers/reservation.controller":5,"./controllers/tags.controller":6,"./directives/calendar.directive":7,"./directives/toaster.directive":8,"./filters/dateToNumber.filter":9,"./filters/department.filter":10,"./filters/month.filter":11,"./filters/time.filter":12,"./modules/app.module":14,"./services/ajax.service":15,"./services/interceptor.service":16,"./services/process.service":17,"./services/store.service":18}],14:[function(require,module,exports){!function(){"use strict";angular.module("app",["ui.router","ngSanitize"])}()},{}],15:[function(require,module,exports){!function(){"use strict";function ajaxService($http,$httpParamSerializerJQLike,constants){function ping(){return $http.get(url.concat("?route=ping"))}function login(username,password){return $http({url:url.concat("?route=login"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({username:username,password:password})})}function logout(){return $http.get(url.concat("?route=logout"))}function getCurrentUser(){return $http.get(url.concat("?route=getCurrentUser"))}function reservationValidity(day,month,year,time){return $http.get(url.concat("?route=reservationValidity&day=").concat(day).concat("&month=").concat(month).concat("&year=").concat(year).concat("&time=").concat(time))}function getReservation(reservationId){return $http.get(url.concat("?route=getReservation&id=").concat(reservationId))}function getReservationList(month,year){return $http.get(url.concat("?route=getReservationList&month=").concat(month).concat("&year=").concat(year))}function getReservationTagList(reservationId){return $http.get(url.concat("?route=getReservationTagList&reservation_id=").concat(reservationId))}function getComments(reservationId){return $http.get(url.concat("?route=getComments&reservation_id=").concat(reservationId))}function getTags(){return $http.get(url.concat("?route=getTags"))}function saveReservation(title,description,body,date,time){return $http({url:url.concat("?route=saveReservation"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({title:title,description:description,body:body,date:date,time:time})})}function updateReservation(reservationId,title,description,body,date,time){return $http({url:url.concat("?route=updateReservation"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({reservation_id:reservationId,title:title,description:description,body:body,date:date,time:time})})}function deleteReservation(reservationId){return $http({url:url.concat("?route=deleteReservation"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({reservation_id:reservationId})})}function addTag(reservationId,tagId){return $http({url:url.concat("?route=addTag"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({reservation_id:reservationId,tag_id:tagId})})}function removeTag(reservationId,tagId){return $http({url:url.concat("?route=removeTag"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({reservation_id:reservationId,tag_id:tagId})})}function saveComment(comment,reservationId){return $http({url:url.concat("?route=saveComment"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({comment:comment,reservation_id:reservationId})})}function deleteComment(commentId){return $http({url:url.concat("?route=deleteComment"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({comment_id:commentId})})}function updateComment(comment,commentId){return $http({url:url.concat("?route=updateComment"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({comment_id:commentId,comment:comment})})}function saveTag(tag){return $http({url:url.concat("?route=saveTag"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({tag:tag})})}var url=constants.serviceUrl;return{ping:ping,getReservation:getReservation,getReservationList:getReservationList,getReservationTagList:getReservationTagList,getComments:getComments,getTags:getTags,logout:logout,reservationValidity:reservationValidity,getCurrentUser:getCurrentUser,saveReservation:saveReservation,updateReservation:updateReservation,deleteReservation:deleteReservation,addTag:addTag,removeTag:removeTag,saveComment:saveComment,deleteComment:deleteComment,updateComment:updateComment,saveTag:saveTag,login:login}}angular.module("app").factory("ajaxService",ajaxService),ajaxService.$inject=["$http","$httpParamSerializerJQLike","constants"]}()},{}],16:[function(require,module,exports){!function(){"use strict";function interceptor($q,$rootScope){function request(config){return config}function requestError(rejection){return $q.reject(rejection)}function response(response){return"ERROR"===response.data.status?($rootScope.$broadcast("ERROR",response.data.payload),$q.reject(response)):response}function responseError(rejection){return $rootScope.$broadcast("ERROR",""),$q.reject(rejection)}return{request:request,requestError:requestError,response:response,responseError:responseError}}angular.module("app").factory("interceptor",interceptor),interceptor.$inject=["$q","$rootScope"]}()},{}],17:[function(require,module,exports){!function(){"use strict";function processService(){function dbArrayAdapter(dbArray){var value,dbObject={},tempObj={};return"object"!=typeof dbArray?tempObj:(dbArray.forEach(function(object){tempObj={};for(var key in object)value=object[key],new RegExp("timestamp","i").test(key)&&(value=new Date(value)),"DATE"===key&&(value=new Date(value.replace("-","/").replace("-","/"))),tempObj[key.toLowerCase()]=value;dbObject[tempObj.id]=tempObj}),dbObject)}return{dbArrayAdapter:dbArrayAdapter}}angular.module("app").factory("processService",processService),processService.$inject=[]}()},{}],18:[function(require,module,exports){!function(){"use strict";function storeService(ajaxService,processService,$q){function getCurrentUser(){var defer=$q.defer(),adapted=null;return currentUser.id?defer.resolve(currentUser):ajaxService.getCurrentUser().then(function(response){adapted=processService.dbArrayAdapter([response.data.payload]),currentUser=adapted[Object.keys(adapted)[0]],defer.resolve(currentUser)}),defer.promise}function getReservation(reservationId){var reservation,defer=$q.defer();return reservations[reservationId]?defer.resolve(reservations[reservationId]):ajaxService.getReservation(reservationId).then(function(response){reservation=processService.dbArrayAdapter(response.data.payload),reservations[reservationId]=reservation[Object.keys(reservation)[0]],defer.resolve(reservations[reservationId])}),defer.promise}function getReservationList(month,year){var defer=$q.defer();return ajaxService.getReservationList(month,year).then(function(response){reservations=Object.assign(processService.dbArrayAdapter(response.data.payload),reservations),defer.resolve(reservations)}),defer.promise}function getReservationTagList(reservationId){var reservationTags,defer=$q.defer();return ajaxService.getReservationTagList(reservationId).then(function(response){reservationTags=processService.dbArrayAdapter(response.data.payload),Object.assign(tags,reservationTags),reservations[reservationId].tags=reservationTags,defer.resolve(reservationTags)}),defer.promise}function getComments(reservationId){var newComments,defer=$q.defer();return ajaxService.getComments(reservationId).then(function(response){newComments=processService.dbArrayAdapter(response.data.payload),Object.assign(comments,newComments),reservations[reservationId].comments=newComments,defer.resolve()}),defer.promise}function getTags(){var defer=$q.defer();return ajaxService.getTags().then(function(response){tags=Object.assign(processService.dbArrayAdapter(response.data.payload),tags),defer.resolve(tags)}),defer.promise}function setReservation(title,description,body,date,time,reservationId){var defer=$q.defer();return reservationId?ajaxService.updateReservation(reservationId,title,description,body,date,time).then(function(response){resetReservation(reservationId),defer.resolve(reservationId)}):ajaxService.saveReservation(title,description,body,date,time).then(function(response){defer.resolve(response.data.payload)}),defer.promise}function setTag(reservationId,tagId,tag){var defer=$q.defer();return ajaxService.addTag(reservationId,tagId).then(function(response){defer.resolve(response.data.payload)}),defer.promise}function setComment(comment,reservationId,commentId){var defer=$q.defer(),newComment={};return commentId?ajaxService.updateComment(comment,commentId).then(function(response){comments[commentId].text=comment,defer.resolve(response)}):ajaxService.saveComment(comment,reservationId).then(function(response){newComment={id:response.data.payload,text:comment,creation_timestamp:new Date,creation_user:currentUser.id,floor:currentUser.floor,department:currentUser.department},comments[response.data.payload]=newComment,reservations[reservationId].comments[response.data.payload]=newComment,defer.resolve(response)}),defer.promise}function deleteTag(reservationId,tagId){var defer=$q.defer();return ajaxService.removeTag(reservationId,tagId).then(function(response){delete reservations[reservationId].tags[tagId],defer.resolve()}),defer.promise}function deleteReservation(reservationId){var defer=$q.defer();return ajaxService.deleteReservation(reservationId).then(function(response){if(reservations[reservationId].comments)for(var key in reservations[reservationId].comments)delete comments[key];delete reservations[reservationId],defer.resolve(response)}),defer.promise}function deleteComment(commentId,reservationId){var defer=$q.defer();return ajaxService.deleteComment(commentId).then(function(response){delete comments[commentId],delete reservations[reservationId].comments[commentId],defer.resolve(response)}),defer.promise}function resetReservations(){reservations={}}function resetReservation(reservationId){delete reservations[reservationId]}function resetTags(){tags={}}function resetComments(){comments={}}function resetCurrentUser(){currentUser={}}var reservations={},comments={},tags={},currentUser={};return{getReservation:getReservation,getReservationList:getReservationList,getReservationTagList:getReservationTagList,getComments:getComments,getTags:getTags,getCurrentUser:getCurrentUser,setReservation:setReservation,setTag:setTag,setComment:setComment,deleteTag:deleteTag,deleteReservation:deleteReservation,deleteComment:deleteComment,resetReservations:resetReservations,resetComments:resetComments,resetTags:resetTags,resetCurrentUser:resetCurrentUser}}angular.module("app").factory("storeService",storeService),storeService.$inject=["ajaxService","processService","$q"]}()},{}]},{},[13]);