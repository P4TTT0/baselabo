"use strict";
var express = require('express');
var app = express();
app.set('puerto', 7723);
var fs = require('fs');
app.use(express.json());
var jwt = require("jsonwebtoken");
app.set("key", "luna.milagros");
app.use(express.urlencoded({ extended: false }));
var multer = require('multer');
var mime = require('mime-types');
var storage = multer.diskStorage({
    destination: "public/articulos/fotos/",
});
var upload = multer({
    storage: storage
});
var cors = require("cors");
app.use(cors());
app.use(express.static("public"));
var mysql = require('mysql');
var myconn = require('express-myconnection');
var db_options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: "bazar_bd"
};
app.use(myconn(mysql, db_options, 'single'));
var verificar_usuario = express.Router();
verificar_usuario.use(function (request, response, next) {
    var obj = request.body;
    request.getConnection(function (err, conn) {
        if (err)
            throw ("Error al conectarse a la base de datos.");
        conn.query("SELECT * FROM usuarios WHERE correo = ? AND clave = ?", [obj.correo, obj.clave], function (err, rows) {
            if (err)
                throw ("Error en consulta de base de datos.");
            if (rows.length > 0) {
                response.obj_usuario = rows[0];
                next();
            }
            else {
                response.status(403).json({
                    exito: false,
                    mensaje: "No se encontro un usuario con ese correo y clave",
                    jwt: null
                });
            }
        });
    });
});
app.post("/login", verificar_usuario, function (request, response) {
    var user = response.obj_usuario;
    var payload = {
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
    var token = jwt.sign(payload, app.get("key"), {
        expiresIn: "3m"
    });
    response.status(200).json({
        exito: true,
        mensaje: "JWT creado!!!",
        jwt: token
    });
});
var verificar_jwt = express.Router();
verificar_jwt.use(function (request, response, next) {
    var token = request.headers["x-access-token"] || request.headers["authorization"];
    if (!token) {
        response.status(403).send({ error: "El JWT es requerido!!!" });
        return;
    }
    if (token.startsWith("Bearer")) {
        token = token.slice(7, token.length);
    }
    if (token) {
        jwt.verify(token, app.get("key"), function (error, decoded) {
            if (error) {
                return response.json({
                    exito: false,
                    mensaje: "El JWT NO es válido!!!"
                });
            }
            else {
                console.log("middleware verificar_jwt");
                response.status(200).jwt = decoded;
                next();
            }
        });
    }
});
app.get('/login', verificar_jwt, function (request, response) {
    response.status(200).json({ exito: true, mensaje: "ok", jwt: response.jwt });
});
app.post('/agregarArticuloBD', upload.single("foto"), verificar_jwt, function (request, response) {
    var file = request.file;
    var extension = mime.extension(file.mimetype);
    var obj = JSON.parse(request.body.articulo);
    var path = file.destination + obj.tipo + "." + extension;
    fs.renameSync(file.path, path);
    obj.path_foto = path.split("public/articulos/fotos/")[1];
    request.getConnection(function (err, conn) {
        if (err)
            throw ("Error al conectarse a la base de datos.");
        conn.query("insert into articulos set ?", [obj], function (err, rows) {
            if (err) {
                console.log(err);
                throw ("Error en consulta de base de datos.");
            }
            response.send("Producto agregado a la bd.");
        });
    });
});
app.get("/listarArticulosBD", verificar_jwt, function (request, response) {
    request.getConnection(function (err, conn) {
        if (err)
            throw ("Error al conectarse a la base de datos.");
        conn.query("select * from articulos", function (err, rows) {
            if (err)
                throw ("Error en consulta de base de datos.");
            response.send(JSON.stringify(rows));
        });
    });
});
app.delete('/artis/:id_juguete', verificar_jwt, function (request, response) {
    var id_juguete = request.params.id_juguete;
    var path_foto = "public/";
    request.getConnection(function (err, conn) {
        if (err)
            throw ("Error al conectarse a la base de datos.");
        conn.query("select path_foto from articulos where id = ?", [id_juguete], function (err, result) {
            if (err)
                throw ("Error en consulta de base de datos.");
            path_foto += result[0].path_foto;
        });
    });
    request.getConnection(function (err, conn) {
        if (err)
            throw ("Error al conectarse a la base de datos.");
        conn.query("delete from articulos where id = ?", [id_juguete], function (err, rows) {
            if (err) {
                console.log(err);
                throw ("Error en consulta de base de datos.");
            }
            if (fs.existsSync(path_foto)) {
                fs.unlink(path_foto, function (err) {
                    if (err)
                        throw err;
                    console.log(path_foto + ' fue borrado.');
                });
            }
            response.send("art eliminado de la bd.");
        });
    });
});
app.post('/artis', verificar_jwt, upload.single("foto"), function (request, response) {
    var file = request.file;
    var extension = mime.extension(file.mimetype);
    var obj = JSON.parse(request.body.articulo);
    var path = file.destination + obj.tipo + "_modificacion." + extension;
    fs.renameSync(file.path, path);
    obj.path_foto = path.split("public/articulos/fotos/")[1];
    var obj_modif = {};
    obj_modif.tipo = obj.tipo;
    obj_modif.precio = obj.precio;
    obj_modif.path_foto = obj.path_foto;
    request.getConnection(function (err, conn) {
        if (err)
            throw ("Error al conectarse a la base de datos.");
        conn.query("update articulos set ? where id = ?", [obj_modif, obj.id], function (err, rows) {
            if (err) {
                console.log(err);
                throw ("Error en consulta de base de datos.");
            }
            response.send("art modificado en la bd.");
        });
    });
});
app.listen(app.get('puerto'), function () {
    console.log('Servidor corriendo sobre puerto:', app.get('puerto'));
});
//# sourceMappingURL=servidor.js.map