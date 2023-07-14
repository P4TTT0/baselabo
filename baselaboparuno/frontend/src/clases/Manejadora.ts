namespace PrimerParcial
{
    export class Manejadora implements IParte2
    {
        public static AgregarNeumaticoJSON() 
        {
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            let marca = (<HTMLInputElement>document.getElementById('marca')).value;
            let medidas = (<HTMLInputElement>document.getElementById('medidas')).value;
            let precio = (<HTMLInputElement>document.getElementById('precio')).value;

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

        public static verificarNeumaticoJSON()
        {
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            let marca = (<HTMLInputElement>document.getElementById('marca')).value;
            let medidas = (<HTMLInputElement>document.getElementById('medidas')).value;

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

        public static MostrarNeumaticoJSON()
        {
            let xhr : XMLHttpRequest = new XMLHttpRequest();
                
            xhr.open('GET','../backend/listadoNeumaticosJSON.php', true);
            xhr.send();

            xhr.onreadystatechange = () => 
            {

                if (xhr.readyState == 4 && xhr.status == 200)
                {
                    let neumaticos = JSON.parse(xhr.responseText);
                    let tablaHtml = '';

                    neumaticos.forEach((neumatico: any) => {
                    tablaHtml += 
                        `
                        <tr>
                            <td>${neumatico.marca}</td>
                            <td>${neumatico.medidas}</td>
                            <td>${neumatico.precio}</td>
                        </tr>
                        `;
                    });

                    let divTabla = (<HTMLInputElement>document.getElementById("divTabla"));
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
                        
            }
        }

        public static MostrarNeumatico()
        {
            let xhr : XMLHttpRequest = new XMLHttpRequest();
                
            xhr.open('GET','../backend/listadoNeumaticoBD.php?tabla=mostrar', true);
            xhr.send();

            xhr.onreadystatechange = () => 
            {

                if (xhr.readyState == 4 && xhr.status == 200)
                {
                    let divTabla = (<HTMLInputElement>document.getElementById("divTabla"));
                    divTabla.innerHTML = xhr.responseText;
                }
                        
            }
        }

        public static AgregarNeumaticoSinFoto() 
        {
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            let marca = (<HTMLInputElement>document.getElementById('marca')).value;
            let medidas = (<HTMLInputElement>document.getElementById('medidas')).value;
            let precio = (<HTMLInputElement>document.getElementById('precio')).value;

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

        public static EliminarNeumaticoStatic()
        {
            let manejadora = new Manejadora();
            manejadora.EliminarNeumatico();
        }

        public EliminarNeumatico()
        {
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            let id = (<HTMLInputElement>document.getElementById('idNeumatico')).value;
            let marca = (<HTMLInputElement>document.getElementById('marca')).value;
            let medidas = (<HTMLInputElement>document.getElementById('medidas')).value;
            let precio = (<HTMLInputElement>document.getElementById('precio')).value;

            let neumatico = new Entidades.NeumaticoBD(parseInt(id),"", marca, medidas, parseFloat(precio));
              
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

        public ModificarNeumatico()
        {
            let xhr : XMLHttpRequest = new XMLHttpRequest();
            
            let marca = (<HTMLInputElement> document.getElementById("marca")).value;
            let medidas = (<HTMLInputElement> document.getElementById("medidas")).value;
            let precio = (<HTMLInputElement> document.getElementById("precio")).value;
            let id = (<HTMLInputElement> document.getElementById("idNeumatico")).value;
                    
            let form : FormData = new FormData();
            
            let neumatico = new Entidades.NeumaticoBD(parseInt(id),"", marca,medidas,parseFloat(precio));

            form.append('neumatico_json',neumatico.ToString());
                        
            xhr.open('POST', '../backend/modificarNeumaticoBD.php', true);
            
            xhr.send(form);

            xhr.onreadystatechange = () => {

                if (xhr.readyState == 4 && xhr.status == 200)
                {
                    console.log(xhr.responseText);
                    alert(xhr.responseText);
                    Manejadora.MostrarNeumatico();   
                }
            };
        }

        public static ModificarNeumaticoStatic()
        {
            let manejadora = new Manejadora();
            manejadora.ModificarNeumatico();
        }
        
    }
}
