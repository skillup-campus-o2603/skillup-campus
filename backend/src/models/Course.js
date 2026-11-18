const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true
  },

  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },

  image_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },

  level_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: 'courses',
  timestamps: false
});

module.exports = Course;