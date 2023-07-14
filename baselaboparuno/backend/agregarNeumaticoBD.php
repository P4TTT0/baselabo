<?php

use Tulis\Luis\Neumatico;
use Tulis\Luis\NeumaticoBD;
require_once("./clases/neumaticoBD.php");


$marca = isset($_POST['marca']) ? $_POST['marca'] : null;
$medidas = isset($_POST['medidas']) ? $_POST['medidas'] : null;
$precio = isset($_POST['precio']) ? $_POST['precio'] : null;
$foto = isset($_FILES['foto']) ? $_FILES['foto'] : null;

date_default_timezone_set('America/Argentina/Buenos_Aires');
$tipo = explode("/",$foto["type"]);
$tipo = $tipo[1];
$destino = "." . $marca . "." . date("His") . "." . $tipo;
move_uploaded_file($foto["tmp_name"], './neumaticos/imagenes/'. $destino);

echo $foto["tmp_name"];

$neumatico = new NeumaticoBD($marca, $medidas, $precio, 0, $destino);

if($neumatico->existe(NeumaticoBD::traer()))
{
    echo "El neumatico ya existia.";
}
else
{
    echo $neumatico->agregar();
}


?>
