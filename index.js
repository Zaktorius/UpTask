// Cargamos la liberia express
const express = require('express');
// Levantamos las rutas
const routes = require('./routes');
// Cargamos la libreria path
const path = require('path');
// Instanciamos la variable
const app = express();
// Creamos la conexión a la base de datos
const db = require('./config/db');

// Cargamos los helpers
const helpers = require('./helpers');

// Para que podamos hacer sync es importante requerir las libreria de modelos antes de llamar al método
require('./models/Proyectos');

// Autenticamos la conexion // Sincronizamos el modelo
// Sync lo que hace es crear la base de datos en caso de que no exista
db.sync()
    .then(() => console.log('Conectado al servidor de la base de datos'))
    .catch(error => console.log(error));
// Configuramos el motor de vistas
app.set("view engine", "pug");
// Disponemos las carpetas de las vistas
app.set("views", path.join(__dirname, "./views"));

// Realizamos un middleware para dejar un metodo
app.use((req, res, next) => {
    const fechaHoy = new Date();
    // Guardamos una variable de año
    res.locals.year = fechaHoy.getFullYear();
    // Guardamos la funcion para que este disponible para todo la web
    res.locals.vardump = helpers.vardump;
    // Continuamos con un Middleware
    next();
});

// Habilitamos el body parser para leer las datos de formulario
app.use(express.urlencoded({extended: true}));

// Disponemos los archivos estáticos
app.use(express.static('public'));

// Función middleware de express
app.use('/', routes());
// Levantamos el servidor usando listen sobre el puerto 3000
app.listen(3000);