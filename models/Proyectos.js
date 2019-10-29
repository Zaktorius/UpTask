// Cargamos sequelize
const Sequelize = require('sequelize');
// Cargamos la configuración de la base de datos
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');

// Definimos el modelo
const Proyectos = db.define('proyectos',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING,
    url: Sequelize.STRING
},{
    hooks: {
        beforeCreate(proyecto) {
            // Convertimos a formato URL
            const url = slug(proyecto.nombre).toLowerCase();
            // Para evitar URL duplicados, vamos a agregar un ID unico

            // Guardamos el objeto a URL
            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

// Exportamos el modelo
module.exports = Proyectos;