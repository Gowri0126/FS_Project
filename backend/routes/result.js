const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Result = require('../models/Result');
const Exam = require('../models/Exam');

const JWT_SECRET = 'your_jwt_secret_here';

// Middleware auth same as above
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Submit exam answers and calculate score
router.post('/:examId', authMiddleware, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const { answers } = req.body; // [{ questionId, selectedAnswer }]

    let score = 0;
    exam.questions.forEach(q => {
      const userAnswer = answers.find(a => a.questionId === q._id.toString());
      if (userAnswer && userAnswer.selectedAnswer === q.correctAnswer) score++;
    });

    const result = new Result({
      exam: exam._id,
      user: req.user.userId,
      score,
      answers,
    });

    await result.save();

    res.json({ message: 'Exam submitted', score, total: exam.questions.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
