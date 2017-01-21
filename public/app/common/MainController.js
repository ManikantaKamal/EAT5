'use strict';
reachApp.controller('mainController',['$rootScope', '$scope', '$location','$timeout', 'noty','breadcrumbs','store', 'underscore','$window','$route',function ($rootScope, $scope, $location, $timeout, noty,breadcrumbs,store,_,$window,$route) {
    $scope.navVisible=true;
    $scope.noty = noty;
    //http://stackoverflow.com/questions/21715256/angularjs-event-to-call-after-content-is-loaded
    $scope.breadcrumbs = breadcrumbs;
    $scope.ParseJSON = function (obj) {
        var result = JSON.parse(obj);
        return result;
    }
    $scope.$on('$viewContentLoaded', function (args, item) {
      //  console.log("Loaded View = [ " + $location.path() + "]");
        $timeout(function () { $rootScope.$broadcast('view-changed', { "view": $location.path() }) }, 200);        
       
    });

    $scope.menuclicked = function () {
        $scope.myStyle = { display: 'none' };

    }
    
    $rootScope.$$listeners.showLoadProgressBar=[];
    $rootScope.$on('showLoadProgressBar',function(i,o){
        if ( o.progress == 'show' )
            {                
                angular.element('#' + o.container).html("");
                angular.element('#' + o.container).append( '<div class="customLoaderMsg  well-transparent" style="font-size:17px;"><center><i class="fa fa-spinner fa fa-spin fa fa-lg"></i></center>&nbsp;</div>' );
            }
            else
            {
                angular.element('#' + o.container).find( ".customLoaderMsg" ).remove();
            }
    });
    
    $scope.$on('$routeChangeStart', function () {
    	
    	$scope.authorizeRequest();
    });
    
    
   	 
    	
    
   
}])();