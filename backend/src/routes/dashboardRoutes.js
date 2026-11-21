const express = require('express');

const {
  getStudentDashboard
} = require('../controllers/dashboardController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Todas las rutas requieren autenticación y rol Student
router.use(authMiddleware);
router.use(roleMiddleware('Student'));

// Consultar el dashboard del estudiante autenticado
router.get('/', getStudentDashboard);

module.exports = router;