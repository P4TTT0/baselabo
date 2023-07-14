"use strict";
var Entidades;
(function (Entidades) {
    class NeumaticoBD extends Entidades.Neumatico {
        constructor(id = -1, pathFoto = "", marca = "", medidas = "", precio = 0) {
            super(marca, medidas, precio);
            this.id = id;
            this.pathFoto = pathFoto;
        }
        ToJSON() {
            return this.ToString();
        }
    }
    Entidades.NeumaticoBD = NeumaticoBD;
})(Entidades || (Entidades = {}));
//# sourceMappingURL=NeumaticoBD.js.map