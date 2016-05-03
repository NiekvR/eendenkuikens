angular.module('login').controller('LoginController', ['$scope','Authentication',
    function($scope,Authentication) {
        $scope.authentication = Authentication;
    }
]);