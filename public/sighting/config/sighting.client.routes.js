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

    app.config(
        ['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
            GoogleMapApiProviders.configure({
                china: true
            });
        }]
    );

    app.config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //key: 'AIzaSyBg4RWuwOAF5O5FAQx7uunZx7GqrHxBs2s',
            v: '3.22', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
    });
})();