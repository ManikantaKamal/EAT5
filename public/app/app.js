'use strict';
var reachApp = angular.module('app', ['ngRoute', 'ngResource', 'ngAnimate', 'ngBackstretch', 'highcharts-ng', 'ngHolder', 
                                      'nvd3ChartDirectives', 'datatables', 'datatables.bootstrap', 'ui.bootstrap', 'ngSanitize', 
                                      'ui.select', 'daterangepicker', 'toggle-switch', 'truncate', 'textAngular', 'angular-storage', 
                                      'angularFileUpload', 'perfect_scrollbar', 'ng-breadcrumbs', 'ui.comments', 'smart-table', 
                                      'xeditable', 'flow','pb.angular.underscore','ab-base64','validation.match','color.picker'])
                                      
.config([
  '$routeProvider', '$httpProvider','$sceDelegateProvider','commentsConfigProvider', '$locationProvider',
  function ($routeProvider, $httpProvider,$sceDelegateProvider,commentsConfigProvider, $locationProvider, $rootScope, store) {
    
     
      //Add the http ajax request interceptors
      $httpProvider.interceptors.push('httpAjaxRequestInterceptor');

      // routing started
      var routes, setRoutes;
      
      routes = [ 'login', 'faq','videobook','Post','Article'];
      
      setRoutes = function (route) {
          var config, url;
          url = '/' + route;
          config = {
              templateUrl: 'app/' + route + '/view/' + route + '.html', label: route
          };
          $routeProvider.when(url, config);
          return $routeProvider;
      };

      routes.forEach(function (route) {
          return setRoutes(route);
      });
      
      //return 
      $routeProvider.when('/', {
         // redirectTo: '/landing'
    	  templateUrl: 'app/landing/view/landing.html'
      }).when('/landing', {
          templateUrl: 'app/landing/view/landing.html'
      }).when('/404', {
          templateUrl: 'app/common/view/pages/404.html'
      }).when('/AboutUs',{
    	  templateUrl: 'app/AboutUs/view/AboutUs.html',label: 'About Us'
    	  
      }).otherwise({
          //if the url not found, redirect to 404 page
          redirectTo: '/404'
      });
      // use the HTML5 History API
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
      
  }]).run(function ($rootScope,vmuisettings) {
      $rootScope.vmuisettings = vmuisettings
   })
   
  
  //.filter('filterMultiple',['$filter',function ($filter) {
   //User filterMutiple if you need to filter the result based on multiple conditions inside html page in the ng-repeat function
  //Reference for multiple filter istaken from the below site
  //http://stackoverflow.com/questions/15868248/how-to-filter-multiple-values-or-operation-in-angularjs
  .filter('filterMultiple',['$filter',function ($filter) {
  return function (items, keyObj) {
    var filterObj = {
              data:items,
              filteredData:[],
              applyFilter : function(obj,key){
                var fData = [];
                if(this.filteredData.length == 0)
                  this.filteredData = this.data;
                if(obj){
                  var fObj = {};
                  if(!angular.isArray(obj)){
                    fObj[key] = obj;
                    fData = fData.concat($filter('filter')(this.filteredData,fObj));
                  }else if(angular.isArray(obj)){
                    if(obj.length > 0){ 
                      for(var i=0;i<obj.length;i++){
                        if(angular.isDefined(obj[i])){
                          fObj[key] = obj[i];
                          fData = fData.concat($filter('filter')(this.filteredData,fObj));  
                        }
                      }
                      
                    }                   
                  }                 
                  if(fData.length > 0){
                    this.filteredData = fData;
                  }
                }
              }
        };

    if(keyObj){
      angular.forEach(keyObj,function(obj,key){
        filterObj.applyFilter(obj,key);
      });     
    }
    
    return filterObj.filteredData;
  }
 
}]);