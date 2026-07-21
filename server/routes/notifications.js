const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const notifFilePath = path.join(__dirname, '../data/notifications.json');

router.get('/', (req, res) => {
  try {
    const raw = fs.readFileSync(notifFilePath, 'utf8');
    const notifs = JSON.parse(raw);
    res.json({ success: true, count: notifs.length, data: notifs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to read notifications' });
  }
});

router.post('/mark-read', (req, res) => {
  try {
    const raw = fs.readFileSync(notifFilePath, 'utf8');
    const notifs = JSON.parse(raw);
    const updated = notifs.map(n => ({ ...n, unread: false }));
    fs.writeFileSync(notifFilePath, JSON.stringify(updated, null, 2), 'utf8');
    res.json({ success: true, message: 'All notifications marked as read', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update notifications' });
  }
});

module.exports = router;
