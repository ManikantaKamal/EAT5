'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('vmUiSelect2', function ($timeout, $rootScope, store) { 
    return {
        restict: 'E',
        //replace : true, //-> this will not work in this case.
        scope: {
            ngSelectModel: '=', //isolated scope property used
            controlId: '@',
            requierdField: '@',
            placeHolder: '@',
            isMultiple: '@',
            masterName: '@',
            isDisabled: '@',
            isDependent: '@',
            dependentColumn: '@',
            dependentDropdownId: '@',
            sourceUrl: '@', // source url
            sourceObj: '@', // object from the restult set
            sourceNameCol: '@',//source name column
            sourceCodeCol: '@', //source value column
            disableChoice: '@'	
        },
        controller: function ($scope, $http) { 
            $scope.items = [];
            if ($scope.sourceUrl != undefined) {
                return $http({ method: 'GET', url: $scope.sourceUrl }).
                    success(function (data, status, headers, config) {
                        if ($scope.isMultiple == undefined) {
                            //loop through the data object
                            angular.forEach(data[$scope.sourceObj], function (item) {
                                //check whether sourceNameCol is not undefined and property exists
                                if ($scope.sourceNameCol != undefined && item.hasOwnProperty($scope.sourceNameCol)) {
                                    item.name = item[$scope.sourceNameCol];
                                }
                                //check whether sourceCodeCol is not undefined and property exists
                                if ($scope.sourceCodeCol != undefined && item.hasOwnProperty($scope.sourceCodeCol)) {
                                    item.code = item[$scope.sourceCodeCol];
                                }
                            });
                        }
                        else {
                            var multiItems = [];
                            //loop through the data object
                            angular.forEach(data[$scope.sourceObj], function (item) {
                                var multiitem = {};
                                //check whether sourceNameCol is not undefined and property exists
                                if ($scope.sourceNameCol != undefined && item.hasOwnProperty($scope.sourceNameCol)) {
                                    multiitem.name = item[$scope.sourceNameCol];
                                }
                                //check whether sourceCodeCol is not undefined and property exists
                                if ($scope.sourceCodeCol != undefined && item.hasOwnProperty($scope.sourceCodeCol)) {
                                    multiitem.code = item[$scope.sourceCodeCol];
                                }

                                if (item.status == true) {
                                    if ($scope.sourceNameCol == undefined && $scope.sourceCodeCol == undefined) {
                                        multiitem.name = item.name;
                                        multiitem.code = item.code;
                                    }
                                    multiItems.push(multiitem);
                                }
                            });
                            data[$scope.sourceObj] = multiItems;
                        }

                        //remove data from the local storage and then save data in the local storage
                        store.remove($scope.masterName);
                        store.set($scope.masterName, data[$scope.sourceObj]);
                        $scope.items = data[$scope.sourceObj];
                        $rootScope.$broadcast($scope.masterName + '_Executed', null);
                        return true;
                    }).
                    error(function (data, status, headers, config) {
                        console.log("error retrieving " + $scope.masterName + " details");
                    });
            }
        },
        templateUrl: 'app/common/view/directiveTemplates/uiselect2/uiselect2.html',
        link: function ($scope, element, attrs, controller) {
            $scope.items = [];
            if ($scope.isDependent) {
                $scope.$on($scope.dependentDropdownId + '_ChangeEvent', function (event, args) {
                    var localstoragedata = store.get($scope.masterName);
                    if (localstoragedata != null) {
                        var data = [];
                        if (args != undefined) {
                            angular.forEach(localstoragedata, function (value, key) {
                                if (value[$scope.dependentColumn] == args.code) {
                                    this.push(value);
                                }
                            }, data);
                        }
                        else if (args == undefined && ($scope.isDisabled == undefined || $scope.isDisabled == false)) {
                            data = localstoragedata;
                        }
                    }
                    $scope.$parent.$applyAsync(function () {
                        //Swathi(5-May-15): Remove ng-hide class and show placeholder as select for default select-chosen element
                        var defaultSelected = angular.element("#" + $scope.controlId + " a span.select2-chosen.ng-binding");
                        defaultSelected.removeClass("ng-hide");
                        defaultSelected[0].innerHTML = $scope.placeHolder;
                        $scope.ngSelectModel = "";
                        //end
                        if (($scope.isDisabled == undefined || $scope.isDisabled == false)) {
                            $scope.isDisabled = false;
                        }
                        else {
                            $scope.isDisabled = data.length == 0 ? true : false;
                        }
                        $scope.items = data;
                        //$scope.$parent[$scope.masterName] = data;
                    });
                });
            }
            $scope.onChangeEvent = function (obj) {
                if ($scope.isMultiple == undefined) {
                    //Swathi(5-May-15): when item is selected in dropdown, set the below select2-chosen element
                    var defaultSelected = angular.element("#" + $scope.controlId + " a span.select2-chosen.ng-binding");
                    //ends
                    if (obj != undefined) {
                        //resetting the ng-model value on change event
                        $scope.ngSelectModel = obj.code;
                        //Swathi(5-May-15): set the innerhtml for select2-chosen element
                        defaultSelected[0].innerHTML = obj.name;
                    } else {
                        //resetting the ng-model value on change event
                        $scope.ngSelectModel = "";
                        //Swathi(5-May-15): set the innerhtml for select2-chosen element and remove class ng-hide
                        defaultSelected[0].innerHTML = $scope.placeHolder;
                        defaultSelected.removeClass("ng-hide");
                    }
                    //ends
                }
                else {
                    console.log(this.ngModel.$$rawModelValue);
                    $scope.ngSelectModel = this.ngModel.$$rawModelValue;// this.$select.selected;
                }
                $rootScope.$broadcast(attrs.controlId + '_ChangeEvent', obj);
            }
        }
    };

});