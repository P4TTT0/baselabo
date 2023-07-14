"use strict";
var PrimerParcial;
(function (PrimerParcial) {
    class Manejadora {
        static AgregarNeumaticoJSON() {
            let xhr = new XMLHttpRequest();
            let marca = document.getElementById('marca').value;
            let medidas = document.getElementById('medidas').value;
            let precio = document.getElementById('precio').value;
            let form = new FormData();
            xhr.open('POST', "../backend/altaNeumaticoJSON.php", true);
            form.append('marca', marca);
            form.append('medidas', medidas);
            form.append('precio', precio);
            xhr.send(form);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log(xhr.responseText);
                    alert(xhr.responseText);
                }
            };
        }
        static verificarNeumaticoJSON() {
            let xhr = new XMLHttpRequest();
            let marca = document.getElementById('marca').value;
            let medidas = document.getElementById('medidas').value;
            let form = new FormData();
            xhr.open('POST', "../backend/verificarNeumaticoJSON.php", true);
            form.append('marca', marca);
            form.append('medidas', medidas);
            xhr.send(form);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log(xhr.responseText);
                    alert(xhr.responseText);
                }
            };
        }
        static MostrarNeumaticoJSON() {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '../backend/listadoNeumaticosJSON.php', true);
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let neumaticos = JSON.parse(xhr.responseText);
                    let tablaHtml = '';
                    neumaticos.forEach((neumatico) => {
                        tablaHtml +=
                            `
                        <tr>
                            <td>${neumatico.marca}</td>
                            <td>${neumatico.medidas}</td>
                            <td>${neumatico.precio}</td>
                        </tr>
                        `;
                    });
                    let divTabla = document.getElementById("divTabla");
                    divTabla.innerHTML =
                        `
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Marca</th>
                                    <th>Medidas</th>
                                    <th>Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tablaHtml}
                            </tbody>
                        </table>
                        `;
                }
            };
        }
        static MostrarNeumatico() {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '../backend/listadoNeumaticoBD.php?tabla=mostrar', true);
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let divTabla = document.getElementById("divTabla");
                    divTabla.innerHTML = xhr.responseText;
                }
            };
        }
        static AgregarNeumaticoSinFoto() {
            let xhr = new XMLHttpRequest();
            let marca = document.getElementById('marca').value;
            let medidas = document.getElementById('medidas').value;
            let precio = document.getElementById('precio').value;
            let neumatico = new Entidades.Neumatico(marca, medidas, parseFloat(precio));
            let json = JSON.stringify(neumatico);
            let form = new FormData();
            xhr.open('POST', "../backend/agregarNeumaticoSinFoto.php", true);
            form.append('neumatico_json', json);
            xhr.send(form);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log(xhr.responseText);
                    alert(xhr.responseText);
                }
            };
        }
        static EliminarNeumaticoStatic() {
            let manejadora = new Manejadora();
            manejadora.EliminarNeumatico();
        }
        EliminarNeumatico() {
            let xhr = new XMLHttpRequest();
            let id = document.getElementById('idNeumatico').value;
            let marca = document.getElementById('marca').value;
            let medidas = document.getElementById('medidas').value;
            let precio = document.getElementById('precio').value;
            let neumatico = new Entidades.NeumaticoBD(parseInt(id), "", marca, medidas, parseFloat(precio));
            let json = JSON.stringify(neumatico);
            let form = new FormData();
            xhr.open('POST', "../backend/eliminarNeumaticoBD.php", true);
            form.append('neumatico_json', json);
            xhr.send(form);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log(xhr.responseText);
                    alert(xhr.responseText);
                }
            };
        }
        ModificarNeumatico() {
            let xhr = new XMLHttpRequest();
            let marca = document.getElementById("marca").value;
            let medidas = document.getElementById("medidas").value;
            let precio = document.getElementById("precio").value;
            let id = document.getElementById("idNeumatico").value;
            let form = new FormData();
            let neumatico = new Entidades.NeumaticoBD(parseInt(id), "", marca, medidas, parseFloat(precio));
            form.append('neumatico_json', neumatico.ToString());
            xhr.open('POST', '../backend/modificarNeumaticoBD.php', true);
            xhr.send(form);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log(xhr.responseText);
                    alert(xhr.responseText);
                    Manejadora.MostrarNeumatico();
                }
            };
        }
        static ModificarNeumaticoStatic() {
            let manejadora = new Manejadora();
            manejadora.ModificarNeumatico();
        }
    }
    PrimerParcial.Manejadora = Manejadora;
})(PrimerParcial || (PrimerParcial = {}));
//# sourceMappingURL=Manejadora.js.map