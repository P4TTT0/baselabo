const express = require('express');
const app = express();
app.set('puerto', 7723);
// #region CONFIG
//AGREGO FILE SYSTEM
const fs = require('fs');
//AGREGO JSON
app.use(express.json());
//AGREGO JWT
const jwt = require("jsonwebtoken");
//SE ESTABLECE LA CLAVE SECRETA PARA EL TOKEN
app.set("key", "luna.milagros");
app.use(express.urlencoded({extended:false}));
//AGREGO MULTER
const multer = require('multer');
//AGREGO MIME-TYPES
const mime = require('mime-types');
//AGREGO STORAGE
const storage = multer.diskStorage({
    destination: "public/articulos/fotos/",
});
const upload = multer({

    storage: storage
});
//AGREGO CORS (por default aplica a http://localhost)
const cors = require("cors");
//AGREGO MW 
app.use(cors());
//DIRECTORIO DE ARCHIVOS ESTÁTICOS
app.use(express.static("public"));
//AGREGO MYSQL y EXPRESS-MYCONNECTION
const mysql = require('mysql');
const myconn = require('express-myconnection');
const db_options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: "bazar_bd"
};
app.use(myconn(mysql, db_options, 'single'));
// #endregion

//#region VERIFICAR USUARIO
const verificar_usuario = express.Router();
verificar_usuario.use((request: any, response: any, next: any) => {
    // obj recibe un json
    let obj = request.body;
    request.getConnection((err: any, conn: any) => {
        if (err) throw ("Error al conectarse a la base de datos.");

        conn.query("SELECT * FROM usuarios WHERE correo = ? AND clave = ?", [obj.correo, obj.clave], (err: any, rows: any) => {
            if (err) throw ("Error en consulta de base de datos.");

            if (rows.length > 0) {
                response.obj_usuario = rows[0]; // le asigno al response el obj recibido
                next(); // Se invoca al siguiente middleware o ruta
            } else {
                response.status(403).json({
                    exito: false,
                    mensaje: "No se encontro un usuario con ese correo y clave",
                    jwt: null
                });
            }
        });
    });
});
//#endregion

app.post("/login", verificar_usuario, (request: any, response: any) => {
    const user = response.obj_usuario;

    const payload = {
        usuario: {
            id: user.id,
            correo: user.correo,
            clave: user.clave,
            nombre: user.nombre_usuario,
            foto: user.foto_usuario,
        },
        alumno: "Mialgros Luna",
        dni_alumno: "45873034",
        api: "bazar_bd",
    };

    const token = jwt.sign(payload, app.get("key"), {
        expiresIn: "3m"
    });

    response.status(200).json({
        exito : true,
        mensaje : "JWT creado!!!",
        jwt : token
    });

});

//#region VERIFICAR JWT
const verificar_jwt = express.Router();

verificar_jwt.use((request:any, response:any, next:any)=>{

    //SE RECUPERA EL TOKEN DEL ENCABEZADO DE LA PETICIÓN
    let token = request.headers["x-access-token"] || request.headers["authorization"];    
    if (!token) {
    response.status(403).send({error: "El JWT es requerido!!!"});
    return;}

    if(token.startsWith("Bearer")){token = token.slice(7, token.length);}

    if(token){
        //SE VERIFICA EL TOKEN CON LA CLAVE SECRETA
        jwt.verify(token, app.get("key"), (error:any, decoded:any)=>{

            if(error){
                return response.json({
                    exito: false,
                    mensaje:"El JWT NO es válido!!!"
                });
            }
            else{
                console.log("middleware verificar_jwt");
                //SE AGREGA EL TOKEN AL OBJETO DE LA RESPUESTA
                response.status(200).jwt = decoded;
                //SE INVOCA AL PRÓXIMO CALLEABLE
                next();
            }
        });
    }
});

//#endregion

app.get('/login',verificar_jwt,(request:any, response:any)=>{    
    response.status(200).json({exito:true,mensaje:"ok", jwt: response.jwt});
});

app.post('/agregarArticuloBD',upload.single("foto"),verificar_jwt,(request:any, response:any)=>{  
    let file = request.file;
    let extension = mime.extension(file.mimetype);    
    let obj = JSON.parse(request.body.articulo);   
    let path : string = file.destination +  obj.tipo + "." + extension;
    fs.renameSync(file.path, path);
    obj.path_foto = path.split("public/articulos/fotos/")[1];
    request.getConnection((err:any, conn:any)=>{
        if(err) throw("Error al conectarse a la base de datos.");
        conn.query("insert into articulos set ?", [obj], (err:any, rows:any)=>{
            if(err) {console.log(err); throw("Error en consulta de base de datos.");}
            response.send("Producto agregado a la bd.");
        });
    });
});


app.get("/listarArticulosBD",verificar_jwt,(request:any, response:any)=>{

    request.getConnection((err:any, conn:any)=>{

        if(err) throw("Error al conectarse a la base de datos.");

        conn.query("select * from articulos", (err:any, rows:any)=>{

            if(err) throw("Error en consulta de base de datos.");

            response.send(JSON.stringify(rows));
        });
    });
});

app.delete('/artis/:id_juguete', verificar_jwt, (request:any, response:any)=>{   
    let id_juguete = request.params.id_juguete;
    let path_foto : string = "public/";
    request.getConnection((err:any, conn:any)=>{

        if(err) throw("Error al conectarse a la base de datos.");

        //obtengo el path de la foto del producto a ser eliminado
        conn.query("select path_foto from articulos where id = ?", [id_juguete], (err:any, result:any)=>{

            if(err) throw("Error en consulta de base de datos.");
           
            path_foto += result[0].path_foto;
        });
    });
    request.getConnection((err:any, conn:any)=>{

        if(err) throw("Error al conectarse a la base de datos.");

        conn.query("delete from articulos where id = ?", [id_juguete], (err:any, rows:any)=>{

            if(err) {console.log(err); throw("Error en consulta de base de datos.");}

            if (fs.existsSync(path_foto)) {
                fs.unlink(path_foto, (err:any) => {
                if (err) throw err;
                console.log(path_foto + ' fue borrado.');
            });
            } 
            response.send("art eliminado de la bd.");
        });
    });
});


app.post('/artis', verificar_jwt, upload.single("foto"), (request:any, response:any)=>{
    
    let file = request.file;
    let extension = mime.extension(file.mimetype);
    let obj = JSON.parse(request.body.articulo);
    let path : string = file.destination + obj.tipo + "_modificacion." + extension;

    fs.renameSync(file.path, path);

    obj.path_foto = path.split("public/articulos/fotos/")[1];

    let obj_modif : any = {};
    //para excluir la pk (codigo)
    obj_modif.tipo = obj.tipo;
    obj_modif.precio = obj.precio;
    obj_modif.path_foto = obj.path_foto;

    request.getConnection((err:any, conn:any)=>{

        if(err) throw("Error al conectarse a la base de datos.");

        conn.query("update articulos set ? where id = ?", [obj_modif, obj.id], (err:any, rows:any)=>{

            if(err) {console.log(err); throw("Error en consulta de base de datos.");}

            response.send("art modificado en la bd.");
        });
    });
});




app.listen(app.get('puerto'), ()=>{
    console.log('Servidor corriendo sobre puerto:', app.get('puerto'));
});