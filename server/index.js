const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const statsRoutes = require('./routes/statsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const { verifyToken } = require('./middleware/authMiddleware');
const path = require('path');

app.use(cors());
app.use(express.json());

// Initialize Database Storage Mapping
const SettingsService = require('./services/SettingsService');
SettingsService.initDB();

// Express Static for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Activity Logging Middleware
const activityLogger = require('./middleware/activityLogger');
app.use('/api', activityLogger); // Attach exclusively to API sub-router

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingsRoutes);

// Protected health check
app.get('/api/admin/check', verifyToken, (req, res) => {
  res.json({ message: 'Authorized access verified', user: req.user });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
