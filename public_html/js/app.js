//Déclaration de notre application AngularJS avec les modules nécessaires
var app = angular.module('ParkingNantes', ['ngRoute','ngMap','ngSanitize']);

/* Configuration des routes*/
app.config(['$routeProvider','$httpProvider',function ($routeProvider,$httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    
    $routeProvider.when('/maps', { 
        templateUrl: 'view/viewMaps.html',
        controller:'MapsController'  
    }).when('/list',{
        templateUrl :'view/viewList.html',
        controller :'MapsController'
    })
    .when('/single/:idParking',{
        templateUrl : 'view/viewSingle.html',
        controller : 'MapsController'
    })
    .when('/a-propos',{
        templateUrl : 'view/viewInfos.html',
        controller : 'MapsController'
    })
    .otherwise({redirectTo : '/maps'});   
    
}]);



//JS pour le menu
(function($) {

    $('#header__icon').click(function(e) {
        e.preventDefault();
        $('body').toggleClass('with--sidebar');
    });

    $('#site-cache').click(function(e) {
        $('body').removeClass('with--sidebar');
    });
    
    $('.menu').click(function(e) {
        $('body').removeClass('with--sidebar');
    });

})(jQuery);
