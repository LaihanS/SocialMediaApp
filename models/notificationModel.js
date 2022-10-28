const Sequelize = require("sequelize");
const { noTificaciones } = require("../controllers/postController.js");

const sequelize = require("../utils/database.js");

const notificaciones = sequelize.define("notificaciones", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  createdAt: {
    type: Sequelize.DATE,
    default: Date.now,
  },
 
  isReceived:{
    type: Sequelize.BOOLEAN,
    allowNull: false,
    default: false,
  },

  
});

module.exports = notificaciones;