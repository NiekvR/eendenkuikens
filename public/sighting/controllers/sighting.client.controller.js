(function () {
    var app = angular.module('sighting');

    app.controller('sightingController', sightingController);

    sightingController.$inject = ['uiGmapGoogleMapApi', '$scope', '$routeParams', '$location', '$timeout', 'sightingService', 'Upload', '$http'];
    function sightingController(uiGmapGoogleMapApi, $scope, $routeParams, $location, $timeout, sightingService, Upload, $http) {
        var vm = this;

        vm.age = '';
        vm.lat = '';
        vm.lng = '';
        vm.agerequired = true;

        vm.title = 'Eendenkuikenproject';

        vm.waarneming = 'Voer hier uw waarneming van families wilde eenden in.';
        vm.letOp = 'Let op: dit formulier is alleen bedoeld voor wilde eenden, dus niet voor krakeenden, slobeenden of andere eendensoorten.';

        vm.helpTekstDatum = 'Wanneer heeft u de eendenkuikens gezien?';

        vm.helpTekstAantalKuikens = 'Hoeveel kuikens telde u bij de moeder? Meld s.v.p. één gezin per waarneming.';

        vm.helpTekstEmailadres = 'Geef s.v.p. een geldig e-mailadres op waarop we u kunnen bereiken voor eventuele ' +
            'communicatie. Uw persoonlijke gegevens worden vertrouwelijk behandeld (zie algemene voorwaarden).';

        vm.helpTekstFoto = 'Foto’s geven belangrijke extra informatie voor dit project. Daarom moedigen wij u  aan ' +
            'een foto bij uw waarneming te uploaden. Het meest waardevol zijn foto’s waarop de kuikens en de moeder te zien zijn. ' +
            'De maximale grootte van het bestand is 2 MB.';

        vm.helpTekstLeeftijd = 'Selecteer hier s.v.p. de leeftijd van de eendenkuikens. Klik daarvoor op het plaatje ' +
            'dat het best aansluit bij uw waarneming.';

        vm.helpTekstLocatie = 'Klik op de kaart om de locatie van de eendenkuikens te selecteren. Zoom s.v.p. zo ver ' +
            'mogelijk in om de juiste locatie aan te klikken.';

        vm.helpTekstBijzonderheden = 'Hier kunt u extra informatie geven over uw waarneming. Geef hier s.v.p. toelichting ' +
            'indien u dit gezin eerder gemeld heeft (waar en wanneer). Ook kunt u hier eventuele waarnemingen van kuikensterfte ' +
            'melden (bijvoorbeeld als u heeft gezien dat kuikens werden gegrepen door een roofdier).';

        vm.helpTekstGezin = 'Heeft u dit eendengezin eerder gezien en gemeld?';

        vm.helpTekstNaam = 'Deze naam gebruiken wij bij eventuele persoonlijke communicatie met u. Uw persoonlijke gegevens ' +
            'worden vertrouwelijk behandeld (zie algemene voorwaarden).';

        vm.helpTekstHabitat = 'Selecteer hier de omgeving waarin het eendengezin verblijft.';

        $scope.map = {
            center: { latitude: 52.5, longitude: 5.5 },
            zoom: 6,
            events: {
                click: function (maps, eventName, args) {
                    placeMarker(args[0].latLng, maps)
                    $('#locationRequired').hide();
                }
            }
        };

        vm.marker = null;

        function placeMarker(location, maps) {
            if (vm.marker === null) {
                vm.marker = new google.maps.Marker({
                    position: location
                });
            }
            vm.marker.setPosition(location);
            vm.marker.setMap(maps);
        }

        uiGmapGoogleMapApi.then(function (maps) {
        });

        vm.selectAge = function (id) {
            $('.containerimage').removeClass('background');
            $('#ageSelect' + id).addClass('background');
            vm.age = id;
            vm.agerequired = false;
        };

        vm.checkToPreventDoubleEntries = true;

        $scope.create = function (file) {
            if (vm.checkToPreventDoubleEntries) {
                vm.checkToPreventDoubleEntries = false;
                if (this.photo && !checkFileType(this.photo)) {
                    $scope.error = 'Het bestand dat u probeerd te uploaden voldoet niet aan de eisen. U kan alleen images uploaden.';
                    $.notify({
                        message: 'Het versturen van je waarneming is niet gelukt. Scroll naar boven om te zien waarom.',
                        icon: 'glyphicon glyphicon-remove-sign'
                    }, {
                            type: 'danger'
                        });
                    vm.checkToPreventDoubleEntries = true;
                } else {
                    $scope.error = null;
                    if (vm.marker) {
                        vm.lat = vm.marker.getPosition().lat();
                        vm.lng = vm.marker.getPosition().lng();
                    }
                    if (this.permission === true) {
                        if(this.photo) {
                            this.photo.base64 = "data:image/png;base64," + this.photo.base64
                        }
                        var sighting = new sightingService({
                            sigthingDate: this.sigthingDate,
                            numberOfChicks: this.numberOfChicks,
                            observerName: this.observerName,
                            observerEmail: this.observerEmail,
                            gezinEerderGemeld: this.gezinEerderGemeld,
                            habitat: this.habitat,
                            remarks: this.remarks,
                            permission: this.permission,
                            lat: vm.lat,
                            lng: vm.lng,
                            age: vm.age,
                            photo: this.photo ? this.photo.base64 : ''
                        });

                        if (sighting) {
                            Upload.upload({
                                url: '/api/sighting',
                                method: 'POST',
                                data: { sighting: sighting }
                            }).success(function () {
                                $('form').hide();
                                $('.entry-succesfull').show();
                                vm.checkToPreventDoubleEntries = true;
                            }).error(function (error) {
                                $scope.error = error.message;
                                $.notify({
                                    message: 'Het versturen van je waarneming is niet gelukt. Scroll naar beneden om te zien waarom.',
                                    icon: 'glyphicon glyphicon-remove-sign'
                                }, {
                                        type: 'danger'
                                    });
                                vm.checkToPreventDoubleEntries = true;
                            })
                        }
                    } else {
                        $scope.permissionError = 'Je moet de voorwaarden accepteren om uw waarneming in te sturen.';
                        $.notify({
                            message: 'Het versturen van je waarneming is niet gelukt. Scroll naar beneden om te zien waarom.',
                            icon: 'glyphicon glyphicon-remove-sign'
                        }, {
                                type: 'danger'
                            });
                        vm.checkToPreventDoubleEntries = true;
                    }
                }
            }
        };

        $('#permission').click(function () {
            $scope.permissionError = null;
        });

        $('.entry-succesfull').hide();

        function checkFileType(file) {
            if (file.filetype.match('image.*')) {
                return true
            } else {
                return false
            }
        }

        $http({
            method: 'GET',
            url: '/api/season'
        }).then(function successCallback(response) {
            vm.noDuckSeason = response.data[0].inSeason;
        }, function errorCallback(response) {
            console.log(response)
        });

    }
})();