<?php

use Tulis\Luis\Neumatico;
use Tulis\Luis\NeumaticoBD;

require_once("./clases/neumaticoBD.php");

$neumatico_json = isset($_POST["neumatico_json"]) ? $_POST["neumatico_json"] : null;

$lectura = json_decode($neumatico_json, true);

$neumatico = new NeumaticoBD($lectura["marca"], $lectura["medidas"], $lectura["precio"], $lectura["id"]);

if(NeumaticoBD::eliminar($neumatico->id))
{
    echo "Se pudo borrar.";
    $neumatico->guardarJSON('./archivos/neumaticos_eliminados.json');
}
else
{
    echo "No se pudo borrar.";
}

?>