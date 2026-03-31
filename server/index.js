const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
// const connectDB = require('./services/mongoDB');

app.use(cors());
app.use(express.json());

// Initialize MongoDB
// connectDB();

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Fintech Point API is running' });
});

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
