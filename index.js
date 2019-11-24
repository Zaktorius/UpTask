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
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// Cargamos las variables de entorno
require('dotenv').config({path:'variables.env'});

// Cargamos los helpers
const helpers = require('./helpers');

// Para que podamos hacer sync es importante requerir las libreria de modelos antes de llamar al método
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

// Autenticamos la conexion // Sincronizamos el modelo
// Sync lo que hace es crear la base de datos en caso de que no exista
db.sync()
    .then(() => console.log('Conectado al servidor de la base de datos'))
    .catch(error => console.log(error));
// Configuramos el motor de vistas
app.set("view engine", "pug");
// Disponemos las carpetas de las vistas
app.set("views", path.join(__dirname, "./views"));

// Habilitamos el body parser para leer las datos de formulario
app.use(express.urlencoded({extended: true}));

// Disponemos los archivos estáticos
app.use(express.static('public'));

// Agregar flash mensajes
app.use(flash());

// Las sesiones nos permiten navegar entre paginas sin volver a autenticar
app.use(session({
    secret: 'clave secreta',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// Realizamos un middleware para dejar un metodo
app.use((req, res, next) => {
    const fechaHoy = new Date();
    // Guardamos una variable de año
    res.locals.year = fechaHoy.getFullYear();
    // Guardamos la funcion para que este disponible para todo la web
    res.locals.vardump = helpers.vardump;
    // Utilizamos flash para acumular los mensajes
    res.locals.mensajes = req.flash();
    // Usamos Spread Operator y guardamos el usuario si existe
    res.locals.usuario = {...req.user} || null;
    // Continuamos con un Middleware
    next();
});

// Función middleware de express
app.use('/', routes());

// Levantamos las configuraciones de servidor y puerto
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;

app.listen(PORT, HOST, () => {
    console.log(`El servidor ${HOST} esta operando sobre el puerto ${PORT}. Ante cualquier duda avisarnos al mail de soporte.`);
})


