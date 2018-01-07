(function() {
    var app = angular.module('sighting', []);

    app.constant('GLOBALS', {
        APIKEY:'AIzaSyC5eDItm0yolchF4-WqFd_9uZ_PNcjw0VQ',
        url:'https://maps.googleapis.com/maps/api/js?key=API_KEY&callback=initMap'
    });
})();