<?php

use PerezCardenal\Patricio\Neumatico;
require_once("./clases/neumatico.php");

$array = Neumatico::traerJSON("./archivos/neumaticos.json");
echo json_encode($array);
?>