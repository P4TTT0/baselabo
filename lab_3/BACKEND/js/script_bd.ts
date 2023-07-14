$(()=>{

    VerificarJWT();

    AdministrarVerificarJWT();

    AdministrarLogout();

    AdministrarListar();

    AdministrarAgregar();

});


function VerificarJWT() {
    
    //RECUPERO DEL LOCALSTORAGE
    let jwt = localStorage.getItem("jwt");

    $.ajax({
        type: 'GET',
        url: URL_API + "login",
        dataType: "json",
        data: {},
        headers : {'Authorization': 'Bearer ' + jwt},
        async: true
    })
    .done(function (obj_rta:any) {

        console.log(obj_rta);

        if(obj_rta.exito){

            let app = obj_rta.jwt.api;
            let usuario = obj_rta.jwt.usuario;
            console.log(usuario);

            let alerta:string = ArmarAlert(app + "<br>" + JSON.stringify(usuario));

            $("#divResultado").html(alerta).toggle(2000);
            $("#nombre_usuario").html(usuario.nombre);
        }
        else{

            let alerta:string = ArmarAlert(obj_rta.mensaje, "danger");

            $("#divResultado").html(alerta).toggle(2000);

            setTimeout(() => {
                $(location).attr('href', URL_BASE + "index.html");
            }, 1500);
        }
    })
    .fail(function (jqXHR:any, textStatus:any, errorThrown:any) {

        let retorno = JSON.parse(jqXHR.responseText);

        let alerta:string = ArmarAlert(retorno.mensaje, "danger");

        $("#divResultado").html(alerta).show(2000);
    });    
}

function AdministrarVerificarJWT() {
    
    $("#verificarJWT").on("click", ()=>{

        VerificarJWT();
    });
}

function AdministrarLogout() {

    $("#logout").on("click", ()=>{

        localStorage.removeItem("jwt");

        let alerta:string = ArmarAlert('Usuario deslogueado!');
    
        $("#divResultado").html(alerta).show(2000);

        setTimeout(() => {
            $(location).attr('href', URL_BASE + "index.html");
        }, 1500);

    });

}

function AdministrarListar() {

    $("#listado_articulos").on("click", ()=>{
        ObtenerListadoProductos();
    });
}

function AdministrarAgregar() {

    $("#btnAgregar").on("click", ()=>{
        ArmarFormularioAlta();
    });
}

function ObtenerListadoProductos() {
   
    $("#divResultado").html("");

    let jwt = localStorage.getItem("jwt");

    $.ajax({
        type: 'GET',
        url: URL_API + "listarArticulosBD",
        dataType: "json",
        data: {},
        headers : {'Authorization': 'Bearer ' + jwt},
        async: true
    })
    .done(function (resultado:any) {

        console.log(resultado);

        let tabla:string = ArmarTablaJuguetes(resultado.dato);

        $("#divResultado").html(tabla).show(1000);

        $('[data-action="modificar"]').on('click', function (e) {
            
            let obj_prod_string : any = $(this).attr("data-obj_prod");
            let obj_prod = JSON.parse(obj_prod_string);

            let formulario = MostrarForm("modificacion", obj_prod);
        
            $("#cuerpo_modal_prod").html(formulario);           
        });
   
        $('[data-action="eliminar"]').on('click', function (e) {

            let obj_prod_string : any = $(this).attr("data-obj_prod");
            let obj_prod = JSON.parse(obj_prod_string);

            let formulario = MostrarForm("baja", obj_prod);
        
            $("#cuerpo_modal_prod").html(formulario);
        });
    })
    .fail(function (jqXHR:any, textStatus:any, errorThrown:any) {

        let retorno = JSON.parse(jqXHR.responseText);

        let alerta:string = ArmarAlert(retorno.mensaje, "danger");

        $("#divResultado").html(alerta).show(2000);
    });    
}

function ArmarTablaJuguetes(juguetes:[]) : string 
{   
    console.log(juguetes);
    let tabla:string = '<table class="table table-success table-striped table-hover">';
    tabla += '<tr><th>MARCA</th><th>NOMBRE</th><th>PRECIO</th><th>FOTO</th><th>ACCIONES</th></tr>';

    if(juguetes.length == 0)
    {
        tabla += '<tr><td>---</td><td>---</td><td>---</td><td>---</td><th>---</td></tr>';
    }
    else
    {
        juguetes.forEach((toy : any) => {
            tabla += "<tr>";
            for (const key in toy) {
                if(key != "path_foto") {
                    tabla += "<td>"+toy[key]+"</td>";
                } else if(key == "path_foto"){
                    tabla += "<td><img src='"+URL_API+ toy.path_foto+"' width='50px' height='50px'></td>";
                }
            }
            tabla += "<td><a href='#' class='btn' data-action='modificar-juguete' data-obj_user='"+JSON.stringify(toy)+"' title='Modificar'"+
            " data-toggle='modal' data-target='#ventana_modal_prod' ><span class='fas fa-edit'></span></a>";
            tabla += "<a href='#' class='btn' data-action='eliminar-juguete' data-obj_user='"+JSON.stringify(toy)+"' title='Eliminar'"+
            " data-toggle='modal' data-target='#ventana_modal_prod' ><span class='fas fa-times'></span></a>";
            tabla += "</td>";
            tabla += "</tr>";    
        });

    }

    tabla += "</table>";

    return tabla;
}

function ArmarFormularioAlta()
{
    $("#divResultado").html("");

    let formulario = MostrarForm("alta");

    $("#divResultado").html(formulario).show(1000);
}

function MostrarForm(accion:string, obj_prod:any=null) : string 
{
    let funcion = "";
    let encabezado = "";
    let solo_lectura = "";
    let solo_lectura_pk = "";

    switch (accion) {
        case "alta":
            funcion = 'Agregar(event)';
            encabezado = 'AGREGAR PRODUCTO';            
            solo_lectura_pk = "readonly";
            break;

         case "baja":
            funcion = 'Eliminar(event)';
            encabezado = 'ELIMINAR PRODUCTO';
            solo_lectura = "readonly";
            solo_lectura_pk = "readonly";
            break;
    
        case "modificacion":
            funcion = 'Modificar(event)';
            encabezado = 'MODIFICAR PRODUCTO';
            solo_lectura_pk = "readonly";
            break;
    }

    let id = "";
    let tipo = "";
    let precio = "";
    let path = URL_BASE+"/js/public/articulos/fotos/usr_default.jpg";

    if (obj_prod !== null) 
    {
        id = obj_prod.id;
        tipo = obj_prod.tipo;
        precio = obj_prod.precio;
        path = URL_API +"articulos/fotos/" + obj_prod.path_foto;       
    }

    let form: string = '<div class="container-fluid">\
    <div class="form-bottom" style="background-color: rgb(175, 11, 197);>\
            <h3 style="padding-top:1em;">'+encabezado+'</h3>\
                                    <div class="row">\
                                    <div class="offset-4 col-8 text-info">\
                                        <h2 style="color: rgb(7, 28, 151);">\
                                            ARTÍCULOS\
                                        </h2>\
                                    </div>\
                                </div>\
                            <br>\
            <form role="form" action="" method="" class="">\
                        <div class="form-group">'+                          
                            '<div class="input-group m-2">\
                                <div class="input-group-prepend">\
                                    <span class="input-group-text fas fa-trademark"></span> \
                                    <input type="text" class="form-control " id="id" '+solo_lectura_pk+' required placeholder="ID solo modificar y eliminar">\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">'+                          
                            '<div class="input-group m-2">\
                                <div class="input-group-prepend">\
                                    <span class="input-group-text fas fa-trademark"></span> \
                                    <input type="text" class="form-control" name="tipo" '+solo_lectura+' id="txtTipo" style="width:248px;" placeholder="Marca" />\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">    \
                            <div class="input-group m-2">\
                                <div class="input-group-prepend">\
                                    <span class="input-group-text fas fa-dollar-sign"></span> \
                                    <input type="text" class="form-control" name="precio"'+solo_lectura+' id="txtPrecio" style="width:250px;" placeholder="Precio" />\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <div class="input-group m-2">\
                                <div class="input-group-prepend">\
                                    <span class="input-group-text fas fa-camera"></span> \
                                    <input type="file" class="form-control" name="foto" '+solo_lectura+' id="txtFoto" style="width:250px;" placeholder="Foto" />\
                                </div>\
                            </div>\
                        </div>\
                       <div class="row justify-content-between"><img id="img_prod" src="" width="400px" height="200px"></div>\
                        <div class="row m-2">\
                            <div class="col-6">\
                                <button type="button" class="btn btn-success btn-block" id="btnEnviar" onclick="'+funcion+'">aceptar</button>\
                            </div>\
                            <div class="col-6">\
                                <button type="reset" class="btn btn-warning btn-block" id="btnLimpiar" >Limpiar</button>\
                            </div>\
                         </div>\ '
            + '</div> <br>\
                </form>\
    </div></div>';        
    $(document).ready(()=>{
    $("#id").val(id);
    $("#txtTipo").val(tipo);
    $("#txtPrecio").val(precio);
    $("#img_prod").attr("src",path);
    })
            

    return form;
}

function Agregar(e:any):void 
{  
    e.preventDefault();

    let jwt = localStorage.getItem("jwt");
    
    let tipo = $("#txtTipo").val();
    let precio = $("#txtPrecio").val();
    let foto: any = (<HTMLInputElement>document.getElementById("txtFoto"));

    let form = new FormData();
    form.append("articulo", JSON.stringify({"tipo":tipo, "precio":precio}));
    form.append("foto", foto.files[0]);
    console.log("Datos del formulario:");
    console.log("Artículo:", form.get("articulo"));
    console.log("Foto:", form.get("foto"));
   if(precio && tipo && foto){
    $.ajax({
        type: 'POST',
        url: URL_API + "agregarArticuloBD",
        dataType: "text",
        cache: false,
        contentType: false,
        processData: false,
        data: form,
        headers : {'Authorization': 'Bearer ' + jwt},
        async: true
    })
    .done(function (resultado:any) {

        console.log(resultado);

        let alerta:string = ArmarAlert(resultado);

        $("#divTablaDer").html(alerta);
        VerificarJWT();
        ObtenerListadoProductos();
        
    })
    .fail(function (jqXHR:any, textStatus:any, errorThrown:any) {

        let retorno = JSON.parse(jqXHR.responseText);

        let alerta:string = ArmarAlert(retorno.mensaje, "danger");

        $("#divTablaDer").html(alerta);
        VerificarJWT();
        ObtenerListadoProductos();

    });    
   }
}

function Modificar(e:any):void 
{  
    e.preventDefault();

    let jwt = localStorage.getItem("jwt");

    let tipo = $("#tipo").val();
    let marca = $("#marca").val();
    let precio = $("#precio").val();
    let foto: any = (<HTMLInputElement>document.getElementById("foto"));

    let form = new FormData();
    form.append("obj", JSON.stringify({"tipo":tipo, "marca":marca, "precio":precio}));
    form.append("foto", foto.files[0]);

    $.ajax({
        type: 'POST',
        url: URL_API + "productos_bd/modificar",
        dataType: "text",
        cache: false,
        contentType: false,
        processData: false,
        data: form,
        headers : {'Authorization': 'Bearer ' + jwt},
        async: true
    })
    .done(function (resultado:any) {

        console.log(resultado);

        ObtenerListadoProductos();

        $("#cuerpo_modal_prod").html("");
        
    })
    .fail(function (jqXHR:any, textStatus:any, errorThrown:any) {

        let retorno = JSON.parse(jqXHR.responseText);

        let alerta:string = ArmarAlert(retorno.mensaje, "danger");

        $("#divResultado").html(alerta);

    });    
}

function Eliminar(e:any):void 
{
    e.preventDefault();

    let jwt = localStorage.getItem("jwt");

    let tipo = $("#tipo").val();

    $.ajax({
        type: 'POST',
        url: URL_API + "productos_bd/eliminar",
        dataType: "text",
        data: {"tipo":tipo},
        headers : {'Authorization': 'Bearer ' + jwt},
        async: true
    })
    .done(function (resultado:any) {

        console.log(resultado);

        ObtenerListadoProductos();
        
        $("#cuerpo_modal_prod").html("");
    })
    .fail(function (jqXHR:any, textStatus:any, errorThrown:any) {

        let retorno = JSON.parse(jqXHR.responseText);

        let alerta:string = ArmarAlert(retorno.mensaje, "danger");

        $("#divResultado").html(alerta);

    });    
}