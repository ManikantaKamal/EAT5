'use strict';
reachApp.controller('userController', function ($scope, $http, $window, $rootScope, store,$modal,noty,userService) {
	
		$scope.dateOptions = {
	        formatYear: 'yy',
	        startingDay: 1
	    };
	    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'dd-MMM-yyyy'];
	    $scope.format = $scope.formats[4];
	
	/*
	 * This registerUser function is use full to register user
	 */
	$scope.registerUser = function (res){ 
		if ($scope.UserRegistrationForm.$valid) {
			alert(res);
			userService.register().then(function (res) {
                $scope.OrderMenuJSON = res.ViewModels;
            });
		}
		
        }
});