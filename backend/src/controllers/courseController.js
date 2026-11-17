const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
const Course = require('../models/Course');

// Convertir los datos de PostgreSQL al formato de la API
const formatCourse = (course) => ({
  id: course.id,
  title: course.title,
  description: course.description,
  category: {
    id: course.category_id,
    name: course.category_name
  },
  level: course.level_name,
  durationMinutes: course.duration_minutes,
  imageUrl: course.image_url,
  price: Number(course.price)
});

// GET /api/courses
const getCourses = async (req, res) => {
  try {
    const courses = await sequelize.query(
      `SELECT
        c.*,
        cat.name AS category_name,
        l.name AS level_name
       FROM courses c
       INNER JOIN categories cat ON c.category_id = cat.id
       INNER JOIN levels l ON c.level_id = l.id
       ORDER BY c.id ASC`,
      { type: QueryTypes.SELECT }
    );

    return res.status(200).json({
      success: true,
      message: 'Cursos obtenidos correctamente',
      data: courses.map(formatCourse)
    });

  } catch (error) {
    console.error('Error al obtener cursos:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID de curso inválido'
      });
    }

    const courses = await sequelize.query(
      `SELECT
        c.*,
        cat.name AS category_name,
        l.name AS level_name
       FROM courses c
       INNER JOIN categories cat ON c.category_id = cat.id
       INNER JOIN levels l ON c.level_id = l.id
       WHERE c.id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );

    const course = courses[0];

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Curso obtenido correctamente',
      data: formatCourse(course)
    });

  } catch (error) {
    console.error('Error al obtener curso:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

 // POST /api/courses
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category_id,
      duration_minutes,
      image_url,
      price,
      level_id
    } = req.body || {};

    // Validar campos obligatorios
    if (
      typeof title !== 'string' ||
      !title.trim() ||
      title.trim().length > 150 ||
      typeof description !== 'string' ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Título o descripción inválidos'
      });
    }

    // Validar identificadores
    if (
      !Number.isSafeInteger(category_id) ||
      category_id <= 0 ||
      !Number.isSafeInteger(level_id) ||
      level_id <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Categoría o nivel inválidos'
      });
    }

    // Validar duración
    if (
      !Number.isSafeInteger(duration_minutes) ||
      duration_minutes <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'La duración debe ser mayor que cero'
      });
    }

    // Validar precio
    const coursePrice = price === undefined ? 0 : price;

    if (
      typeof coursePrice !== 'number' ||
      !Number.isFinite(coursePrice) ||
      coursePrice < 0 ||
      coursePrice > 99999999.99 ||
      Math.round(coursePrice * 100) !== coursePrice * 100
    ) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un número válido con hasta dos decimales'
      });
    }

    // Validar URL de imagen opcional
    if (
      image_url !== undefined &&
      image_url !== null &&
      (typeof image_url !== 'string' ||
        (image_url.trim() &&
          !/^https?:\/\/\S+$/i.test(image_url.trim())))
    ) {
      return res.status(400).json({
        success: false,
        message: 'La URL de imagen no es válida'
      });
    }

    // Verificar categoría y nivel existentes
    const [categories, levels] = await Promise.all([
      sequelize.query(
        'SELECT id FROM categories WHERE id = :id',
        {
          replacements: { id: category_id },
          type: QueryTypes.SELECT
        }
      ),
      sequelize.query(
        'SELECT id FROM levels WHERE id = :id',
        {
          replacements: { id: level_id },
          type: QueryTypes.SELECT
        }
      )
    ]);

    if (!categories.length || !levels.length) {
      return res.status(400).json({
        success: false,
        message: 'La categoría o el nivel no existen'
      });
    }

    // Crear el curso en PostgreSQL
    const newCourse = await Course.create({
      title: title.trim(),
      description: description.trim(),
      category_id,
      duration_minutes,
      image_url: image_url?.trim() || null,
      price: coursePrice,
      level_id
    });

    // Recuperar el curso con su categoría y nivel
    const [course] = await sequelize.query(
      `SELECT
        c.*,
        cat.name AS category_name,
        l.name AS level_name
       FROM courses c
       INNER JOIN categories cat ON c.category_id = cat.id
       INNER JOIN levels l ON c.level_id = l.id
       WHERE c.id = :id`,
      {
        replacements: { id: newCourse.id },
        type: QueryTypes.SELECT
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Curso creado correctamente',
      data: formatCourse(course)
    });

  } catch (error) {
    console.error('Error al crear curso:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};


// PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validar ID
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID de curso inválido'
      });
    }

    // Buscar el curso existente
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    const allowedFields = [
      'title',
      'description',
      'category_id',
      'duration_minutes',
      'image_url',
      'price',
      'level_id'
    ];

    const body = req.body || {};

    if (
      typeof body !== 'object' ||
      Array.isArray(body) ||
      Object.keys(body).length === 0 ||
      Object.keys(body).some(
        (field) => !allowedFields.includes(field)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'No se enviaron campos válidos para actualizar'
      });
    }

    const updates = {};

    // Validar título
    if (body.title !== undefined) {
      if (
        typeof body.title !== 'string' ||
        !body.title.trim() ||
        body.title.trim().length > 150
      ) {
        return res.status(400).json({
          success: false,
          message: 'Título inválido'
        });
      }

      updates.title = body.title.trim();
    }

    // Validar descripción
    if (body.description !== undefined) {
      if (
        typeof body.description !== 'string' ||
        !body.description.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: 'Descripción inválida'
        });
      }

      updates.description = body.description.trim();
    }

    // Validar duración
    if (body.duration_minutes !== undefined) {
      if (
        !Number.isSafeInteger(body.duration_minutes) ||
        body.duration_minutes <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'La duración debe ser mayor que cero'
        });
      }

      updates.duration_minutes = body.duration_minutes;
    }

    // Validar precio
    if (body.price !== undefined) {
      const price = body.price;

      if (
        typeof price !== 'number' ||
        !Number.isFinite(price) ||
        price < 0 ||
        price > 99999999.99 ||
        Math.abs(price * 100 - Math.round(price * 100)) > 1e-6
      ) {
        return res.status(400).json({
          success: false,
          message: 'Precio inválido'
        });
      }

      updates.price = price;
    }

    // Validar URL opcional
    if (body.image_url !== undefined) {
      if (
        body.image_url !== null &&
        (
          typeof body.image_url !== 'string' ||
          (
            body.image_url.trim() &&
            !/^https?:\/\/\S+$/i.test(body.image_url.trim())
          )
        )
      ) {
        return res.status(400).json({
          success: false,
          message: 'URL de imagen inválida'
        });
      }

      updates.image_url = body.image_url?.trim() || null;
    }

    // Validar categoría y nivel
    for (const [field, table] of [
      ['category_id', 'categories'],
      ['level_id', 'levels']
    ]) {
      if (body[field] !== undefined) {
        if (
          !Number.isSafeInteger(body[field]) ||
          body[field] <= 0
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} inválido`
          });
        }

        const records = await sequelize.query(
          `SELECT id FROM ${table} WHERE id = :id`,
          {
            replacements: { id: body[field] },
            type: QueryTypes.SELECT
          }
        );

        if (!records.length) {
          return res.status(400).json({
            success: false,
            message: `El valor de ${field} no existe`
          });
        }

        updates[field] = body[field];
      }
    }

    // Registrar fecha de modificación
    updates.updated_at = new Date();

    // Guardar los cambios
    await course.update(updates);

    // Recuperar el curso con categoría y nivel
    const [updatedCourse] = await sequelize.query(
      `SELECT
        c.*,
        cat.name AS category_name,
        l.name AS level_name
       FROM courses c
       INNER JOIN categories cat ON c.category_id = cat.id
       INNER JOIN levels l ON c.level_id = l.id
       WHERE c.id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Curso actualizado correctamente',
      data: formatCourse(updatedCourse)
    });

  } catch (error) {
    console.error('Error al actualizar curso:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validar ID
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID de curso inválido'
      });
    }

    // Buscar curso
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Comprobar si existen registros relacionados
    const relatedTables = [
      'enrollments',
      'modules',
      'course_teachers',
      'course_reviews'
    ];

    for (const table of relatedTables) {
      const records = await sequelize.query(
        `SELECT 1 FROM ${table}
         WHERE course_id = :id
         LIMIT 1`,
        {
          replacements: { id },
          type: QueryTypes.SELECT
        }
      );

      if (records.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'No se puede eliminar el curso porque tiene registros asociados'
        });
      }
    }

    // Eliminar curso
    await course.destroy();

    return res.status(200).json({
      success: true,
      message: 'Curso eliminado correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar curso:', error);

    // Una relación creada durante la operación puede
    // impedir el borrado por una restricción de PostgreSQL
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'No se puede eliminar el curso porque tiene registros asociados'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};