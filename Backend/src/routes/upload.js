const express = require('express');
const multer = require('multer');
const path = require('path');
const { validateMapping } = require('../middleware/validation');
const { uploadController, processController, previewController } = require('../controllers/uploadController');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_DIR || './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() === '.csv') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    }
});

// Routes
router.post('/file', upload.single('file'), uploadController);
router.post('/process', validateMapping, processController);
router.get('/preview/:filename', previewController);

module.exports = router; 