const Sequelize = require("sequelize");

const sequelize = require("../utils/database.js");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  lastname: Sequelize.STRING,
  phone: Sequelize.INTEGER,
  imagePath: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    indexes: [{unique: true}],
  },
  user: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.STRING,
    defaultValue: "Inactive",
  },
  resetToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  resetTokenExpiration: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  activateToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = User;