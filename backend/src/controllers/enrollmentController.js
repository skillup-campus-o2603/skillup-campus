const { UniqueConstraintError } = require('sequelize');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// POST /api/enrollments
const createEnrollment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { course_id } = req.body || {};

    // Validar el identificador del curso
    if (!Number.isSafeInteger(course_id) || course_id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID de curso inválido'
      });
    }

    // Verificar que el curso exista
    const course = await Course.findByPk(course_id, {
      attributes: ['id', 'title']
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar si ya existe la inscripción
    const existingEnrollment = await Enrollment.findOne({
      where: {
        user_id: userId,
        course_id
      },
      attributes: ['id']
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: 'Ya estás inscrito en este curso'
      });
    }

    // Registrar la inscripción
    const enrollment = await Enrollment.create({
      user_id: userId,
      course_id
    });

    return res.status(201).json({
      success: true,
      message: 'Inscripción realizada correctamente',
      data: {
        id: enrollment.id,
        userId: enrollment.user_id,
        courseId: enrollment.course_id,
        createdAt: enrollment.created_at
      }
    });

  } catch (error) {
    // También proteger contra inscripciones simultáneas
    if (
      error instanceof UniqueConstraintError ||
      error.parent?.code === '23505'
    ) {
      return res.status(409).json({
        success: false,
        message: 'Ya estás inscrito en este curso'
      });
    }

    if (error.parent?.code === '23503') {
      return res.status(409).json({
        success: false,
        message: 'No se pudo completar la inscripción porque el usuario o curso no existe'
      });
    }

    console.error('Error al crear inscripción:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/enrollments/me
const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.getByUserId(userId);

    const formattedEnrollments = enrollments.map((enrollment) => ({
      id: enrollment.id,
      enrolledAt: enrollment.created_at,
      course: {
        id: enrollment.course_id,
        title: enrollment.title,
        description: enrollment.description,
        category: {
          id: enrollment.category_id,
          name: enrollment.category_name
        },
        level: {
          id: enrollment.level_id,
          name: enrollment.level_name
        },
        durationMinutes: enrollment.duration_minutes,
        imageUrl: enrollment.image_url,
        price: Number(enrollment.price)
      }
    }));

    return res.status(200).json({
      success: true,
      message: 'Inscripciones obtenidas correctamente',
      data: formattedEnrollments
    });

  } catch (error) {
    console.error('Error al obtener inscripciones:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createEnrollment,
  getMyEnrollments
};