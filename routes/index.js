// Cargamos la libreria de express
const express = require('express');
// Levantamos el objeto router
const router = express.Router();
// Cargamos el validador de express // Sanitizador de urls, sirve para validar y corregir elementos en campos recibidos
const { body } = require('express-validator');

// Importamos el controlador
const proyectosController = require('../controllers/proyectosController');

// Exportamos la función
module.exports = function(){
    // Disponemos de una ruta para el main
    router.get('/', proyectosController.proyectosHome);

    // Definimos la ruta para nuevo proyecto
    router.get('/nuevo-proyecto', proyectosController.formularioProyecto);

    // Preparamos una ruta para post del proyecto
    router.post('/nuevo-proyecto', 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto);
        // Preparamos una ruta para post del proyecto
    router.post('/nuevo-proyecto/:id', 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto);
    // Listar proyecto - Anotacion, lo que pongamos en el control de rutas, en este ejemplo :url, se puede acceder
    // por medio de req.params.url. Si este ultimo dato fuera otra cosa, como por ejemplo :id, se accederia por medio
    // de req.params.id
    router.get('/proyectos/:url',proyectosController.proyectoPorUrl);

    // Actualizar proyecto
    router.get('/proyecto/editar/:id', proyectosController.formularioEditar);
    // Devolvemos el router como resultado de la funcion
    return router;
}