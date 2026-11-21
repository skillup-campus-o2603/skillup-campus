const Dashboard = require('../models/Dashboard');

// GET /api/dashboard
const getStudentDashboard = async (req, res) => {
  try {
    // El ID viene del JWT validado por authMiddleware
    const userId = req.user.id;

    const enrollments = await Dashboard.getStudentCourses(userId);

    // Preparar los datos de cada curso
    const courses = enrollments.map((enrollment) => {
      const totalLessons = enrollment.total_lessons;
      const completedLessons = enrollment.completed_lessons;

      // Si el curso todavía no tiene lecciones, el progreso no está disponible
      const progress = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : null;

      return {
        enrollmentId: enrollment.enrollment_id,
        courseId: enrollment.course_id,
        title: enrollment.title,
        description: enrollment.description,
        imageUrl: enrollment.image_url,
        durationMinutes: enrollment.duration_minutes,
        price: Number(enrollment.price),
        enrolledAt: enrollment.enrolled_at,
        category: {
          id: enrollment.category_id,
          name: enrollment.category_name
        },
        level: {
          id: enrollment.level_id,
          name: enrollment.level_name
        },
        totalLessons,
        completedLessons,
        progress
      };
    });

    // Calcular estadísticas generales
    const totalCourses = courses.length;

    const coursesWithLessons = courses.filter(
      (course) => course.totalLessons > 0
    );

    const completedCourses = coursesWithLessons.filter(
      (course) => course.progress === 100
    ).length;

    const inProgressCourses = coursesWithLessons.filter(
      (course) => course.progress < 100
    ).length;

    const totalLessons = courses.reduce(
      (total, course) => total + course.totalLessons,
      0
    );

    const completedLessons = courses.reduce(
      (total, course) => total + course.completedLessons,
      0
    );

    // El progreso general se calcula sobre todas las lecciones
    // de los cursos que tienen contenido.
    const overallProgress = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : null;

    return res.status(200).json({
      success: true,
      message: 'Dashboard del estudiante obtenido correctamente',
      data: {
        summary: {
          totalCourses,
          inProgressCourses,
          completedCourses,
          overallProgress
        },
        courses
      }
    });

  } catch (error) {
    console.error('Error al obtener el dashboard del estudiante:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getStudentDashboard
};