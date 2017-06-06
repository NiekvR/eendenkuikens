(function() {
    var app = angular.module('sighting');

    app.controller('sightingController', sightingController);

    sightingController.$inject = ['$scope','$routeParams', '$location', '$timeout','sightingService','Upload'];
    function sightingController($scope,$routeParams, $location, $timeout,sightingService, Upload) {
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
            center: {latitude: 52.5, longitude: 5.5},
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
            if(vm.marker === null) {
                vm.marker = new google.maps.Marker({
                    position: location
                });
            }
            vm.marker.setPosition(location);
            vm.marker.setMap(maps);
        }

        vm.selectAge = function(id) {
            $('.containerimage').removeClass('background');
            $('#ageSelect' + id).addClass('background');
            vm.age = id;
            vm.agerequired = false;
            checkValuesStepTwo();
        };

        vm.checkToPreventDoubleEntries = true;

        $scope.create = function(file) {
            if(vm.checkToPreventDoubleEntries) {
                vm.checkToPreventDoubleEntries = false;
                if(file && !checkFileType(file)) {
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
                    if (this.permission === true) {
                        var sighting = new sightingService({
                            sigthingDate: this.sigthingDate,
                            numberOfChicks: this.numberOfChicks,
                            observerName: this.observerName,
                            observerEmail: this.observerEmail,
                            gezinEerderGemeld: this.gezinEerderGemeld,
                            habitat: this.habitat,
                            remarks: this.remarks,
                            permission: this.permission,
                            lat: $('#lat').val(),
                            lng: $('#lng').val(),
                            age: vm.age
                        });

                        if (sighting) {
                            Upload.upload({
                                url: '/api/sighting',
                                method: 'POST',
                                data: {sighting: sighting},
                                file: file
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

        $('#stepTwo').click(function() {
            goToStepTwo();
        });

        $('#stepThree').click(function() {
            goToStepThree();
        });

        $('#stepFour').click(function() {
            goToStepFour();
        });

        $('#stepFive').click(function() {
            goToStepFive();
        });

        $('#datepicker-sightingDate').change(function() {
            checkValuesStepOne();
        });

        $('#numberOfChicks').change(function() {
            checkValuesStepOne();
        });

        $('#lat').change(function() {
            checkValuesStepThree();
        });

        $('#remarks').val() && $('#habitat').val() && $('#gezinEerderGemeld').val() && $('.fileinput').val()

        $('#remarks').change(function() {
            checkValuesStepFour();
        });

        $('#habitat').change(function() {
            checkValuesStepFour();
        });

        $('#gezinEerderGemeld').change(function() {
            checkValuesStepFour();
        });

        $('.fileinput').change(function() {
            checkValuesStepFour();
        });

        $('#permission').change(function() {
            checkValuesStepFive();
        });

        $('#permission').click(function() {
            $scope.permissionError = null;
        });

        $('.entry-succesfull').hide();
        $('.stepThree').hide();

        var Api = 'AIzaSyDjY3BL2CD15WKp6pBEUBUEf-sBtlN5768';

        function checkFileType(file) {
            if (file.type.match('image.*')) {
                return true
            } else {
                return false
            }
        }

        var step = 1;

        function goToStepTwo() {
            if(step > 1) {

            } else {
                step = 2;
                hideInput('.stepOne');
                showInput('.stepTwo');
                addActiveClass('#stepTwo');
                stepSucceeded('#stepOne');
            }
        }

        function goToStepThree() {
            if(step > 2) {

            } else {
                step = 3;
                hideInput('.stepTwo');
                $('.stepThree').show();
                google.maps.event.trigger(map, 'resize');
                addActiveClass('#stepThree');
                stepSucceeded('#stepTwo');
            }
        }

        function goToStepFour() {
            if(step > 3) {

            } else {
                step = 4;
                hideInput('.stepThree');
                showInput('.stepFour');
                addActiveClass('#stepFour');
                stepSucceeded('#stepThree');
            }
        }

        function goToStepFive() {
            if(step > 4) {

            } else {
                step = 5;
                hideInput('.stepThree');
                hideInput('.stepFour');
                showInput('.stepFive');
                addActiveClass('#stepFive');
                stepSucceeded('#stepFour');
                stepSucceeded('#stepThree');
            }
        }
    }
})();

function enableButton(name) {
    $(name).removeClass('disabled');
}

function disableButton(name) {
    $(name).addClass('disabled');
}

function hideInput(name) {
    $(name).addClass('hidden');
}

function showInput(name) {
    $(name).removeClass('hidden');
}

function stepSucceeded(step) {
    $(step).addClass('list-group-item-success')
}

function addActiveClass(step) {
    $('.list-group').find('button').removeClass('active');
    $(step).addClass('active');
}

function addCheckbox(step) {
    $(step).find('.badge').text('').append('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
}

function removeChechbox(step, number) {
    $(step).find('.badge').text(number).find('.glyphicon').remove();
}

function checkValuesStepOne() {
    if($('#numberOfChicks').val() && $('#datepicker-sightingDate').val()) {
        enableButton('#stepTwo');
        enableButton('#next');
        addCheckbox('#stepOne');
    } else {
        disableButton('#stepTwo');
        disableButton('#next');
        removeChechbox('#stepOne', '1')
    }
}

function checkValuesStepTwo() {
    enableButton('#stepThree');
    addCheckbox('#stepTwo');
}

function checkValuesStepFour() {
    if($('#remarks').val() && $('#habitat').val() && $('#gezinEerderGemeld').val() && $('.fileinput').val()) {
        addCheckbox('#stepFour');
    } else {
        removeChechbox('#stepFour', '4');
    }
}

function checkValuesStepFive() {
    if($('#permission').val()) {
        enableButton('#stepFive');
        addCheckbox('#stepFour');
        $('#next').addClass('hidden');
        $('#send').removeClass('hidden');
    } else {
        removeChechbox('#stepFive', '5')
        $('#next').removeClass('hidden');
        $('#send').addClass('hidden');
    }
}