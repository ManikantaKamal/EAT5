'use strict';
reachApp.controller('landingController', function ($scope, $http, $window, $rootScope, store,$modal,noty,landingService) {
	
	
	/*
	 * This getmenuOrder function is se full to get the list of main memus to display in landing page
	 */
	$scope.getMenuOrder = function (){ 
		landingService.getOrderMenuJson().then(function (res) {
                $scope.OrderMenuJSON = res.ViewModels;
            });
        }
});