const express = require('express');

const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Rutas públicas
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Crear curso - solo administradores
router.post(
  '/',
  authMiddleware,
  roleMiddleware('Administrator'),
  createCourse
);

// Actualizar curso - solo administradores
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('Administrator'),
  updateCourse
);

// Eliminar curso - solo administradores
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('Administrator'),
  deleteCourse
);

module.exports = router;