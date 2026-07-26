const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const alumniRoutes = require('./routes/alumni');
const statsRoutes = require('./routes/stats');
const aiChatRoutes = require('./routes/aiChat');
const notificationsRoutes = require('./routes/notifications');
const opportunitiesRoutes = require('./routes/opportunities');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Disabled for SPA compatibility
}));

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});
app.use('/api/', limiter);

// ── Core Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api/')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// ── API Routes ─────────────────────────────────────────────────────
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

// ── Global Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred.'
      : err.message || 'Internal Server Error'
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 CS Alumni Portal Node.js Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Alumni Endpoint: http://localhost:${PORT}/api/alumni`);
  console.log(`===================================================`);
});
