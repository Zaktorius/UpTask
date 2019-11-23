// Cargamos el modelo
const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta', {
        nombrePagina: "Crear cuenta"
    });
}

exports.formIniciarSesion = (req,res) => {
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: "Iniciar Sesion en UpTask",
        error
    });
}

exports.crearCuenta = async (req, res) => {
    // Levantamos las variables
    const {email, password} = req.body;
    try{     
        // Creamos el usuario
        await Usuarios.create({email, password});
        // creamos una url de confirmar
        // Url de reset
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        // creamos el objeto del usuario
        const usuario = {
            email
        }
        // Esperamos el envio del email 
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmación de creación de cuenta',
            confirmarUrl,
            archivo : 'confirmarCuenta'
        });

        // Redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
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

exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: "Reestablecer contraseña"
    })
}

// Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    // Separamos el email
    const {email} = req.params;
    // Buscamos el usuario
    const usuario = await Usuarios.findOne({where: {email}});
    // Validamos si existe el usuario
    if(!usuario) {        
        // Redirigimos en caso de error
        req.flash('error', 'Usuario inexistente');
        res.redirect('/iniciar-sesion');
    }
    // Activamos el usuario
    usuario.activo = 1;
    // Guardamos cambio
    await usuario.save();

    // Informamos que la cuenta esta generada
    req.flash('correcto', 'La cuenta fue activada correctamente');
    // Redirigimos al login
    res.redirect('/iniciar-sesion');
}