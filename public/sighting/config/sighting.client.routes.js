(function () {
    var app = angular.module('sighting');

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl:'sighting/views/sighting.client.view.html'
            })
            .when('/sightings', {
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

    app.config(
        ['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
            GoogleMapApiProviders.configure({
                china: true
            });
        }]
    );

    app.config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyC5eDItm0yolchF4-WqFd_9uZ_PNcjw0VQ',
            v: '3.22', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
    });
})();