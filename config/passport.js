const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al modelo que vamos a autenticar
const Usuarios = require('../models/Usuarios');

// Cargamos local strategy
passport.use(
    new LocalStrategy(
        // Por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({where:{email}})
                // El usuario existe pero puede ser incorrecto el password
                if(!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Password incorrecto'
                    });
                }
                // Esto quiere decir que el logueo esta correcto
                return done(null, usuario);
            } catch (error) {
                // Ese usuario no existe
                return done(null, false, {message: 'Esa cuenta no existe'});
            }
        }
    )
);

// Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
})

module.exports = passport;