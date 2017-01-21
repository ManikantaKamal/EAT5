'use strict';
//Good reference to create custom directive
//http://www.ng-newsletter.com/posts/directives.html
reachApp.directive('lookupTable', function () {
    return {
        restict: 'E',
        scope: {
            sourceurl: '@',
            datasource: '@',
            controlId:'@'
        },
        templateUrl: function (tElement, tAttrs) {
            return tAttrs.templateurl;
        },
        controller: ['$scope','$rootScope', '$http', 'DTOptionsBuilder', 'DTColumnDefBuilder','$timeout', function ($scope,$rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder,$timeout, $modal, $window) {
        	
        	$scope.bindlookupdatatable = function(){ 
                var vm = $scope;
                vm.LookUpData = [];
                var dataFileName = (window.location.href).split('/');
                vm.lookUpDtOptions = DTOptionsBuilder.newOptions().withDisplayLength(5).withBootstrap().withDOM('<"H"<"leftaligned"f>r>t<"F"p>').withBootstrapOptions({
                    TableTools: {
                        classes: {
                            container: 'btn-group',
                            buttons: {
                                normal: 'btn btn-danger'
                            }
                        }
                    },
                    pagination: {
                        classes: {
                            ul: 'pagination pagination-sm'
                        }
                    }
                });

                vm.lookUpDtColumnDefs = [
                    DTColumnDefBuilder.newColumnDef(0).notSortable()
                ];
                //Display the progress bar till success or failure  - Starts
                $timeout(function () {  
                    var objProgress = {};
                    objProgress.progress = "show";
                    objProgress.container = "dt-pbar-"+$scope.controlId;
                    $rootScope.$broadcast('showLoadProgressBar', objProgress); 
                }, 100);               
                //Display the progress bar till success or failure  - Ends
                var sourceUrl = ($scope.sourceurl != undefined || $scope.sourceurl != '') ? $scope.sourceurl : 'data/dropdown-data.json';
                $http({ method: 'GET', url: sourceUrl }).
                    success(function (data, status, headers, config) {
                        if ($scope.datasource == "") { 
                            vm.LookUpData = data;
                            $rootScope.$broadcast('bindingLookupTable_Success_'+$scope.controlId,data);
                        }
                        else {
                            vm.LookUpData = data[$scope.datasource];
                            $rootScope.$broadcast('bindingLookupTable_Success_'+$scope.controlId,data[$scope.datasource]);
                        } 
                        //Display the progress bar till success or failure  - Starts
                        $timeout(function () {  
                            var objProgress = {};
                            objProgress.progress = "hide";
                            objProgress.container = "dt-pbar-"+$scope.controlId;
                            $rootScope.$broadcast('showLoadProgressBar', objProgress); 
                        }, 500); 
                        //Display the progress bar till success or failure  - Ends                       
                    }).
                    error(function (data, status, headers, config) {
                        vm.LookUpData = [];
                        //Display the progress bar till success or failure  - Starts
                       $timeout(function () {  
                            var objProgress = {};
                            objProgress.progress = "hide";
                            objProgress.container = "dt-pbar-"+$scope.controlId;
                            $rootScope.$broadcast('showLoadProgressBar', objProgress); 
                        }, 500); 
                        //Display the progress bar till success or failure  - Ends
                    });
            }

            $scope.bindlookupdatatable();

            $scope.$on('RebindRouteTable_'+$scope.controlId,function(){ 
                $scope.bindlookupdatatable();
            });

            $scope.openLookUpModal = function (obj) { 
                obj.ActionDone = "Edit";
                $rootScope.$broadcast('onDetailsEditClicked', obj);
            }

            $scope.showLookUpDetails = function (obj) {
                obj.ActionDone = "View";
                $rootScope.$broadcast('onDetailsViewClicked', obj);
            }
            
            $scope.ParseJSON = function (obj) {
            	return typeof(obj)=="string"?JSON.parse(obj):obj;            	 
            }
        } ],
        link: function (scope, element, attrs, controller) {
        }
    };
});