<?php

use PerezCardenal\Patricio\Neumatico;
require_once("./clases/neumatico.php");

$marca = isset($_POST['marca']) ? $_POST['marca'] : null;
$medidas = isset($_POST['medidas']) ? $_POST['medidas'] : null;

$neumatico =  new Neumatico($marca, $medidas);

echo Neumatico::verificarNeumaticoJSON($neumatico, "./archivos/neumaticos.json");


?>