"use strict";
$(function () {
    VerificarJWT();
    administrarListado();
    AdministrarAgregar();
});
function VerificarJWT() {
    var jwt = localStorage.getItem("jwt");
    $.ajax({
        type: 'GET',
        url: URL_API + "login",
        dataType: "json",
        data: {},
        headers: { 'Authorization': 'Bearer ' + jwt },
        async: true
    })
        .done(function (obj_rta) {
        console.log(obj_rta);
        if (obj_rta.exito) {
            var app_1 = obj_rta.jwt.api;
            var usuario = obj_rta.jwt.usuario;
            var alerta = ArmarAlert(app_1 + "<br>" + JSON.stringify(usuario));
            $("#nombre_usuario").html(usuario.nombre);
        }
        else {
            var alerta = ArmarAlert(obj_rta.mensaje, "danger");
            $("#div_mensaje").html(alerta).toggle(2000);
            setTimeout(function () {
                $(location).attr('href', URL_BASE + "login.html");
            }, 1500);
        }
    })
        .fail(function (jqXHR, textStatus, errorThrown) {
        var retorno = JSON.parse(jqXHR.responseText);
        var alerta = ArmarAlert(retorno.mensaje, "danger");
        $("#div_mensaje").html(alerta).show(2000);
    });
}
function administrarListado() {
    VerificarJWT();
    $("#listado_articulos").on("click", function () {
        ObtenerListadoProductos();
    });
    $("#btnLimpiar").on("click", function () {
        $("#id").val("");
        $("#txtTipo").val("");
        $("#txtPrecio").val("");
        var inputFile = $("<input>").attr("type", "file").attr("id", "txtFoto").attr("name", "foto");
        $("#txtFoto").replaceWith(inputFile);
        var imgDefault = new Image();
        imgDefault.onload = function () {
            $("#img_prod").attr("src", imgDefault.src);
        };
        imgDefault.src = URL_BASE + "/js/public/articulos/fotos/usr_default.jpg";
    });
}
function ObtenerListadoProductos() {
    $("#divTablaIzq").html("");
    var jwt = localStorage.getItem("jwt");
    $.ajax({
        type: 'GET',
        url: URL_API + "listarArticulosBD",
        dataType: "json",
        data: {},
        headers: { 'Authorization': 'Bearer ' + jwt },
        async: true
    })
        .done(function (resultado) {
        console.log(resultado);
        var tabla = ArmarTablaProductos(resultado);
        $("#divTablaIzq").html(tabla).show(1000);
        $('[data-action="modificar"]').on('click', function (e) {
            var obj_prod_string = $(this).attr("data-obj_prod");
            var obj_prod = JSON.parse(obj_prod_string);
            var formulario = MostrarForm("modificacion", obj_prod);
            $("#divTablaDer").html(formulario);
        });
        $('[data-action="eliminar"]').on('click', function (e) {
            var obj_prod_string = $(this).attr("data-obj_prod");
            var obj_prod = JSON.parse(obj_prod_string);
            var formulario = MostrarForm("baja", obj_prod);
            $("#divTablaDer").html(formulario);
        });
        $("#btnLimpiar").on("click", function () {
            $("#id").val("");
            $("#txtTipo").val("");
            $("#txtPrecio").val("");
            var inputFile = $("<input>").attr("type", "file").attr("id", "txtFoto").attr("name", "foto");
            $("#txtFoto").replaceWith(inputFile);
            var imgDefault = new Image();
            imgDefault.onload = function () {
                $("#img_prod").attr("src", imgDefault.src);
            };
            imgDefault.src = URL_BASE + "/js/public/articulos/fotos/usr_default.jpg";
        });
    })
        .fail(function (jqXHR, textStatus, errorThrown) {
        var retorno = JSON.parse(jqXHR.responseText);
        var alerta = ArmarAlert(retorno.mensaje, "danger");
        $("#divTablaIzq").html(alerta).show(2000);
    });
}
function ArmarTablaProductos(productos) {
    var tabla = '<table class="table table-success table-striped table-hover">';
    tabla += '<tr><th>ID</th><th>TIPO</th><th>PRECIO</th><th>FOTO</th><th style="width:110px">ACCIONES</th></tr>';
    if (productos.length == 0) {
        tabla += '<tr><td>---</td><td>---</td><td>---</td><td>---</td><th>---</td></tr>';
    }
    else {
        productos.forEach(function (toy) {
            tabla += "<tr>";
            for (var key in toy) {
                if (key != "path_foto") {
                    tabla += "<td>" + toy[key] + "</td>";
                }
                else if (key == "path_foto") {
                    tabla += "<td><img src='" + URL_API + "articulos/fotos/" + toy.path_foto + "' width='50px' height='50px'></td>";
                }
            }
            tabla += "<td><a href='#' class='btn' data-action='modificar' data-obj_prod='" + JSON.stringify(toy) + "' title='Modificar'" +
                " data-toggle='modal' data-target='#ventana_modal_prod' ><span class='fas fa-edit'></span></a>";
            tabla += "<a href='#' class='btn' data-action='eliminar' data-obj_prod='" + JSON.stringify(toy) + "' title='Eliminar'" +
                " data-toggle='modal' data-target='#ventana_modal_prod' ><span class='fas fa-times'></span></a>";
            tabla += "</td>";
            tabla += "</tr>";
        });
    }
    tabla += "</table>";
    return tabla;
}
function ArmarFormularioAlta() {
    $("#divTablaDer").html("");
    var formulario = MostrarForm("alta");
    $("#divTablaDer").html(formulario).show(1000);
    $("#btnLimpiar").on("click", function () {
        $("#id").val("");
        $("#txtTipo").val("");
        $("#txtPrecio").val("");
        var inputFile = $("<input>").attr("type", "file").attr("id", "txtFoto").attr("name", "foto");
        $("#txtFoto").replaceWith(inputFile);
        var imgDefault = new Image();
        imgDefault.onload = function () {
            $("#img_prod").attr("src", imgDefault.src);
        };
        imgDefault.src = URL_BASE + "/js/public/articulos/fotos/usr_default.jpg";
    });
}
function MostrarForm(accion, obj_prod) {
    if (obj_prod === void 0) { obj_prod = null; }
    var funcion = "";
    var encabezado = "";
    var solo_lectura = "";
    var solo_lectura_pk = "";
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
    var id = "";
    var tipo = "";
    var precio = "";
    var path = URL_BASE + "/js/public/articulos/fotos/usr_default.jpg";
    if (obj_prod !== null) {
        id = obj_prod.id;
        tipo = obj_prod.tipo;
        precio = obj_prod.precio;
        path = URL_API + "articulos/fotos/" + obj_prod.path_foto;
    }
    var form = '<div class="container-fluid">\
    <div class="form-bottom" style="background-color: rgb(175, 11, 197);>\
            <h3 style="padding-top:1em;">' + encabezado + '</h3>\
                                    <div class="row">\
                                    <div class="offset-4 col-8 text-info">\
                                        <h2 style="color: rgb(7, 28, 151);">\
                                            ARTÍCULOS\
                                        </h2>\
                                    </div>\
                                </div>\
                            <br>\
            <form role="form" action="" method="" class="">\
                        <div class="form-group">' +
        '<div class="input-group m-2">\
                                <div class="input-group-prepend">\
                                    <span class="input-group-text fas fa-trademark"></span> \
                                    <input type="text" class="form-control " id="id" ' + solo_lectura_pk + ' required placeholder="ID solo modificar y eliminar">\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">' +
        '<div class="input-group m-2">\
                                <div class="input-group-prepend">\
                                    <span class="input-group-text fas fa-trademark"></span> \
                                    <input type="text" class="form-control" name="tipo" ' + solo_lectura + ' id="txtTipo" style="width:248px;" placeholder="Marca" />\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">    \
                            <div class="input-group m-2">\
                                <div class="input-group-prepend">\
                                    <span class="input-group-text fas fa-dollar-sign"></span> \
                                    <input type="text" class="form-control" name="precio"' + solo_lectura + ' id="txtPrecio" style="width:250px;" placeholder="Precio" />\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <div class="input-group m-2">\
                                <div class="input-group-prepend">\
                                    <span class="input-group-text fas fa-camera"></span> \
                                    <input type="file" class="form-control" name="foto" ' + solo_lectura + ' id="txtFoto" style="width:250px;" placeholder="Foto" />\
                                </div>\
                            </div>\
                        </div>\
                       <div class="row justify-content-between"><img id="img_prod" src="" width="400px" height="200px"></div>\
                        <div class="row m-2">\
                            <div class="col-6">\
                                <button type="button" class="btn btn-success btn-block" id="btnEnviar" onclick="' + funcion + '">aceptar</button>\
                            </div>\
                            <div class="col-6">\
                                <button type="reset" class="btn btn-warning btn-block" id="btnLimpiar" >Limpiar</button>\
                            </div>\
                         </div>\ '
        + '</div> <br>\
                </form>\
    </div></div>';
    $(document).ready(function () {
        $("#id").val(id);
        $("#txtTipo").val(tipo);
        $("#txtPrecio").val(precio);
        $("#img_prod").attr("src", path);
    });
    return form;
}
function AdministrarAgregar() {
    VerificarJWT();
    $("#alta_juguete").on("click", function () {
        ArmarFormularioAlta();
    });
}
function Agregar(e) {
    e.preventDefault();
    var jwt = localStorage.getItem("jwt");
    var tipo = $("#txtTipo").val();
    var precio = $("#txtPrecio").val();
    var foto = document.getElementById("txtFoto");
    var form = new FormData();
    form.append("articulo", JSON.stringify({ "tipo": tipo, "precio": precio }));
    form.append("foto", foto.files[0]);
    if (precio && tipo && foto) {
        $.ajax({
            type: 'POST',
            url: URL_API + "agregarArticuloBD",
            dataType: "text",
            cache: false,
            contentType: false,
            processData: false,
            data: form,
            headers: { 'Authorization': 'Bearer ' + jwt },
            async: true
        })
            .done(function (resultado) {
            console.log(resultado);
            var alerta = ArmarAlert(resultado);
            $("#divTablaDer").html(alerta);
            VerificarJWT();
            ObtenerListadoProductos();
        })
            .fail(function (jqXHR, textStatus, errorThrown) {
            var retorno = JSON.parse(jqXHR.responseText);
            var alerta = ArmarAlert(retorno.mensaje, "danger");
            $("#divTablaDer").html(alerta);
            VerificarJWT();
            ObtenerListadoProductos();
        });
    }
}
function Modificar(e) {
    e.preventDefault();
    var jwt = localStorage.getItem("jwt");
    var id = $("#id").val();
    var tipo = $("#txtTipo").val();
    var precio = $("#txtPrecio").val();
    var foto = document.getElementById("txtFoto");
    var form = new FormData();
    form.append("articulo", JSON.stringify({ "id": id, "tipo": tipo, "precio": precio }));
    form.append("foto", foto.files[0]);
    if (precio && tipo && foto) {
        $.ajax({
            type: 'POST',
            url: URL_API + "artis",
            dataType: "text",
            cache: false,
            contentType: false,
            processData: false,
            data: form,
            headers: { 'Authorization': 'Bearer ' + jwt },
            async: true
        })
            .done(function (resultado) {
            console.log(resultado);
            var alerta = ArmarAlert(resultado);
            $("#divTablaDer").html(alerta);
            VerificarJWT();
            ObtenerListadoProductos();
        })
            .fail(function (jqXHR, textStatus, errorThrown) {
            var retorno = JSON.parse(jqXHR.responseText);
            var alerta = ArmarAlert(retorno.mensaje, "danger");
            VerificarJWT();
            $("#divTablaDer").html(alerta);
        });
    }
}
function Eliminar(e) {
    e.preventDefault();
    var jwt = localStorage.getItem("jwt");
    var id = $("#id").val();
    if (confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
        if (id) {
            $.ajax({
                type: 'DELETE',
                url: URL_API + "artis/" + id,
                dataType: "text",
                cache: false,
                contentType: false,
                processData: false,
                headers: { 'Authorization': 'Bearer ' + jwt },
                async: true
            })
                .done(function (resultado) {
                console.log(resultado);
                var alerta = ArmarAlert(resultado);
                $("#divTablaDer").html(alerta);
                VerificarJWT();
                ObtenerListadoProductos();
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                var retorno = JSON.parse(jqXHR.responseText);
                var alerta = ArmarAlert(retorno.mensaje, "danger");
                VerificarJWT();
                $("#divTablaDer").html(alerta);
            });
        }
    }
}
//# sourceMappingURL=script_bd.js.map