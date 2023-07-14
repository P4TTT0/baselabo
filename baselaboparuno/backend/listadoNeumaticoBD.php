<?php

use PerezCardenal\Patricio\NeumaticoBD;

require_once('./clases/neumaticoBD.php');

$mostrar = isset($_GET["tabla"]) ? $_GET["tabla"] : null;

if($mostrar != "mostrar")
{
    //profe, si los parametros estan en "protected", al intentar mostrarlos no aparecen
    echo json_encode(NeumaticoBD::traer(), true);
    die;
}

?>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>MARCA</th>
            <th>MEDIDAS</th>
            <th>PRECIO</th>
            <th>FOTO</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <?php
        if($mostrar == "mostrar")
        {
            $neumaticos = NeumaticoBD::traer();
            $tabla = "";

            foreach($neumaticos as $neumatico)
            {
                $tabla .= "<tr>";
                $tabla .= "<td>" . $neumatico->id . "</td>";
                $tabla .= "<td>" . $neumatico->marca . "</td>";
                $tabla .= "<td>" . $neumatico->medidas . "</td>";
                $tabla .= "<td>" . $neumatico->precio . "</td>";
                $tabla .= '<td><img src="' . $neumatico->pathFoto . '" alt="Foto del neumático" style="max-width: 50px; max-height: 50px;"></td>';
                $tabla .= "</tr>";
            }

            echo $tabla;
        }
            
        ?>
    </tbody>
</table>