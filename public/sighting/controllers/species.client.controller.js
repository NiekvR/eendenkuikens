(function () {
    var app = angular.module('sighting');

    app.controller('speciesController', speciesController);

    speciesController.$inject = ['Authentication', '$http', '$scope'];
    function speciesController(Authentication, $http, $scope) {
        var vm = this;

        $scope.test = 'Test';

        vm.authentication = Authentication;

        vm.species = '';
        
        function createNewSpecies() {
            return {
                '_id': null,
                'nameNL': null,
                'nameEN': null,
                'speciesLatin': null,
                'familyLatin': null,
                'inUse': false,
            };
        }
        
        vm.changeSpecies = createNewSpecies();
        
        vm.listSpecies = function() {
            $http({
                method: 'GET',
                url: '/api/species'
            }).then(function successCallback(response) {
                vm.species = response.data;
            }, function errorCallback(response) {
                console.log(response)
            });
        }

        $scope.speciesId = null;

        vm.editSpecies = function(species) {
            vm.changeSpecies._id = species._id;
            vm.changeSpecies.nameNL = species.nameNL;
            vm.changeSpecies.nameEN = species.nameEN;
            vm.changeSpecies.speciesLatin = species.speciesLatin;
            vm.changeSpecies.familyLatin = species.familyLatin;
            vm.changeSpecies.inUse = species.inUse;
            console.log(vm.changeSpecies);
        }

        $scope.create = function (species) {
            var url = 'api/species' + (vm.changeSpecies._id ? '/' + vm.changeSpecies._id : '');
            $http({ method: 'POST', url: url, data: {species: vm.changeSpecies } }).
                success(function (data, status, headers, config) {
                    vm.listSpecies();
                    $.notify({
                        message: "Update succesvol",
                        icon: 'glyphicon glyphicon-ok-sign'
                    }, {
                        type: 'success'
                    });
                    vm.changeSpecies = createNewSpecies();
                }).
                error(function (response) {
                    console.log('error')
                    $.notify({
                        message: "something went wrong",
                        icon: 'glyphicon glyphicon-remove-sign'
                    }, {
                        type: 'danger'
                    });
                });
        }

        vm.deleteSpecies = function (species) {
            var url = 'api/species/' + species._id;
            $http({ method: 'DELETE', url: url}).
                success(function (data, status, headers, config) {
                    vm.listSpecies();
                    $.notify({
                        message: "Update succesvol",
                        icon: 'glyphicon glyphicon-ok-sign'
                    }, {
                        type: 'success'
                    });
                }).
                error(function (response) {
                    console.log('error')
                    $.notify({
                        message: "something went wrong",
                        icon: 'glyphicon glyphicon-ok-sign'
                    }, {
                        type: 'success'
                    });
                });
        }

        vm.listSpecies();
    }
})();