const sequelize = require('../config/database');
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');

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

// POST /api/admin/teachers
const createTeacher = async (req, res) => {
  const {
    name,
    surname,
    email,
    username,
    password,
    country,
    address,
    telephone
  } = req.body;

  // Validar campos obligatorios
  if (!name || !surname || !email || !username || !password || !country) {
    return res.status(400).json({
      success: false,
      message: 'Los campos name, surname, email, username, password y country son obligatorios'
    });
  }

  // Normalizar datos de texto
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  if (!normalizedEmail || !normalizedUsername) {
    return res.status(400).json({
      success: false,
      message: 'El email y el username no pueden estar vacíos'
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Buscar el rol Teacher
    const teacherRole = await Role.findOne({
      where: { name: 'Teacher' },
      transaction
    });

    if (!teacherRole) {
      await transaction.rollback();

      return res.status(500).json({
        success: false,
        message: 'No se encontró el rol Teacher en la base de datos'
      });
    }

    // Verificar si el email o username ya existen
    const existingUser = await User.findOne({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { email: normalizedEmail },
          { username: normalizedUsername }
        ]
      },
      transaction
    });

    if (existingUser) {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: 'El email o el username ya están registrados'
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      name: name.trim(),
      surname: surname.trim(),
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
      country: country.trim(),
      address: address?.trim() || null,
      telephone: telephone?.trim() || null,
      role_id: teacherRole.id
    }, { transaction });

    // Crear perfil de profesor
    const teacher = await Teacher.create({
      user_id: user.id
    }, { transaction });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: 'Profesor creado correctamente',
      data: {
        teacher_id: teacher.id,
        user_id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        username: user.username,
        country: user.country,
        address: user.address,
        telephone: user.telephone,
        role: teacherRole.name
      }
    });

  } catch (error) {
    await transaction.rollback();

    console.error('Error al crear profesor:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'El email o el username ya están registrados'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// PUT /api/admin/teachers/:id
const updateTeacher = async (req, res) => {
  const { id } = req.params;

  const allowedFields = [
    'name',
    'surname',
    'email',
    'username',
    'country',
    'address',
    'telephone'
  ];

  // Validar ID
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return res.status(400).json({
      success: false,
      message: 'El ID del profesor no es válido'
    });
  }

  // Validar que el body sea un objeto con campos permitidos
  const fields = Object.keys(req.body);

  if (
    fields.length === 0 ||
    fields.some(field => !allowedFields.includes(field))
  ) {
    return res.status(400).json({
      success: false,
      message: 'Debe enviar al menos un campo válido para actualizar'
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Buscar profesor
    const teacher = await Teacher.findByPk(id, { transaction });

    if (!teacher) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: 'No se encontró el profesor'
      });
    }

    // Buscar usuario asociado
    const user = await User.findByPk(teacher.user_id, { transaction });

    if (!user) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: 'No se encontró el usuario asociado al profesor'
      });
    }

    // Preparar los datos que se van a modificar
    const updates = {};

    for (const field of fields) {
      const value = req.body[field];

      // Dirección y teléfono pueden quedar vacíos
      if (['address', 'telephone'].includes(field)) {
        if (value !== null && typeof value !== 'string') {
          await transaction.rollback();

          return res.status(400).json({
            success: false,
            message: `El campo ${field} debe ser un texto o null`
          });
        }

        updates[field] = typeof value === 'string'
          ? value.trim() || null
          : null;

        continue;
      }

      // Los demás campos son obligatorios si se envían
      if (typeof value !== 'string' || !value.trim()) {
        await transaction.rollback();

        return res.status(400).json({
          success: false,
          message: `El campo ${field} no puede estar vacío`
        });
      }

      updates[field] = value.trim();
    }

    // Normalizar email
    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    // Validar email
    if (
      updates.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)
    ) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'El email no tiene un formato válido'
      });
    }

    // Verificar que email y username no estén utilizados por otro usuario
    const conditions = [];

    if (updates.email) {
      conditions.push({ email: updates.email });
    }

    if (updates.username) {
      conditions.push({ username: updates.username });
    }

    if (conditions.length > 0) {
      const existingUser = await User.findOne({
        where: {
          [sequelize.Sequelize.Op.or]: conditions,
          id: {
            [sequelize.Sequelize.Op.ne]: user.id
          }
        },
        transaction
      });

      if (existingUser) {
        await transaction.rollback();

        return res.status(409).json({
          success: false,
          message: 'El email o el username ya están registrados'
        });
      }
    }

    // Actualizar usuario
    await user.update(updates, { transaction });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: 'Profesor actualizado correctamente',
      data: {
        teacher_id: teacher.id,
        user_id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        username: user.username,
        country: user.country,
        address: user.address,
        telephone: user.telephone,
        role: 'Teacher'
      }
    });

  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    console.error('Error al actualizar profesor:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'El email o el username ya están registrados'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// DELETE /api/admin/teachers/:id
const deleteTeacher = async (req, res) => {
  const { id } = req.params;
  let transaction;

  // Validar ID
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return res.status(400).json({
      success: false,
      message: 'El ID del profesor no es válido'
    });
  }

  try {
    transaction = await sequelize.transaction();

    // Buscar profesor
    const teacher = await Teacher.findByPk(id, { transaction });

    if (!teacher) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: 'No se encontró el profesor'
      });
    }

    // Comprobar si está asignado a cursos
    const assignments = await sequelize.query(`
      SELECT COUNT(*)::int AS total
      FROM course_teachers
      WHERE teacher_id = :teacherId
    `, {
      replacements: { teacherId: teacher.id },
      type: sequelize.QueryTypes.SELECT,
      transaction
    });

    const totalAssignments = assignments[0].total;

    if (totalAssignments > 0) {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: 'No se puede eliminar el profesor porque está asignado a uno o más cursos',
        data: {
          teacher_id: teacher.id,
          assigned_courses: totalAssignments
        }
      });
    }

    // Buscar usuario asociado
    const user = await User.findByPk(teacher.user_id, { transaction });

    if (!user) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: 'No se encontró el usuario asociado al profesor'
      });
    }

    // Eliminar tokens de recuperación asociados al usuario
    await sequelize.query(`
      DELETE FROM password_reset_tokens
      WHERE user_id = :userId
    `, {
      replacements: { userId: user.id },
      transaction
    });

    // Eliminar perfil del profesor
    await teacher.destroy({ transaction });

    // Eliminar usuario asociado
    await user.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: 'Profesor y usuario asociado eliminados correctamente',
      data: {
        teacher_id: teacher.id,
        user_id: user.id
      }
    });

  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    console.error('Error al eliminar profesor:', error);

    // Otra relación de la base de datos impide eliminar el usuario
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'No se puede eliminar el profesor porque tiene otros registros relacionados'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getUsers,
  getStudents,
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher
};