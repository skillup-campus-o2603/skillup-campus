const express = require('express');
const { getLevels } = require('../controllers/levelController');

const router = express.Router();

// Ruta pública
router.get('/', getLevels);

module.exports = router;