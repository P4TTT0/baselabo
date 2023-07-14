const express = require('express');

const app = express();

app.set('port', 7723); // setea el puerto que quieras abrir

const fs = require('fs');

//##############################################################################################//
//AGREGO JSON
app.use(express.json());
//##############################################################################################//

//##############################################################################################//
//AGREGO JWT
const jwt = require("jsonwebtoken");
//##############################################################################################//

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

app.listen(app.get('port'), ()=>{
    console.log('Servidor corriendo sobre puerto:', app.get('port'));
});

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
    database: 'bazar_bd' // BASE DE DATOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOS
};

app.use(myconn(mysql, db_options, 'single'));

//##############################################################################################//
//RUTAS PARA LOS MIDDLEWARES DEL JWT
//##############################################################################################//

//SE ESTABLECE LA CLAVE SECRETA PARA EL TOKEN
app.set("key", "perezcardenal.patricio");

app.use(express.urlencoded({ extended: false }));

const verificar_jwt = express.Router();
const verificar_usuario = express.Router();
const alta_baja = express.Router();
const modificar = express.Router();

verificar_jwt.use((request: any, response: any, next: any) => {

    //SE RECUPERA EL TOKEN DEL ENCABEZADO DE LA PETICIÓN
    let token = request.headers["x-access-token"] || request.headers["authorization"];


    if (! token) {

        response.status(401).send({
            exito: false,
            mensaje: "El JWT es requerido!!!",
            status: 401
        });

        return;

    }

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    if (token) {

        jwt.verify(token, app.get("key"), (error: any, decoded: any) => {

            if (error) {

                response.status(403).send({
                    exito: false,
                    mensaje: "El JWT NO es válido!!!",
                    status: 403
                });

                return;

            }
            else {

                response.jwt = decoded;

                next();
            }
        });


    }

});

verificar_usuario.use((request:any, response:any, next:any)=>{

    let obj = request.body;

    request.getConnection((err:any, conn:any)=>{

        if(err) throw("Error al conectarse a la base de datos.");

        conn.query("select * from usuarios where correo = ? and clave = ? ", [obj.correo, obj.clave], (err:any, rows:any)=>{

            if(err) throw("Error en consulta de base de datos.");

            if(rows.length == 1){

                response.obj_usuario = rows[0];

                next();
            }
            else{
                response.status(403).json({
                    exito : false,
                    mensaje : "Correo y/o clave incorrectas.",
                    jwt : null,
                    status: "403"
                });
            }
           
        });
    });
});

alta_baja.use(verificar_jwt, (request:any, response:any, next:any)=>{

    let obj = response.jwt;

    if(obj.usuario.rol == "administrador"){
   
         next();
    }
    else{
        return response.status(401).json({
            mensaje:"NO tiene el rol necesario para realizar la acción."
        });
    }
});

modificar.use(verificar_jwt, (request:any, response:any, next:any)=>{
  
    //SE RECUPERA EL TOKEN DEL OBJETO DE LA RESPUESTA
    let obj = response.jwt;

    if(obj.usuario.rol == "administrador" || obj.usuario.rol == "supervisor"){
        //SE INVOCA AL PRÓXIMO CALLEABLE
        next();
    }
    else{
        return response.status(401).json({
            mensaje:"NO tiene el rol necesario para realizar la acción."
        });
    }   
});

//##############################################################################################//
//RUTAS PARA EL TEST DE JWT
//##############################################################################################//

//** LOGIN*/
app.get('/login', verificar_jwt, (request: any, response: any) => {

    response.json({ exito: true, jwt: response.jwt , status: "200"});
});

/**LOGIN */
app.post("/login", verificar_usuario, (request:any, response:any, obj:any)=>{

    const user = response.obj_usuario;

    const payload = { 
        usuario: {
            id: user.id,
            nombre: user.nombre_usuario,
            correo:  user.correo,
            foto: user.foto_usuario
        },
        alumno: "Perez Cardenal Patricio",
        dni_alumno: "45571385"
    };

    const token = jwt.sign(payload, app.get("key"), {
        expiresIn : "3m"
    });

    response.json({
        exito : true,
        mensaje : "JWT creado!!!",
        jwt : token,
        status: 200
    });

});

//AGREGAR
app.post("/agregarArticuloBD", upload.single("foto"), verificar_jwt, (request: any, response: any) => {
    let obj_respuesta = {
      exito: false,
      mensaje: "No se pudo agregar el Articulo",
      status: 418,
    };
  
    let file = request.file;
    let extension = mime.extension(file.mimetype);
    let Articulo_json = JSON.parse(request.body.articulo);
    let path: string = file.destination + Articulo_json.precio + "." + extension;
  
    fs.renameSync(file.path, path);
  
    Articulo_json.path_foto = path.split("public/")[1];
  
    request.getConnection((err: any, conn: any) => {
      if (err) throw "Error al conectarse a la base de datos.";
  
      conn.query("INSERT INTO articulos set ?", [Articulo_json], (err: any, rows: any) => {
        if (err) {
          console.log(err);
          throw "Error en consulta de base de datos.";
        }
  
        obj_respuesta.exito = true;
        obj_respuesta.mensaje = "Articulo agregado!";
        obj_respuesta.status = 200;
  
        response.status(obj_respuesta.status).json(obj_respuesta);
      });
    });
  });

//LISTAR
app.get("/listarArticulosBD", verificar_jwt, (request: any, response: any) => {
    let obj_respuesta = {
      exito: false,
      mensaje: "No se encontraron Articulos",
      dato: {},
      status: 424,
    };
  
    request.getConnection((err: any, conn: any) => {
      if (err) throw "Error al conectarse a la base de datos.";
  
      conn.query("SELECT * FROM articulos", (err: any, rows: any) => {
        if (err) throw "Error en consulta de base de datos.";
  
        if (rows.length == 0) {
          response.status(obj_respuesta.status).json(obj_respuesta);
        } else {
          obj_respuesta.exito = true;
          obj_respuesta.mensaje = "Articulos encontrados!";
          obj_respuesta.dato = rows;
          obj_respuesta.status = 200;
          response.status(obj_respuesta.status).json(obj_respuesta);
        }
      });
    });
  });

//ELIMINAR
app.delete("/artis", verificar_jwt, (request: any, response: any) => {
    let obj_respuesta = {
      exito: false,
      mensaje: "No se pudo eliminar el articulo",
      status: 418,
    };
  
    let id = request.body.id_articulo;
    let obj: any = {};
    obj.id = id;
  
    let path_foto: string = "public/";
  
    request.getConnection((err: any, conn: any) => {
      if (err) throw "Error al conectarse a la base de datos.";
  
      // obtengo el path de la foto del usuario a ser eliminado
      conn.query("SELECT path_foto FROM articulos WHERE id = ?", [obj.id], (err: any, result: any) => {
        if (err) throw "Error en consulta de base de datos.";
  
        if (result.length != 0) {
          //console.log(result[0].foto);
          path_foto += result[0].path_foto;
        }
      });
    });
  
    request.getConnection((err: any, conn: any) => {
      if (err) throw "Error al conectarse a la base de datos.";
  
      conn.query("DELETE FROM articulos WHERE id = ?", [obj.id], (err: any, rows: any) => {
        if (err) {
          console.log(err);
          throw "Error en consulta de base de datos.";
        }
  
        if (fs.existsSync(path_foto) && path_foto != "public/") {
          fs.unlink(path_foto, (err: any) => {
            if (err) throw err;
            console.log(path_foto + " fue borrado.");
          });
        }
  
        if (rows.affectedRows == 0) {
          response.status(obj_respuesta.status).json(obj_respuesta);
        } else {
          obj_respuesta.exito = true;
          obj_respuesta.mensaje = "Articulo Eliminado!";
          obj_respuesta.status = 200;
          response.status(obj_respuesta.status).json(obj_respuesta);
        }
      });
    });
  });

//MODIFICAR
app.post("/artis", upload.single("foto"), verificar_jwt, (request: any, response: any) => {
    let obj_respuesta = {
      exito: false,
      mensaje: "No se pudo modificar el articulo",
      status: 418,
    };
  
    let file = request.file;
    let extension = mime.extension(file.mimetype);
    let articulo = JSON.parse(request.body.articulo);
    let path: string = file.destination + articulo.tipo + "_modificacion" + "." + extension;
  
    fs.renameSync(file.path, path);
  
    articulo.path_foto = path.split("public/")[1];
  
    let articulo_modif: any = {};
    //para excluir la pk (id)
    articulo_modif.tipo = articulo.tipo;
    articulo_modif.precio = articulo.precio;
    articulo_modif.path_foto = articulo.path_foto;
  
    request.getConnection((err: any, conn: any) => {
      if (err) throw "Error al conectarse a la base de datos.";
  
      conn.query("UPDATE articulos set ?  WHERE id = ?", [articulo_modif, articulo.id_articulo], (err: any, rows: any) => {
        if (err) {
          console.log(err);
          throw "Error en consulta de base de datos.";
        }
  
        if (rows.affectedRows == 0) {
          response.status(obj_respuesta.status).json(obj_respuesta);
        } else {
          obj_respuesta.exito = true;
          obj_respuesta.mensaje = "articulo modificado!";
          obj_respuesta.status = 200;
          response.status(obj_respuesta.status).json(obj_respuesta);
        }
      });
    });
  });