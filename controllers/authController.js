const passport = require('passport');

const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');

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
        req.flash('error', 'No existe el usuario indicado');
        res.redirect('/reestablecer');
    }
    // Generamos token
    usuario.token = crypto.randomBytes(20).toString('hex');
    // Generamos expiración
    usuario.expiracion = Date.now() + 3600000;    
    // Guardamos en la base de datos
    usuario.save();   
    // Url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    console.log(resetUrl);

}

exports.validarToken = async(req, res) => {
    // Obtenemos el token
    const {token} = req.params;
    // Capturamos el token
    const usuario = await Usuarios.findOne({where:{token}});
    // Validamos si encontramos el usuario
    if(!usuario) {
        // Disponemos un mensaje
        req.flash('error', 'El token comunicado no es valido');
        // Redirijimos a reestablecer
        res.redirect('/reestablecer');        
    }
    // Formulario para resetear password
    res.render('resetPassword',{
        nombrePagina: "Reestablecer Contraseña"
    })
}

exports.actualizarPassword = async (req, res) => {
    // Obtenemos el token
    const {token} = req.params;
    // Obtenemos el usuario perteneciente a este token
    const usuario = await Usuarios.findOne({
        where: {
            token: token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });
    // Verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'El token ha expirado o es invalido');
        res.redirect('/reestablecer');
    }
    // Obtenemos la contraseña
    const {password} = req.body;
    // Cambiamos el password
    usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    // Vaciamos expiración y token
    usuario.token = null;
    usuario.expiracion = null;
    // Guardamos el nuevo password
    await usuario.save();
    // Redireccionammos para que inicie sesion
    req.flash('correcto', 'Tu password ha sido blanqueado correctamente');
    res.redirect('/iniciar-sesion');

}