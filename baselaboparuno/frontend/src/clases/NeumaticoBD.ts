namespace Entidades
{
    export class NeumaticoBD extends Neumatico
    {
        public id : number;
        public pathFoto : string;


        public constructor(id = -1, pathFoto = "", marca = "", medidas = "", precio = 0)
        {
            super(marca, medidas, precio)
            this.id = id;
            this.pathFoto = pathFoto;
        }

        public ToJSON()
        {
            return this.ToString();
        }

        
    }
}