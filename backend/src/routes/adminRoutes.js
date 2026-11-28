const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const {
  getUsers,
  getStudents,
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/adminController');

router.use(authMiddleware);
router.use(roleMiddleware('Administrator'));

router.get('/users', getUsers);
router.get('/students', getStudents);
router.get('/teachers', getTeachers);
router.post('/teachers', createTeacher);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

module.exports = router;