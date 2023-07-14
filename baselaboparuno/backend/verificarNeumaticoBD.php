<?php

use Tulis\Luis\NeumaticoBD;
require_once("./clases/neumaticoBD.php");

$neumatico_JSON = isset($_POST['obj_neumatico']) ? $_POST['obj_neumatico'] : null;

$lectura = json_decode($neumatico_JSON, true);

$neumatico =  new NeumaticoBD($lectura['marca'], $lectura['medidas']);

if($neumatico->existe(NeumaticoBD::traer()))
{
    echo $neumatico->ToJSON();
}
else
{
    echo "{}";
}

?>