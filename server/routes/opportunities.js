const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const oppFilePath = path.join(__dirname, '../data/opportunities.json');

router.get('/', (req, res) => {
  try {
    const raw = fs.readFileSync(oppFilePath, 'utf8');
    const opps = JSON.parse(raw);
    res.json({ success: true, count: opps.length, data: opps });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to read opportunities' });
  }
});

module.exports = router;
