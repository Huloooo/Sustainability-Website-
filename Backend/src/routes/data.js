const express = require('express');
const { getDataController, getDataByIdController } = require('../controllers/dataController');

const router = express.Router();

// Routes
router.get('/', getDataController);
router.get('/:id', getDataByIdController);

module.exports = router; 