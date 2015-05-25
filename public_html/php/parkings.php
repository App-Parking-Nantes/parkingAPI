<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$cache = 'cache/parkings.tmp';
$tempsEnCache = 10;
$url = "http://data.nantes.fr/api/getDisponibiliteParkingsPublics/1.0/JMGIH06TYVI1DUT/?output=json";

if (time() - filemtime($cache) > $tempsEnCache) {    

    //Test réseau true ou false si il arrive à accéder au réseau
    $headers = @get_headers($url, 1);
    
    if ($headers === FALSE) {
        //echo "Accès cache car erreur réseau";
        $parkings = file_get_contents($cache);
    } else {
        //echo "Nouveau cache";
        $parkings = file_get_contents($url);
        file_put_contents($cache, $parkings);
    }
} else {
    //echo "Accès cache ";
    $parkings = file_get_contents($cache);
}
echo $parkings;
?>