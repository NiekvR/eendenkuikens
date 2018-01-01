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
                        download: 'sightings.csv'
                    })[0].click();
                }).
                error(function(data, status, headers, config) {
                    console.log(response)
                });
        };

        vm.locationZipFile = null;

        vm.writeZip = function() {
            $http({method: 'GET', url: '/api/writezip'}).
                success(function(data, status, headers, config) {
                    vm.locationZipFile = data;
                    $.notify({
                        message: "Je zip-file staat klaar. Klik op de zojuist verschenen jsd-photos.zip link om deze te downloaden",
                        icon: 'glyphicon glyphicon-ok-sign'
                    },{
                        type: 'success'
                    });
                }).
                error(function(response) {
                    console.log('error')
                });
        };

        vm.deleteFotos = function() {
            $http({method: 'GET', url: '/api/deletefotos'}).
                success(function(data, status, headers, config) {
                    $.notify({
                        message: "Alle foto's zijn verwijderd van de server. Ik hoop dat je ze eerst gedownload hebt :)",
                        icon: 'glyphicon glyphicon-ok-sign'
                    },{
                        type: 'success'
                    });
                }).
                error(function(response) {
                    console.log('error')
                });
        };

        vm.seasonOpenedOrClosed = function(inSeason) {
            if(inSeason) {
                vm.inSeasonAction = 'Sluit';
            } else {
                vm.inSeasonAction = 'Open'
            }
        }

        vm.setSeason = function() {
            $http({method: 'POST', url: '/api/season', data: { inSeason: !vm.inSeason }}).
                success(function(data, status, headers, config) {
                    vm.seasonOpenedOrClosed(data.inSeason);
                    $.notify({
                        message: "Het seizoen is succesvol aangepast",
                        icon: 'glyphicon glyphicon-ok-sign'
                    },{
                        type: 'success'
                    });
                }).
                error(function(response) {
                    console.log('error')
                });
        }

        $http({
            method: 'GET',
            url: '/api/sighting'
        }).then(function successCallback(response) {
            vm.sightings = response.data;
            console.log(vm.sightings)
        }, function errorCallback(response) {
            console.log(response)
        });

        $http({
            method: 'GET',
            url: '/api/season'
        }).then(function successCallback(response) {
            vm.inSeason = response.data[0].inSeason;
            vm.seasonOpenedOrClosed(response.data[0].inSeason);
        }, function errorCallback(response) {
            console.log(response)
        });
    }
})();