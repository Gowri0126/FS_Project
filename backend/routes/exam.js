const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Exam = require('../models/Exam');

const JWT_SECRET = 'your_jwt_secret_here'; // same secret

// Middleware to check auth and get user
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

// Get all exams (anyone logged in)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const exams = await Exam.find().select('title');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create exam (admin only)
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const { title, questions } = req.body;
  try {
    const exam = new Exam({ title, questions, createdBy: req.user.userId });
    await exam.save();
    res.json({ message: 'Exam created successfully', exam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get exam details by id (to take exam)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Remove correctAnswer field when sending to students
    const questions = exam.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.json({ _id: exam._id, title: exam.title, questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
