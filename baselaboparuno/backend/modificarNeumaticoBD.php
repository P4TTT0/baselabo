<?php

use Tulis\Luis\Neumatico;
use Tulis\Luis\NeumaticoBD;

require_once("./clases/neumaticoBD.php");

$neumatico_json = isset($_POST["neumatico_json"]) ? $_POST["neumatico_json"] : null;

$lectura = json_decode($neumatico_json, true);

$neumatico = new NeumaticoBD($lectura["marca"], $lectura["medidas"], $lectura["precio"], $lectura["id"]);

if($neumatico->modificar())
{
    echo "Se pudo modificar";
}
else
{
    echo "No se pudo modificar";
}

?>