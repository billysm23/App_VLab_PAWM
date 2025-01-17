const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.get('/', auth, quizController.getAllQuizzes);
router.get('/:lessonId', auth, quizController.getQuizByLessonId);
router.post('/:lessonId/submit', auth, quizController.submitQuizResult);

module.exports = router;