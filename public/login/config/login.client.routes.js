angular.module('login').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'login/views/login.client.view.html'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);