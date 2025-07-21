const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedAnswer: String,
  }],
});

module.exports = mongoose.model('Result', ResultSchema);
