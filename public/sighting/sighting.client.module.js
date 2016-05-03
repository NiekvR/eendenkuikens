(function() {
    var app = angular.module('sighting', []);

    app.constant('GLOBALS', {
        APIKEY:'AIzaSyBg4RWuwOAF5O5FAQx7uunZx7GqrHxBs2s',
        url:'https://maps.googleapis.com/maps/api/js?key=API_KEY&callback=initMap'
    });
})();