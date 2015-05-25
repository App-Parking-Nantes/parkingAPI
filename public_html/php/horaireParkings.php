<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$cache = 'cache/horaireParkings.tmp';
$tempsEnCache = 10;
$url = "http://data.nantes.fr/api/publication/24440040400129_NM_NM_00010/LISTE_HORAIRES_PKGS_PUB_NM_STBL/content/?format=json";

if (time() - filemtime($cache) > $tempsEnCache) {    

    //Test réseau true ou false si il arrive à accéder au réseau
    $headers = @get_headers($url, 1);
    
    if ($headers === FALSE) {
        //echo "Accès cache car erreur réseau";
        $horaireParkings = file_get_contents($cache);
    } else {
        //echo "Nouveau cache";
        $horaireParkings = file_get_contents($url);
        file_put_contents($cache, $horaireParkings);
    }
} else {
    //echo "Accès cache ";
    $horaireParkings = file_get_contents($cache);
}
echo $horaireParkings;
?>