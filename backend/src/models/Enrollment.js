const { DataTypes, QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  }
}, {
  tableName: 'enrollments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Obtener las inscripciones de un estudiante con los datos de sus cursos
Enrollment.getByUserId = async (userId) => {
  return await sequelize.query(
    `SELECT
        e.id,
        e.created_at,
        c.id AS course_id,
        c.title,
        c.description,
        c.duration_minutes,
        c.image_url,
        c.price,
        cat.id AS category_id,
        cat.name AS category_name,
        l.id AS level_id,
        l.name AS level_name
     FROM public.enrollments e
     INNER JOIN public.courses c ON e.course_id = c.id
     INNER JOIN public.categories cat ON c.category_id = cat.id
     INNER JOIN public.levels l ON c.level_id = l.id
     WHERE e.user_id = :userId
     ORDER BY e.created_at DESC, e.id DESC`,
    {
      replacements: { userId },
      type: QueryTypes.SELECT
    }
  );
};

module.exports = Enrollment;