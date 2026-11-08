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

module.exports = {
  login
};