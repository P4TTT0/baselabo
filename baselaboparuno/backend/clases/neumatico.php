<?php

namespace PerezCardenal\Patricio
{
    class Neumatico
    {
        public string $marca;
        public string $medidas;
        public float $precio;

        function __construct(string $marca, string $medidas, float $precio = 0)
        {
            $this->marca = $marca;
            $this->medidas = $medidas;
            $this->precio = $precio;
        
        }

     
        function ToJSON()
        {
            $retorno = array(
                'marca' => $this->marca,
                'medidas' => $this->medidas,
                'precio' => $this->precio
            );

            return json_encode($retorno, true);
        }

        function guardarJSON($path)
        {
            $file = fopen($path, 'a');
            $validacion = fwrite($file,$this->ToJson() . "\r\n");
            
            if($validacion == 0)
            {
                $retorno = array(
                    'éxito' => false,
                    'mensaje' => 'Hubo un problema al agregar el neumatico.'
                );
            }
            else
            {
                $retorno = array(
                    'éxito' => true,
                    'mensaje' => 'Neumatico agregado con exito.'
                );
            }

            return json_encode($retorno,true);
        }

        static function traerJSON($path)
        {
            $file = fopen($path,'r');

            $retorno = array();
            while($linea = fgets($file))
            {
                $linea = trim($linea);
                $lectura = json_decode($linea, true);

                array_push($retorno, new Neumatico($lectura['marca'], $lectura['medidas'], $lectura['precio']));
            }

            return $retorno;
        }

        static function verificarNeumaticoJSON($neumatico, $path)
        {
            $retorno = array(
                'éxito' => false,
                'mensaje' => 'El neumatico no está registrado.'
            );

            $sumatoriaDePrecios = 0;

            $array = Neumatico::traerJSON($path);

            foreach($array as $neumaticoAComprobar)
            {
                if($neumaticoAComprobar->marca == $neumatico->marca && $neumaticoAComprobar->medidas == $neumatico->medidas)
                {
                    $sumatoriaDePrecios += $neumaticoAComprobar->precio;
                }
            }


            if($sumatoriaDePrecios != 0)
            {
                $retorno = array(
                    'éxito' => true,
                    'mensaje' => 'La sumatoria de precios de los neumaticos registrados con esa marca y medidas es de ' . $sumatoriaDePrecios
                );
            }

            return json_encode($retorno, true);
        }















    }
}


?>