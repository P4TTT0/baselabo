
const URL_API : string = "http://localhost:7723/";
const URL_BASE : string = "http://localhost/baselabo/lab_3/rsp/";

function ArmarAlert(mensaje:string, tipo:string = "success"):string
{
    let alerta:string = '<div id="alert_' + tipo + '" class="alert alert-' + tipo + ' alert-dismissable">';
    alerta += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
    alerta += '<span class="d-inline-block text-truncate" style="max-width: 450px;">' + mensaje + ' </span></div>';

    return alerta;
}