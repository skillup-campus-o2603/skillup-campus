const express = require('express');
const { getCategories } = require('../controllers/categoryController');

const router = express.Router();

// Ruta pública
router.get('/', getCategories);

module.exports = router;