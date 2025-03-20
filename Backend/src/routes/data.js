const express = require('express');
const { getDataController, getDataByIdController } = require('../controllers/dataController');
const { validatePagination } = require('../middleware/validation');

const router = express.Router();

// Routes
router.get('/', validatePagination, getDataController);
router.get('/:id', getDataByIdController);

module.exports = router; 