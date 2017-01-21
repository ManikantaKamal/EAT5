'use strict';
reachApp.factory('NavbarService', function ($http, $q) {
    return {
        MenuJson: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/Menu.json' }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        }
    }     
})