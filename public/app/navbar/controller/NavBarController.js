'use strict';
reachApp.controller('navBarController', ['$rootScope', '$scope', '$location', '$modal', '$log', '$window', 'store', 'noty', '$timeout', 'NavbarService', '$filter', 'underscore', function ($rootScope, $scope, $location, $modal, $log, $window, store, noty, $timeout, NavbarService, $filter, _) {
    
	//$scope.LoggedOnUserRoleCode = 'a666Y';
	

   /* $scope.setNavURL = function (url) {
        $scope.SetUL(url);
    }*/

    $scope.SetUL = function (url) {
        if (url == "#/PostCategory" || url == "#/Post/Search" || url == "#/Post") {
            $scope.navbarurlfromWindow = '/Blog';
        }
        else if (url == "#/classroom" || url == "#/course" || url == "#/ticket" || url == "#/category" || url == "#/Product" || url == "#/announcement" || url == "#/User/Search" || url == "#/Attendance/Search") {
            $scope.navbarurlfromWindow = '/Admin';
        }
        else if (url == "#/AboutUs" || url == "#/faq" || url == "#/Feedback" || url == "#/Support") {
            $scope.active = "";
        }
        else {
            $scope.navbarurlfromWindow = url;
        }
    }

    $scope.SetUL($window.location.hash);

	$scope.LoadMenuJSON = function (){
        $scope.MenuJSON = store.get('UserMenu');
        if ($scope.MenuJSON == undefined || $scope.MenuJSON == null) {
            NavbarService.MenuJson().then(function (res) {
                $scope.MenuJSON = res.ViewModels;
                store.set('UserMenu', $scope.MenuJSON)
            });

        }
        // validatedRequest();
        /*if ($location.path() == '/AboutUs' || $location.path() == '/faq' || $location.path() == '/Feedback' || $location.path() == '/Support') {
            $scope.SetUL($location.path());
        }*/
    }



    //  $timeout(function () { }, 0);

    $('#nav').affix({
        offset: {
            top: $('header').height()
        }
    });

    $scope.navLogoVisibility = "ng-hide";
    angular.element($window).bind("scroll", function (e) {
        if (angular.element("#nav").offset().top > $('header').height()) {
            $scope.$apply(function () {
                $scope.navLogoVisibility = "ng-show";
            });
        }
        else {
            $scope.$apply(function () {
                $scope.navLogoVisibility = "ng-hide";
            });
        }
    });

    $scope.Logout = function () {
        // localStorage.removeItem('loggedonuser');
        //localStorage.removeItem('authToken');
        localStorage.clear();
        $window.location.href = '/';

    };


    $scope.noty = noty; // notify service 

    $scope.noop = function () {
        console.log("noop")
        angular.noop();
    };

    $scope.isActive = function (menu) {
        return menu == $location.path();
    };
    
    
    
    $scope.openRegister = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'userRegisterationPopUP.html',
            controller: 'ModalInstanceCtrl',
            backdrop: 'static',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
    }

   /* $rootScope.$on('view-changed', function (event, args) {
        $scope.visible = ($location.path() == '/login') ? false : true;
        $scope.active = "";
        var loggedonuserinfo = store.get('loggedonuser');
        try {
            if (null != loggedonuserinfo && loggedonuserinfo != undefined) {
                $timeout(function () { LoadMenuJSON(); }, 0);
                //$scope.$apply(function () {
                $scope.LoggedOnUserName = loggedonuserinfo.firstName;
                $scope.LoggedOnUserFullName = loggedonuserinfo.firstName;
                $scope.LoggedOnUserRole = loggedonuserinfo.role;
                $scope.LoggedOnUserRoleCode = loggedonuserinfo.roleCode;
                $scope.LoggedResetPassword = loggedonuserinfo.resetPassword;
                $scope.visibleChgPwd = ($location.path() == '/login') || ($location.path() == '/ChangePassword') ? false : true;
                if ($scope.visibleChgPwd && loggedonuserinfo.resetPassword != null && loggedonuserinfo.resetPassword == '0') {
                    $.visibleChgPwd
                    $scope.changepasswordpage="true";
                      $window.location.href = '#/ChangePassword';
                      alert($scope.changepasswordpage);
                    

                    $scope.Logout();
                }
                //});
            }
            else if ($location.path() != '/login') {
                $scope.Logout();
            }

                LoadMenuJSON();
        }

        catch (e) {
            $scope.Logout();
        }
    });*/


   

}]);
