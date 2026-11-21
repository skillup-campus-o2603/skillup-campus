const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dashboard = {
  async getStudentCourses(userId) {
    return await sequelize.query(
      `SELECT
          e.id AS enrollment_id,
          e.created_at AS enrolled_at,
          c.id AS course_id,
          c.title,
          c.description,
          c.image_url,
          c.duration_minutes,
          c.price,
          cat.id AS category_id,
          cat.name AS category_name,
          lev.id AS level_id,
          lev.name AS level_name,
          COUNT(DISTINCT l.id)::INTEGER AS total_lessons,
          COUNT(
            DISTINCT CASE
              WHEN lp.completed IS TRUE THEN l.id
            END
          )::INTEGER AS completed_lessons
       FROM public.enrollments e
       INNER JOIN public.courses c
          ON c.id = e.course_id
       INNER JOIN public.categories cat
          ON cat.id = c.category_id
       INNER JOIN public.levels lev
          ON lev.id = c.level_id
       LEFT JOIN public.modules m
          ON m.course_id = c.id
       LEFT JOIN public.lessons l
          ON l.module_id = m.id
       LEFT JOIN public.lesson_progress lp
          ON lp.enrollment_id = e.id
          AND lp.lesson_id = l.id
       WHERE e.user_id = :userId
       GROUP BY
          e.id,
          e.created_at,
          c.id,
          c.title,
          c.description,
          c.image_url,
          c.duration_minutes,
          c.price,
          cat.id,
          cat.name,
          lev.id,
          lev.name
       ORDER BY e.created_at DESC, e.id DESC`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT
      }
    );
  }
};

module.exports = Dashboard;