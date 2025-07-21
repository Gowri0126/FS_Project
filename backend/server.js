const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exam');
const resultRoutes = require('./routes/result');

// Connect to MongoDB
require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);

app.get('/', (req, res) => {
  res.send('Online Exam Backend Running');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
