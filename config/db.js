const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const db = new Sequelize('uptasknode', 'root', 'Fm130414', {
  host: '127.0.0.1',
  dialect: 'mariadb',
  port: 3306,
  define: {
    timestamps: false
  },
  
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = db;