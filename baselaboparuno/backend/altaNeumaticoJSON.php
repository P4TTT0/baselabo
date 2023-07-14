<?php

use Tulis\Luis\Neumatico;
require_once("./clases/neumatico.php");

$marca = isset($_POST['marca']) ? $_POST['marca'] : null;
$medidas = isset($_POST['medidas']) ? $_POST['medidas'] : null;
$precio = isset($_POST['precio']) ? $_POST['precio'] : null;

$neumatico =  new Neumatico($marca, $medidas, $precio);

echo $neumatico->guardarJSON("./archivos/neumaticos.json");


?>