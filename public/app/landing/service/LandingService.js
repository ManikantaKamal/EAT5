'use strict';
reachApp.factory('landingService', function ($http, $q) {
    return {
        getOrderMenuJson: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/menuOrder.json' }).
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