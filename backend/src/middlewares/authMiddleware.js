const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Obtener el encabezado Authorization
  const authorization = req.headers.authorization;

  // 2. Comprobar formato Bearer TOKEN
  if (
    !authorization ||
    !/^Bearer\s+\S+$/i.test(authorization)
  ) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación requerido'
    });
  }

  // 3. Extraer el token
  const token = authorization.split(/\s+/)[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no configurado');
    }

    // 4. Verificar firma y expiración
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    // 5. Validar información del usuario
    if (
      !decoded.id ||
      typeof decoded.role !== 'string'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // 6. Guardar los datos para la siguiente función
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();

  } catch (error) {
    if (error.message === 'JWT_SECRET no configurado') {
      console.error(error.message);

      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

module.exports = authMiddleware;