// Cargamos el modelo
const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta', {
        nombrePagina: "Crear cuenta"
    });
}

exports.formIniciarSesion = (req,res) => {
    res.render('iniciarSesion', {
        nombrePagina: "Iniciar Sesion en UpTask"
    });
}

exports.crearCuenta = async (req, res) => {
    // Levantamos las variables
    const {email, password} = req.body;
    try{     
        // Creamos el usuario
        await Usuarios.create({email, password})
        res.redirect('/iniciar-sesion');
    } catch(error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta',
            email,
            password
        })
    }
    
}