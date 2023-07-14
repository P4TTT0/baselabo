<?php

use Tulis\Luis\NeumaticoBD;
require_once("./clases/neumaticoBD.php");

$neumatico_json = isset($_POST['neumatico_json']) ? $_POST['neumatico_json'] : null;

$lectura = json_decode($neumatico_json, true);

$neumatico =  new NeumaticoBD($lectura['marca'], $lectura['medidas'], $lectura['precio']);

if($neumatico->agregar())
{
    echo "Se agregó.";
}
else
{
    echo "No se agregó.";
}


?>