const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
  }

  // In production, this can send an email via nodemailer or store in DB.
  console.log(`[Contact Form Submission] Name: ${name}, Email: ${email}`);

  res.json({
    success: true,
    message: 'Thank you for reaching out! Your message has been sent to Dr. K. Raghavan (Faculty Coordinator).'
  });
});

module.exports = router;
