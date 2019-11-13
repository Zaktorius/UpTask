const passport = require('passport');

const Usuarios = require('../models/Usuarios');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: "Ambos campos son obligatorios"
});

// Validación si el usuario está autenticado
exports.usuarioAutenticado = (req, res, next) => {
    // Si el usuario esta autenticado
    if(req.isAuthenticated()){
        return next();
    } else {
        // Sino está autenticado
        res.redirect('/iniciar-sesion');
    }
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

// Genera un token si un usuario es valido
exports.enviarToken = async (req, res) => {
    // Recolectamos el body con destructuring
    const {email} = req.body;
    // Verificar que el usuario exista
    const usuario = await Usuarios.findOne({ where: {email}});
    if(!usuario) {
        req.flash('error', 'No existe el usuario indicado')
        res.render('reestablecer', {
            nombrePagina: "Reestablecer contraseña",
            mensajes: req.flash()
        })
    }

    // Si no existe se indica que no existe a la vista

}