const sequelize = require('../config/database');
const User = require('../models/User');
const Role = require('../models/Role');

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/admin/students
const getStudents = async (req, res) => {
  try {
    const students = await sequelize.query(`
      SELECT
        s.id AS student_id,
        s.user_id,
        s.average_grade,
        s.created_at AS student_created_at,
        u.name,
        u.surname,
        u.email,
        u.username,
        u.country,
        u.address,
        u.telephone
      FROM students s
      INNER JOIN users u ON u.id = s.user_id
      ORDER BY s.created_at DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Error al obtener alumnos:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/admin/teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await sequelize.query(`
      SELECT
        t.id AS teacher_id,
        t.user_id,
        t.created_at AS teacher_created_at,
        u.name,
        u.surname,
        u.email,
        u.username,
        u.country,
        u.address,
        u.telephone
      FROM teachers t
      INNER JOIN users u ON u.id = t.user_id
      ORDER BY t.created_at DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({
      success: true,
      data: teachers
    });

  } catch (error) {
    console.error('Error al obtener profesores:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getUsers,
  getStudents,
  getTeachers
};