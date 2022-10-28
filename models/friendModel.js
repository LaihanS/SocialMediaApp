const Sequelize = require("sequelize");
const { noTificaciones } = require("../controllers/postController.js");

const sequelize = require("../utils/database.js");

const notificaciones = sequelize.define("amigos", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  isConfirmed:{
    type: Sequelize.BOOLEAN,
    allowNull: false,
    default: false,
  },

  
});

module.exports = notificaciones;