const express = require('express');
const cors = require('cors');
const path = require('path');

const alumniRoutes = require('./routes/alumni');
const statsRoutes = require('./routes/stats');
const aiChatRoutes = require('./routes/aiChat');
const notificationsRoutes = require('./routes/notifications');
const opportunitiesRoutes = require('./routes/opportunities');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/alumni', alumniRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/ai-chat', aiChatRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/contact', contactRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CS Alumni Portal Express REST API', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 CS Alumni Portal Node.js Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Alumni Endpoint: http://localhost:${PORT}/api/alumni`);
  console.log(`===================================================`);
});
