<?php
namespace Tulis\Luis
{
    require_once("accesoDatos.php");
    require_once("neumatico.php");
    require_once("interface_parte1.php");    
    require_once("interface_parte2.php");
    require_once("interface_parte3.php");
    require_once("interface_parte4.php");
    use IParte1;
    use IParte2;
    use IParte3;
    use Iparte4;
    use Poo\AccesoDatos;
    use PDO;

    class NeumaticoBD extends Neumatico implements IParte1, IParte2, IParte3, IParte4
    {
        public int $id;
        public string $pathFoto;

        function __construct(string $marca, string $medidas, float $precio = 0, int $id = 0, string $pathFoto = "")
        {
            parent::__construct($marca, $medidas, $precio);
            $this->id = $id;
            $this->pathFoto = $pathFoto;            
        }

        function ToJSON()
        {
            $retorno = array(
                'marca' => $this->marca,
                'medidas' => $this->medidas,
                'precio' => $this->precio,
                'id' => $this->id,
                'pathFoto' => $this->pathFoto
            );

            return json_encode($retorno, true);
        }

        function agregar(): bool
        {
            $retorno = false;
    
            $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso();
            
            $consulta =$objetoAccesoDato->retornarConsulta("INSERT INTO neumaticos (id, marca, medidas, precio, foto)"
                                                        . "VALUES(:id, :marca, :medidas, :precio, :foto)");
            
            
            $consulta->bindValue(':marca', $this->marca, PDO::PARAM_STR);
            $consulta->bindValue(':medidas', $this->medidas, PDO::PARAM_STR);
            $consulta->bindValue(':precio', $this->precio, PDO::PARAM_STR);
            $consulta->bindValue(':foto', $this->pathFoto, PDO::PARAM_STR);
            $consulta->bindValue(':id', $this->id, PDO::PARAM_INT);

            $consulta->execute();

            if($consulta->rowCount() != 0)
            {
                $retorno = true;
            }
    
            return $retorno;
           
        }

        static function traer(): array
        {
            $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso();
        
            $consulta = $objetoAccesoDato->retornarConsulta("SELECT marca, medidas, precio, id, foto FROM neumaticos");        
            
            $consulta->execute();
            
            while ($row = $consulta->fetch(PDO::FETCH_ASSOC)) 
            {
                $neumatico = new NeumaticoBD($row["marca"], $row["medidas"], $row["precio"], $row["id"], "");
                if($row["foto"] != null)
                {
                    $neumatico->pathFoto = $row["foto"];
                }
                $neumaticos[] = $neumatico; 
            }          
    
            return $neumaticos; 
        }

        static function eliminar($id): bool
        {
            $retorno = false;
            

            $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso();
            $consulta = $objetoAccesoDato->retornarConsulta("DELETE FROM neumaticos WHERE id = :id");

            $consulta->bindValue(":id", $id, PDO::PARAM_STR);

            $consulta->execute();

            if($consulta->rowCount() != 0)
            {
                $retorno = true;
            }

            return $retorno;
        }

        function modificar(): bool
        {
            $retorno = false;
            $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso();
            $consulta = $objetoAccesoDato->retornarConsulta("UPDATE neumaticos SET marca = :marca, medidas = :medidas, precio = :precio WHERE id = :id");
    
            $consulta->bindValue(':marca', $this->marca, PDO::PARAM_STR);
            $consulta->bindValue(':medidas', $this->medidas, PDO::PARAM_STR);
            $consulta->bindValue(':precio', $this->precio, PDO::PARAM_STR);
            $consulta->bindValue(':id', $this->id, PDO::PARAM_INT);
            
            $consulta->execute();

            if($consulta->rowCount() != 0)
            {
                $retorno = true;
            }
    
            return $retorno;
        }

        function existe($array) : bool
        {
            $retorno = false;

            foreach($array as $comprobar)
            {
                if($this->marca == $comprobar->marca && $this->medidas == $comprobar->medidas)
                {
                    $retorno = true;
                    break;
                }
            }

            return $retorno;
        }

        public function guardarEnArchivo() : string
        {
            $archivo = fopen("./archivos/neumaticosbd_borrados.txt", "a");
            $exito = false;
            $mensaje = "No se pudo guardar en el archivo";

            if($archivo != false)
            {
                
                $exito = true;
                $mensaje = "Se guardo correctamente en el archivo";
                $lecturaArchivo = explode(".",$this->pathFoto)[3];
                
                $pathNuevo = "./neumaticos/neumaticosBorrados/" . $this->id . "." . $this->marca . ".borrado." . date("His") . "." . $lecturaArchivo;
                $pathViejo = "./neumaticos/imagenes/" . $this->pathFoto;
                rename($pathViejo, $pathNuevo);
                fwrite($archivo, $this->marca . $this->medidas . $this->precio . $pathNuevo . "\r\n");
            }

            fclose($archivo);            
            
            return json_encode(array('exito' => $exito, 'mensaje' => $mensaje));
        }
    }
}

?>