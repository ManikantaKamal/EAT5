'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('vmTitle', function ($rootScope) {
    console.log("docs title di")
    return {
        restict: 'E',
        //replace : true, //-> this will not work in this case.
        scope: {
            titleValue: '@', // -> '@' will pass the value of the attribute whose name matches angular camelCase convention i.e. -
            styleValue: '@',
            icon: '@',
            textValue: '@',
            controlId: '@'
        },
        templateUrl: 'app/common/view/directiveTemplates/Title/Title.html',
        link: function (scope, element, attrs, controller) {
            console.log(attrs.styleValue);
            console.log(attrs.titleValue);
            scope.titleButtonClicked = function (obj) {
                $rootScope.$broadcast(obj.target.getAttribute('id') + "_Clicked", obj);
                
              
            }
        }
    };
});