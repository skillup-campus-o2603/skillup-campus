require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

const PORT = process.env.PORT || 3001;

const courseRoutes = require('./routes/course.routes');
const authRoutes = require('./routes/auth.routes');

app.use(cors());
app.use(express.json());

// Rutas de cursos
app.use('/api/courses', courseRoutes);
// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Ruta inicial
app.get('/', (req, res) => {
  res.json({
    message: 'API de SkillUp Campus funcionando correctamente'
  });
});

// Verificar el estado del servidor
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
});

// Verificar conexión con PostgreSQL
async function iniciarServidor() {
  try {
    await sequelize.authenticate();

    console.log('Conexión a PostgreSQL establecida correctamente');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error.message);
    process.exit(1);
  }
}

iniciarServidor();