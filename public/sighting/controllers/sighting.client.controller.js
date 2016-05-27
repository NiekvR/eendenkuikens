(function() {
    var app = angular.module('sighting');

    app.controller('sightingController', sightingController);

    sightingController.$inject = ['uiGmapGoogleMapApi','$scope','$routeParams', '$location','sightingService','Upload'];
    function sightingController(uiGmapGoogleMapApi,$scope,$routeParams, $location, sightingService, Upload) {
        var vm = this;

        vm.age = '';
        vm.lat = '';
        vm.lng = '';

        vm.title = 'Eendenkuikenproject';

        vm.waarneming = '- Voer hier uw waarneming van families wilde eenden in.';

        $scope.map = {
            center: {latitude: 52.5, longitude: 5.5},
            zoom: 6,
            events: {
                click: function (maps, eventName, args) {
                    placeMarker(args[0].latLng, maps)
                }
            }
        };

        vm.marker = null;

        function placeMarker(location, maps) {
            if(vm.marker === null) {
                vm.marker = new google.maps.Marker({
                    position: location
                });
            }
            vm.marker.setPosition(location);
            vm.marker.setMap(maps);
        }
		
		function deleteMarker() {
            vm.marker.setMap(null);
        }

        uiGmapGoogleMapApi.then(function(maps) {
        });

        vm.selectAge = function(id) {
            $('.containerimage').removeClass('background');
            $('#ageSelect' + id).addClass('background');
            vm.age = id;
        };

        $scope.create = function(file) {
            if(vm.marker) {
                vm.lat = vm.marker.getPosition().lat();
                vm.lng = vm.marker.getPosition().lng();
            }
            if(this.permission === true) {
                var sighting = new sightingService({
                    sigthingDate: this.sigthingDate,
                    numberOfChicks: this.numberOfChicks,
                    observerName: this.observerName,
                    observerEmail: this.observerEmail,
                    remarks: this.remarks,
                    permission: this.permission,
                    lat: vm.lat,
                    lng: vm.lng,
                    age: vm.age
                });

                if (sighting) {
                    Upload.upload({
                        url: '/api/sighting',
                        method: 'POST',
                        data: {sighting: sighting},
                        file: file
                    }).success(function (data) {
                        clearFields();
                        deleteMarker();
                        $.notify({
                            message: "Je waarneming is correct ingevoerd. Je kunt nu nog een waarneming invoeren...",
                            icon: 'glyphicon glyphicon-ok-sign'
                        },{
                            type: 'success'
                        });
                    }).error(function (error) {
                        $scope.error = error.message;
                        console.log(error);
                        $.notify({
                            message: error,
                            icon: 'glyphicon glyphicon-remove-sign'
                        },{
                            type: 'danger'
                        });
                    })
                }
            } else {
                $scope.permissionError = 'Je moet de voorwaarden accepteren om uw waarneming in te sturen.';
            }
        };

        $scope.delete = function(sighting) {
            if (sighting) {
                sighting.$remove(function() {
                    for (var i in $scope.sighting) {
                        if ($scope.sighting[i] === sighting) {
                            $scope.sighting.splice(i, 1);
                        }
                    }
                });
            } else {
                $scope.sighting.$remove(function() {
                    $location.path('sighting');
                });
            }
        };
    }
})();

function clearFields() {
    $('input').val('').attr('autocomplete', 'off');
    $('input[type=checkbox]').attr('checked', false);
    $('.containerimage').removeClass('background');
}