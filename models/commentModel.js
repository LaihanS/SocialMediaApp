const Sequelize = require("sequelize");

const sequelize = require("../utils/database.js");

const User = sequelize.define("comentarios", {
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
 
  text:{
    type: Sequelize.STRING,
    allowNull: false,
  },

  imagePath: {
    type: Sequelize.STRING,
    allowNull: false,
  },

});

module.exports = User;