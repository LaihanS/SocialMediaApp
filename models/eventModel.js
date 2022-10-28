const Sequelize = require("sequelize");

const sequelize = require("../utils/database.js");

const eventos = sequelize.define("eventos", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  isConfirmed:{
    type: Sequelize.BOOLEAN,
    allowNull: true,
    default: false,
  },

  eventDate: {
    type: Sequelize.DATE,
  },

  name:{
    type: Sequelize.STRING,
    allowNull: false,
  },

  place:{
    type: Sequelize.STRING,
    allowNull: false,
  },

  answer:{
    type: Sequelize.STRING,
    allowNull: true,
  },


});

module.exports = eventos;