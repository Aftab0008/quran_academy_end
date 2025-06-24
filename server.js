const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const commentRoutes = require('./routes/comments');
const classRoutes = require('./routes/classes');

dotenv.config();
const app = express();

// Optional: more secure CORS setup
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/comments', commentRoutes);
app.use('/api/classes', classRoutes);

app.get('/', (req, res) => {
  res.send('Quran Academy API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
