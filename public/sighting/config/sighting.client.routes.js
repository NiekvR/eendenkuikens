(function () {
    var app = angular.module('sighting');

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl:'sighting/views/list-sightings.client.view.html'
            })
            .when('/zipdownload', {

            })
            .when('/voorwaarden', {
                templateUrl:'sighting/views/conditions.client.view.html'
            })
            .when('/species', {
                templateUrl:'sighting/views/species.client.view.html'
            })
            .otherwise({redirectTo: '/'});
    }]);
})();
