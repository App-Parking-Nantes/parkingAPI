/*
 * Controller HomeController
 */
app.controller('MapsController', ['$scope', '$http', '$location', '$rootScope', '$q', '$routeParams', '$sce',function ($scope, $http, $location, $rootScope, $q, $routeParams,$sce) {

        $scope.parkings = [];
        var domain = "http://192.168.1.20/sites/2SLAM/BARD/HTML5Application/public_html/php/"; // http://bard-nantes.fr/php/

        /**
         * Problème liée au cross-domain
         * exécution de code JavaScript dans un navigateur répond å certaines
         * contraintes de sécurité, tel que l'exécution "cross-domain", 
         * en particulier pour les requêtes Ajax.
         * Comprendre que pour une page s'exécutant sur un domaine "x",
         * le navigateur ne va pas forcément exécuter directement 
         * le code chargé depuis un domaine "y".
         */
        // http://stackoverflow.com/questions/22546177/cross-domain-http-request-angularjs --> CROSS DOMAIN
        // http://stackoverflow.com/questions/26262235/jsonp-returning-uncaught-syntaxerror-unexpected-token-angularjs-routingnu -> json callback
        // http://stackoverflow.com/questions/16661032/http-get-is-not-allowed-by-access-control-allow-origin-but-ajax-is -> allow Origin
        // http://openclassrooms.com/forum/sujet/jquery-getjson-sans-parametres-75069 
        // http://data.nantes.fr/forum/?tx_mmforum_pi1%5Baction%5D=list_post&tx_mmforum_pi1%5Btid%5D=123        
        
        
        
        $scope.data = function(){ 
            
            var deferred = $q.defer();
            
            //http://localhost/sites/2SLAM/bardAPI/php/horaireParkings.php
            // rsync -r /media/sf_PARTAGE/projets/HTML5Application/public_html/php /home/btssio/www/bardAPI/

            var promise0 = $http({method: 'GET', url: domain+'parkings.php', cache: 'true'});
            var promise1 = $http({method: 'GET', url: domain+'localisation.php', cache: 'true'});
            var promise2 = $http({method: 'GET', url: domain+'horaireParkings.php', cache: 'true'});

            $q.all([promise0, promise1, promise2]).then(function(data){
               // console.log(data[0], data[1], data[2]);

                $scope.parkings= data[0].data.opendata.answer.data.Groupes_Parking.Groupe_Parking;
                localisations = data[1].data.data;
                horaires= data[2].data.data;

                //Jointure Parking <=> Localisation
                angular.forEach($scope.parkings, function(parking,key) {                    
                    angular.forEach(localisations, function(localisation) {                       
                        if(parking.IdObj==localisation._IDOBJ){                                                
                            $scope.parkings[key].localisation=localisation;
                        }
                    });
                });
                
                //Jointure Parking <=> Horaires                 
                angular.forEach($scope.parkings, function(parking,key) { 
                    $scope.parkings[key].horairesArray= [];
                    angular.forEach(horaires, function(horaire) {                       
                        if(parking.IdObj==horaire._IDOBJ){                                                     
                            $scope.parkings[key].horairesArray.push(horaire); 
                        }
                    });
                });
                
                //Parse String to Int
                angular.forEach($scope.parkings, function (detail) {
                    detail.Grp_disponible = parseInt(detail.Grp_disponible);
                });
                
                deferred.resolve($scope.parkings);

            }), function(reason) {
                alert('Failed: ' + reason);
                deferred.reject('Errreur chargement données ');
            };
            
            return deferred.promise;
        };
        
        
        $scope.one = function(idParking){  
            
            angular.forEach($scope.parkings, function(parking,key) {                       
                if(parking.IdObj==idParking){                                                     
                    $scope.infos = $scope.parkings[key];  
                }
            });            
        };
        
                          
        $scope.$on('mapInitialized', function (event, map) {
            $scope.objMapa = map;
        });
        
        $scope.orderByPredicate = "Grp_nom";
        $scope.orderByReverse = false;
        
        

        
        $scope.orderByPlacesDisponibles = function(){
            $scope.orderByReverse = false;
            $scope.orderByPredicate = "-Grp_disponible";
           
        };
        
        $scope.orderByNom = function(){
            $scope.orderByReverse = !$scope.orderByReverse;
            $scope.orderByPredicate = "Grp_nom";
            
        };

        $scope.tri = 'orderByNom';
        
        
        //Main
        var init = function () {
           
            
            if(typeof $routeParams.idParking !== 'undefined') {                
                $scope.data().then(function() {
                    $scope.one($routeParams.idParking);
                }, function(reason) {
                  alert('Failed: ' + reason);
                });
            }else{
                $scope.data();  
            }
        };

        // fire on controller loaded
        init();          
       

    }]);
