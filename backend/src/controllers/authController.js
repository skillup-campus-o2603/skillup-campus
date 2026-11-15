const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/User');
const Role = require('../models/Role');
const Student = require('../models/Student');

// POST /api/auth/login
const login = (req, res) => {
  const { email, password } = req.body || {};

  // Validar campos obligatorios
  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: 'Email y contraseña son obligatorios'
    });
  }

  // Credenciales ficticias para probar el endpoint
  const mockUser = {
    id: 1,
    name: 'Ana',
    surname: 'García',
    email: 'alumno@ejemplo.com',
    role: 'Student'
  };

  const mockPassword = 'ClaveDeEjemplo123';

  // Comprobar credenciales simuladas
  if (
    email !== mockUser.email ||
    password !== mockPassword
  ) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }

  // Respuesta simulada, sin generar un JWT real
  return res.status(200).json({
    success: true,
    message: 'Inicio de sesión exitoso',
    data: {
      user: mockUser,
      token: 'mock-jwt-token-no-valido',
      expiresIn: '24h'
    }
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const {
      name,
      surname,
      username,
      email,
      password,
      country,
      address,
      telephone
    } = req.body || {};

    // 1. Validar campos obligatorios
    const requiredFields = {
      name,
      surname,
      username,
      email,
      password,
      country
    };

    const invalidFields = Object.values(requiredFields).some(
      value => typeof value !== 'string' || !value.trim()
    );

    if (invalidFields) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios deben completarse'
      });
    }

    // 2. Validar campos opcionales
    if (
      (address != null && typeof address !== 'string') ||
      (telephone != null && typeof telephone !== 'string')
    ) {
      return res.status(400).json({
        success: false,
        message: 'Los campos opcionales deben ser texto'
      });
    }

    // 3. Normalizar datos
    const normalizedName = name.trim();
    const normalizedSurname = surname.trim();
    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCountry = country.trim();
    const normalizedAddress = address?.trim() || null;
    const normalizedTelephone = telephone?.trim() || null;

    // 4. Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del correo electrónico no es válido'
      });
    }

    // 5. Validar nombre de usuario
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;

    if (!usernameRegex.test(normalizedUsername)) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos, sin espacios'
      });
    }

    // 6. Validar contraseña
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    // 7. Validar longitudes según PostgreSQL
    const fieldLimits = {
      name: [normalizedName, 100],
      surname: [normalizedSurname, 100],
      username: [normalizedUsername, 100],
      email: [normalizedEmail, 100],
      country: [normalizedCountry, 50],
      address: [normalizedAddress, 100],
      telephone: [normalizedTelephone, 25]
    };

    for (const [field, [value, maxLength]] of Object.entries(fieldLimits)) {
      if (value !== null && value.length > maxLength) {
        return res.status(400).json({
          success: false,
          message: `El campo ${field} no puede superar los ${maxLength} caracteres`
        });
      }
    }

    // 8. Comprobar usuarios duplicados
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: normalizedEmail },
          { username: normalizedUsername }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El correo o nombre de usuario ya está registrado'
      });
    }

    // 9. Obtener el rol Student
    const studentRole = await Role.findOne({
      where: { name: 'Student' }
    });

    if (!studentRole) {
      return res.status(500).json({
        success: false,
        message: 'No se encontró el rol de estudiante'
      });
    }

    // 10. Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 11. Crear usuario y perfil en una sola transacción
    const user = await sequelize.transaction(async (transaction) => {
      const newUser = await User.create({
        name: normalizedName,
        surname: normalizedSurname,
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
        country: normalizedCountry,
        address: normalizedAddress,
        telephone: normalizedTelephone,
        role_id: studentRole.id
      }, { transaction });

      await Student.create({
        user_id: newUser.id,
        average_grade: null
      }, { transaction });

      return newUser;
    });

    // 12. Respuesta exitosa
    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        country: user.country,
        role: 'Student'
      }
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'El correo o nombre de usuario ya está registrado'
      });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Los datos enviados no son válidos'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Exportar controladores
module.exports = {
  login,
  register
};