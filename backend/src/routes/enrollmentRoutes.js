const express = require('express');

const {
  createEnrollment,
  getMyEnrollments
} = require('../controllers/enrollmentController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Todas las rutas requieren autenticación y rol Student
router.use(authMiddleware);
router.use(roleMiddleware('Student'));

// Inscribir al estudiante en un curso
router.post('/', createEnrollment);

// Consultar las inscripciones del estudiante autenticado
router.get('/me', getMyEnrollments);

module.exports = router;