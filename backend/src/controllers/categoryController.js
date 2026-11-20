const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await sequelize.query(
      `SELECT id, name, description
       FROM public.categories
       ORDER BY name ASC`,
      {
        type: QueryTypes.SELECT
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Categorías obtenidas correctamente',
      data: categories
    });

  } catch (error) {
    console.error('Error al obtener categorías:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getCategories
};