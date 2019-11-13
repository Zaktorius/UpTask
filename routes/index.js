// Cargamos la libreria de express
const express = require('express');
// Levantamos el objeto router
const router = express.Router();
// Cargamos el validador de express // Sanitizador de urls, sirve para validar y corregir elementos en campos recibidos
const { body } = require('express-validator');

// Importamos el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

// Exportamos la función
module.exports = function(){
    // Disponemos de una ruta para el main
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );

    // Definimos la ruta para nuevo proyecto
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );

    // Preparamos una ruta para post del proyecto
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );
        // Preparamos una ruta para post del proyecto
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto);
    // Listar proyecto - Anotacion, lo que pongamos en el control de rutas, en este ejemplo :url, se puede acceder
    // por medio de req.params.url. Si este ultimo dato fuera otra cosa, como por ejemplo :id, se accederia por medio
    // de req.params.id
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );

    // Actualizar proyecto
    router.get('/proyecto/editar/:id', 
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );
    // Eliminamos proyecto
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado
        ,proyectosController.eliminarProyecto
    );
    // Agregamos un router para tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado
        ,tareasController.agregarTarea
    );
    // Actualizamos tareas
    router.patch('/tareas/:id',
        authController.usuarioAutenticado, 
        tareasController.cambiarEstadoTarea
    );
    // Removemos tareas
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );
    // Para crear cuentas, disponemos el controller
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);

    // Controlamos el acceso al inicio de sesión
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    router.get('/cerrar-sesion', authController.cerrarSesion);
    // Disponemos una ruta para reestablecer contraseña
    router.get('/reestablecer', usuariosController.formReestablecerPassword);
    router.post('/reestablecer', authController.enviarToken)

    // Devolvemos el router como resultado de la funcion
    return router;
}