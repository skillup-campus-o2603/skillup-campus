const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

// GET /api/levels
const getLevels = async (req, res) => {
  try {
    const levels = await sequelize.query(
      `SELECT id, name
       FROM public.levels
       ORDER BY id ASC`,
      {
        type: QueryTypes.SELECT
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Niveles obtenidos correctamente',
      data: levels
    });

  } catch (error) {
    console.error('Error al obtener niveles:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getLevels
};