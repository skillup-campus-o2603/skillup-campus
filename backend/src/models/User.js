const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./Role');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  surname: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  telephone: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  role_id: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role'
});

Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'users'
});

module.exports = User;