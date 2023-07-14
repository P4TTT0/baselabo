<?php

use Tulis\Luis\Neumatico;
use Tulis\Luis\NeumaticoBD;
require_once("./clases/neumaticoBD.php");

$neumatico_JSON = isset($_POST['neumatico_json']) ? $_POST['neumatico_json'] : null;

$lectura = json_decode($neumatico_JSON, true);


$neumatico = new NeumaticoBD($lectura['marca'],$lectura['medidas'],$lectura['precio'],$lectura['id'],$lectura['pathFoto']);
$neumatico->guardarEnArchivo();
NeumaticoBD::eliminar($neumatico->id);
?>