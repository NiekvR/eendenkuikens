(function() {
    var app = angular.module('sighting');

    app.factory('sightingService', sightingService);

    sightingService.$inject = ['$resource'];
    function sightingService($resource) {
        return $resource('api/sighting/:sightingId', {
            sightingId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
})();