(function () {
    var app = angular.module('sighting');

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/sightings', {
                templateUrl:'sighting/views/list-sightings.client.view.html'
            })
            .when('/zipdownload', {

            })
            .when('/', {
                templateUrl:'sighting/views/sighting.client.view.html'
            })
            .when('/voorwaarden', {
                templateUrl:'sighting/views/conditions.client.view.html'
            })
            .when('/iframetest', {
                templateUrl:'sighting/views/iframetest.html'
            })
            .otherwise({redirectTo: '/'});
    }]);
})();