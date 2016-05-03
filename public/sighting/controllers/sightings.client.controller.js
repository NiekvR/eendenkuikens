(function() {
    var app = angular.module('sighting');

    app.controller('sightingsController', sightingsController);

    sightingsController.$inject = ['Authentication','$http','$scope'];
    function sightingsController(Authentication,$http, $scope) {
        var vm = this;

        vm.title = 'Eendenkuikenproject';

        vm.sightings = '';

        vm.authentication = Authentication;

        vm.csv = function() {
            $http({method: 'GET', url: '/api/csv'}).
                success(function(data, status, headers, config) {
                    var anchor = angular.element('<a/>');
                    anchor.attr({
                        href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                        target: '_blank',
                        download: 'filename.csv'
                    })[0].click();
                }).
                error(function(data, status, headers, config) {
                    console.log(response)
                });
        };

        vm.locationZipFile = null;

        vm.writeZip = function() {
            $http({method: 'GET', url: '/api/writezip'}).
                success(function(response) {
                    //var anchor = angular.element('<a/>');
                    //anchor.attr({
                    //    href: 'data:attachment/zip;charset=utf-8,' + encodeURI(response),
                    //    target: '_blank',
                    //    download: 'filename.zip'
                    //})[0].click();
                }).
                error(function(response) {
                    console.log('error')
                });
        };

        $http({
            method: 'GET',
            url: '/api/sighting'
        }).then(function successCallback(response) {
            vm.sightings = response.data;
            console.log(vm.sightings)
        }, function errorCallback(response) {
            console.log(response)
        });
    }
})();