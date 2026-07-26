const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
  }

  // Input length validation
  if (typeof name !== 'string' || name.trim().length > 100) {
    return res.status(400).json({ success: false, message: 'Name must be 100 characters or fewer.' });
  }

  if (typeof email !== 'string' || email.trim().length > 254) {
    return res.status(400).json({ success: false, message: 'Email must be 254 characters or fewer.' });
  }

  // Basic email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  if (typeof message !== 'string' || message.trim().length > 2000) {
    return res.status(400).json({ success: false, message: 'Message must be 2000 characters or fewer.' });
  }

  // In production, this can send an email via nodemailer or store in DB.
  console.log(`[Contact Form Submission] Name: ${name.trim()}, Email: ${email.trim()}`);

  res.json({
    success: true,
    message: 'Thank you for reaching out! Your message has been sent to Dr. K. Raghavan (Faculty Coordinator).'
  });
});

module.exports = router;
