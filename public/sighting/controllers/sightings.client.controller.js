(function () {
    var app = angular.module('sighting');

    app.controller('sightingsController', sightingsController);

    sightingsController.$inject = ['Authentication', '$http', '$scope'];
    function sightingsController(Authentication, $http, $scope) {
        var vm = this;

        vm.ages = {
            "0": "0-1 week",
            "1": "1-2 weken",
            "2": "2-3 weken",
            "3": "3-4 weken",
            "4": "4-5 weken",
            "5": "5-6 weken",
            "6": "6-7 weken",
            "7": ">7 weken"
        }

        vm.habitatTypes = {
            "bsg": "bebouwd",
            "bebouwd": "bebouwd",
            "ag": "agrarisch",
            "agrarisch": "agrarisch",
            "nb": "natuur",
            "natuur": "natuur"
        }

        vm.title = 'Eendenkuikenproject';

        vm.sightings = '';

        vm.authentication = Authentication;

        vm.startSighting = 0;

        vm.endSighting = vm.startSighting + 25;
        vm.endSightingCSV = vm.startSighting + 500;

        var updateEndSigthing = function () {
            if (vm.startSighting) {
                vm.endSighting = parseInt(vm.startSighting) + 25;
                vm.endSightingCSV = parseInt(vm.startSighting) + 500;
            }
        }

        $scope.$watch('sc.startSighting', updateEndSigthing);

        vm.csv = function () {
            $http({ method: 'GET', url: '/api/csv' })
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

        vm.writeZip = function () {
            $http({ method: 'GET', url: '/api/writezip', params: { skip: vm.startSighting } }).
                success(function (data, status, headers, config) {
                    vm.locationZipFile = data;
                    $.notify({
                        message: "Je zip-file staat klaar. Klik op de zojuist verschenen jsd-photos.zip link om deze te downloaden",
                        icon: 'glyphicon glyphicon-ok-sign'
                    }, {
                            type: 'success'
                        });
                }).
                error(function (response) {
                    $.notify({
                        message: response.message,
                        icon: 'glyphicon glyphicon-remove-sign'
                    }, {
                            type: 'danger'
                        });
                });
        };

        vm.deleteFotos = function () {
            $http({ method: 'GET', url: '/api/deletefotos', params: { skip: vm.startSighting } }).
                success(function (data, status, headers, config) {
                    $.notify({
                        message: "Alle foto's zijn verwijderd van de server. Ik hoop dat je ze eerst gedownload hebt :)",
                        icon: 'glyphicon glyphicon-ok-sign'
                    }, {
                            type: 'success'
                        });
                }).
                error(function (response) {
                    console.log('error')
                });
        };

        vm.seasonOpenedOrClosed = function (inSeason) {
            if (inSeason) {
                vm.inSeasonAction = 'Sluit';
            } else {
                vm.inSeasonAction = 'Open'
            }
        }

        vm.setSeason = function () {
            $http({ method: 'POST', url: '/api/season', data: { inSeason: !vm.inSeason } }).
                success(function (data, status, headers, config) {
                    vm.seasonOpenedOrClosed(data.inSeason);
                    $.notify({
                        message: "Het seizoen is succesvol aangepast",
                        icon: 'glyphicon glyphicon-ok-sign'
                    }, {
                            type: 'success'
                        });
                }).
                error(function (response) {
                    console.log('error')
                });
        }

        $http({
            method: 'GET',
            url: '/api/sighting'
        }).then(function successCallback(response) {
            vm.sightings = response.data;
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