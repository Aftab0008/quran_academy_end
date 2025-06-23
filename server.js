const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const commentRoutes = require('./routes/comments');
const classRoutes = require('./routes/classes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/comments', commentRoutes);
app.use('/api/classes', classRoutes);

app.get('/', (req, res) => {
  res.send('Quran Academy API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
