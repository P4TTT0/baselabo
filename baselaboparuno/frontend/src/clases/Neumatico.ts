namespace Entidades
{
    export class Neumatico
    {
        public marca : string;
        public medidas : string;
        public precio : number;
        
        public constructor(marca : string, medidas : string, precio : number)
        {
            this.marca = marca;
            this.medidas = medidas;
            this.precio = precio;
        }

        public ToString()
        {
            return JSON.stringify(this);
        }

        public ToJSON()
        {
            return this.ToString();
        }
    }
}