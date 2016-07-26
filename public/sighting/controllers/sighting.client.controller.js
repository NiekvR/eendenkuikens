(function() {
    var app = angular.module('sighting');

    app.controller('sightingController', sightingController);

    sightingController.$inject = ['uiGmapGoogleMapApi','$scope','$routeParams', '$location','sightingService','Upload'];
    function sightingController(uiGmapGoogleMapApi,$scope,$routeParams, $location, sightingService, Upload) {
        var vm = this;

        vm.age = '';
        vm.lat = '';
        vm.lng = '';
        vm.agerequired = true;
        vm.locationrequired = true;

        vm.title = 'Eendenkuikenproject';

        vm.waarneming = '- Voer hier uw waarneming van families wilde eenden in.';

        vm.helpTekstDatum = 'Wanneer heeft u de eendenkuikens gezien?';

        vm.helpTekstAantalKuikens = 'Hoeveel kuikens telde u bij de moeder? Meld s.v.p. één gezin per waarneming.';

        vm.helpTekstEmailadres = 'Geef s.v.p. een geldig e-mailadres op waarop we u kunnen bereiken voor eventuele ' +
            'communicatie. Uw persoonlijke gegevens worden vertrouwelijk behandeld (zie algemene voorwaarden).';

        vm.helpTekstFoto = 'Foto’s geven belangrijke extra informatie voor dit project. Daarom moedigen wij u  aan ' +
            'een foto bij uw waarneming te uploaden. Het meest waardevol zijn foto’s waarop de kuikens en de moeder te zien zijn.';

        vm.helpTekstLeeftijd = 'Selecteer hier s.v.p. de leeftijd van de eendenkuikens. Klik daarvoor op het plaatje ' +
            'dat het best aansluit bij uw waarneming.';

        vm.helpTekstLocatie = 'Klik op de kaart om de locatie van de eendenkuikens te selecteren. Zoom s.v.p. zo ver ' +
            'mogelijk in om de juiste locatie aan te klikken.';

        vm.helpTekstBijzonderheden = 'Hier kunt u extra informatie geven over uw waarneming. Geef hier s.v.p. toelichting ' +
            'indien u dit gezin eerder gemeld heeft (waar en wanneer). Ook kunt u hier eventuele waarnemingen van kuikensterfte ' +
            'melden (bijvoorbeeld als u heeft gezien dat kuikens werden gegrepen door een roofdier).';

        vm.helpTekstGezin = 'Heeft u dit eendengezing eerder gezien?';

        vm.helpTekstNaam = 'Deze naam gebruiken wij bij eventuele persoonlijke communicatie met u. Uw persoonlijke gegevens ' +
            'worden vertrouwelijk behandeld (zie algemene voorwaarden).';

        $scope.map = {
            center: {latitude: 52.5, longitude: 5.5},
            zoom: 6,
            events: {
                click: function (maps, eventName, args) {
                    placeMarker(args[0].latLng, maps)
                }
            }
        };

        vm.sigthingDate = 'TEst';

        vm.marker = null;

        function placeMarker(location, maps) {
            if(vm.marker === null) {
                vm.marker = new google.maps.Marker({
                    position: location
                });
            }
            vm.marker.setPosition(location);
            vm.marker.setMap(maps);
            vm.locationrequired = false;
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
            vm.agerequired = false;
        };

        $scope.create = function(file) {
            if(checkFileType(file)) {
                $scope.error = null;
                if (vm.marker) {
                    vm.lat = vm.marker.getPosition().lat();
                    vm.lng = vm.marker.getPosition().lng();
                }
                if (this.permission === true) {
                    console.log('In Send Method' + this);
                    var sighting = new sightingService({
                        sigthingDate: this.sigthingDate,
                        numberOfChicks: this.numberOfChicks,
                        observerName: this.observerName,
                        observerEmail: this.observerEmail,
                        gezinEerderGemeld: this.gezinEerderGemeld,
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
                        }).success(function () {
                            $.notify({
                                message: "Je waarneming is correct ingevoerd. Je kunt nu nog een waarneming invoeren...",
                                icon: 'glyphicon glyphicon-ok-sign'
                            }, {
                                type: 'success'
                            });
                            window.location.reload();
                        }).error(function (error) {
                            $scope.error = error.message;
                            console.log(error);
                            $.notify({
                                message: 'Het versturen van je waarneming is niet gelukt.',
                                icon: 'glyphicon glyphicon-remove-sign'
                            }, {
                                type: 'danger'
                            });
                        })
                    }
                } else {
                    $scope.permissionError = 'Je moet de voorwaarden accepteren om uw waarneming in te sturen.';
                }
            } else {
                $scope.error = 'Het bestand dat u probeerd te uploaden voldoet niet aan de eisen. U kan alleen images uploaden.';
            }
        };

        $('#permission').click(function() {
            $scope.permissionError = null;
        });

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

        function checkFileType(file) {
            if (file.type.match('image.*')) {
                return true
            } else {
                return false
            }
        }
    }
})();