'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive( 'address', function ($rootScope)
{
	 
    return {
        restict: 'E',
        //replace : true, //-> this will not work in this case.
        scope: {
            controlId: '@'
        },
        templateUrl: 'app/common/view/directiveTemplates/address/address.html',
        link: function ( $scope, element, attrs, controller )
        { 
        var AddressDetails = {};
        $scope.$on('AddressDetails_' + attrs.controlid, function (event) { 
        	var test1=element;
        	var test2=attrs;
            AddressDetails.AddressLine1 = $scope.AddressLine1;
            AddressDetails.AddressLine2 = $scope.AddressLine2;
            AddressDetails.Country = $scope.countryModel;
            AddressDetails.State = $scope.stateModel;
            AddressDetails.City = $scope.City;
            AddressDetails.PostalCode = $scope.PostalCode;
            $scope.$root.UserDetails.AddressDetails=AddressDetails;
            //$rootScope.AddressDetails = AddressDetails;
        });
        }
    };
    
} );