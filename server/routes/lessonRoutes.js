const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const lessonController = require('../controllers/lessonController');

router.get('/', auth, lessonController.getAllLessons);
router.get('/:id', auth, lessonController.getLessonById);

module.exports = router;