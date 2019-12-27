var mainApplicationModuleName = 'kuikenTeller';

var mainApplicationModule = angular.module(mainApplicationModuleName,
    ['ngResource','ngRoute','users','login','sighting','ngFileUpload','ui.bootstrap','naif.base64']);

mainApplicationModule.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);

if (window.location.hash === '#_=_') window.location.hash = '#!';

angular.element(document).ready(function() {
    angular.bootstrap(document, [mainApplicationModuleName]);
});
