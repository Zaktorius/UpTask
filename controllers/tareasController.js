const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

const ESTADO_INCOMPLETO = 0;

exports.agregarTarea = async (req, res) => {
    // Buscamos el proyecto existente
    const proyecto = await Proyectos.findOne({where: {url: req.params.url}});
    // Aplicamos destructuring
    const {tarea} = req.body;
    // Establecemos estado como incompleta
    const estado = ESTADO_INCOMPLETO;
    // Recolectamos el ID del proyecto desde la consulta
    const proyectoId = proyecto.id;
    // Insertamos en la base de datos los valores
    const resultado = Tareas.create({ tarea, estado, proyectoId})
    // Validamos que haya resultado
    if(!resultado) return next();
    // Redireccionamos
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async(req, res, next) => {
    // Usamos Destructuring
    const {id} = req.params;
    // Cuando la variable y la propiedad del objeto son iguales no es necesario utilizar el formato {propiedad} : {valor}
    // Con solo disponer del valor ya sería suficiente, como es en este caso
    const tarea = await Tareas.findOne({where:{id}})
    // Cambiamos el estado
    let estado = 0;
    // Modificamos el estado si esta incompleta
    if(tarea.estado === estado){
        estado = 1;
    }
    // Modificamos el estado
    tarea.estado = estado
    // Guardamos el resultado
    const resultado = await tarea.save();
    // Validamos el estado
    if(!resultado) return next();

    res.status(200).send('Proceso OK');
}