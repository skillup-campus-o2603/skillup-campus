const { QueryTypes, UniqueConstraintError } = require('sequelize');
const sequelize = require('../config/database');

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
    const courses = await sequelize.query(
      `SELECT id, title
       FROM public.courses
       WHERE id = :courseId`,
      {
        replacements: { courseId: course_id },
        type: QueryTypes.SELECT
      }
    );

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar si ya existe la inscripción
    const existingEnrollments = await sequelize.query(
      `SELECT id
       FROM public.enrollments
       WHERE user_id = :userId
         AND course_id = :courseId`,
      {
        replacements: {
          userId,
          courseId: course_id
        },
        type: QueryTypes.SELECT
      }
    );

    if (existingEnrollments.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya estás inscrito en este curso'
      });
    }

    // Registrar la inscripción
    const [enrollment] = await sequelize.query(
      `INSERT INTO public.enrollments (user_id, course_id)
       VALUES (:userId, :courseId)
       RETURNING id, user_id, course_id, created_at`,
      {
        replacements: {
          userId,
          courseId: course_id
        },
        type: QueryTypes.INSERT
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Inscripción realizada correctamente',
      data: {
        id: enrollment[0].id,
        userId: enrollment[0].user_id,
        courseId: enrollment[0].course_id,
        createdAt: enrollment[0].created_at
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

    const enrollments = await sequelize.query(
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