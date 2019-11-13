// Cargamos el modelo
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const slug = require('slug');

// Definimos el inicio del proyecto
exports.proyectosHome = async (req, res) =>{    
    const usuarioId = res.locals.usuario.id;
    // Levantamos todos los proyectos cargados
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    // Enviamos de respuesta el index
    res.render("index", {
        nombrePagina: "Proyectos " + res.locals.year,
        proyectos
    });
}

// Disponemos un método para un nuevo proyecto
exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    // Levantamos todos los proyectos cargados
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    res.render('nuevoProyecto', {
        nombrePagina: "Nuevo Proyecto",
        proyectos
    })
}

// Disponemos una ruta para cargar un nuevo proyecto
exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    // Levantamos todos los proyectos cargados
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    // Enviar a la consola lo que el usuario escriba
    // console.log(req.body);
    // Validar que exista informacion en el input
    const { nombre } = req.body;

    // Validamos errores
    let errores = [];
    
    if(!nombre) {
        // Agregamos error de falta de nombre
        errores.push({"texto": "Agrega un nombre al proyecto"});
    }

    // Validamos si hay errores en el arreglo
    if(errores.length > 0){
        res.render("nuevoProyecto", {
            nombrePagina: "Nuevo Proyecto",
            errores,
            proyectos
        });
    } else {
        // No hay errores
        // Insertar en la DB
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({nombre, usuarioId});
        // Una vez completado redirijimos
        res.redirect('/');
    }
}

// Disponemos una ruta para cargar un nuevo proyecto
exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    // Levantamos todos los proyectos cargados
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    // Enviar a la consola lo que el usuario escriba
    // console.log(req.body);
    // Validar que exista informacion en el input
    const { nombre } = req.body;

    // Validamos errores
    let errores = [];
    
    if(!nombre) {
        // Agregamos error de falta de nombre
        errores.push({"texto": "Agrega un nombre al proyecto"});
    }

    // Validamos si hay errores en el arreglo
    if(errores.length > 0){
        res.render("nuevoProyecto", {
            nombrePagina: "Nuevo Proyecto",
            errores,
            proyectos
        });
    } else {
        // No hay errores
        // Insertar en la DB
        
        await Proyectos.update(
            {nombre: nombre},{ // Campo a actualizar
            where: {id: req.params.id } // Condiciones
        });
        // Una vez completado redirijimos
        res.redirect('/');
    }
}

// Renderización de sitio por URL
exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    // Levantamos todos los proyectos cargados
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
    // Hacemos una consulta a la base de datos
    let proyectoPromise = Proyectos.findOne({
        // Utilizamos where para filtrar resultados
        where:{
            url: req.params.url
        }
    });
    // Aguardamos usando promise all el resultado de ambas promesas, como son promesas que no dependen una de la otra se pueden lanzar en simultaneo bajo esta forma
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise ]);
    // Necesitamos esperar al proyecto para poder conseguir sus tareas
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        // Para traer todo los datos del proyecto en conjunto de las tareas
        // include: [
        //     {model : Proyectos}
        // ]

    });    
    // Validamos si llego el dato necesario
    if(!proyecto) return next();
    // Renderizamos la vista
    res.render('tareas', {
        nombrePagina: "Tareas del proyecto",
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    // Levantamos todos los proyectos cargados
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
    // Levantamos el proyecto solo
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });

    // Como las dos peticiones asincronicas no son dependientes una de otra, pero si necesitamos que ambas terminen para seguir
    // Podemos usar promesas para ejecuten en paralelo y que la ejecución siga cuando finalice
    // Usamos una estructura de arreglos partida para guardar la información
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
    // Usamos la vista de nuevo proyecto
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos, proyecto
    });
}

exports.eliminarProyecto = async(req,res, next) => {
    console.log(req.query);
    // Realizamos destructuring
    const {urlProyecto} = req.query;
    // Usamos el modelo para realizar una eliminación
    const resultado = await Proyectos.destroy({where: {url: urlProyecto}});
    // Validamos si no hay resultado
    if(!resultado) {
        return next();
    }
    // Enviamos al respuesta una vez eliminado el proyecto
    res.status(200).send('Proyecto eliminado correctamente');
}