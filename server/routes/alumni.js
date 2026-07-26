const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/alumni.json');

// Helper to read data
function readData() {
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading alumni.json:', err);
    return { alumni: [], verificationQueue: [] };
  }
}

// Helper to write data
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing alumni.json:', err);
  }
}

// GET /api/alumni - List & search alumni
router.get('/', (req, res) => {
  const { alumni } = readData();
  const { search, batch, company, location, role, verified, distinguished, mentorship } = req.query;

  let result = [...alumni];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q) ||
      a.designation.toLowerCase().includes(q) ||
      a.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  if (batch) {
    result = result.filter(a => String(a.batch) === String(batch));
  }

  if (company) {
    result = result.filter(a => a.company.toLowerCase() === company.toLowerCase());
  }

  if (location) {
    if (location === 'international') {
      result = result.filter(a => a.location.includes('USA') || a.location.includes('UK') || a.location.includes('EU'));
    } else {
      result = result.filter(a => a.location.toLowerCase().includes(location.toLowerCase()));
    }
  }

  if (role) {
    const r = role.toLowerCase();
    if (r === 'architect') {
      result = result.filter(a => a.designation.toLowerCase().includes('architect'));
    } else if (r === 'vp-director') {
      result = result.filter(a => a.designation.toLowerCase().includes('vp') || a.designation.toLowerCase().includes('director') || a.designation.toLowerCase().includes('head'));
    } else if (r === 'sde') {
      result = result.filter(a => a.designation.toLowerCase().includes('engineer') || a.designation.toLowerCase().includes('developer') || a.designation.toLowerCase().includes('sre'));
    } else if (r === 'product') {
      result = result.filter(a => a.designation.toLowerCase().includes('product') || a.designation.toLowerCase().includes('ux') || a.designation.toLowerCase().includes('design'));
    }
  }

  if (verified !== undefined) {
    result = result.filter(a => a.verified === (verified === 'true'));
  }

  if (distinguished !== undefined) {
    result = result.filter(a => a.distinguished === (distinguished === 'true'));
  }

  if (mentorship !== undefined) {
    result = result.filter(a => a.mentorship === (mentorship === 'true'));
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/alumni/queue - Get pending faculty queue
router.get('/queue', (req, res) => {
  const { verificationQueue } = readData();
  res.json({ success: true, count: verificationQueue.length, data: verificationQueue });
});

// GET /api/alumni/:id - Single alumnus details
router.get('/:id', (req, res) => {
  const { alumni } = readData();
  const found = alumni.find(a => a.id === req.params.id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'Alumnus not found' });
  }
  res.json({ success: true, data: found });
});

// Helper to strip HTML tags for basic XSS prevention
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

// POST /api/alumni/register - Submit student graduation / alumni registration
router.post('/register', (req, res) => {
  const data = readData();
  const { name, batch, company, designation, location, registerNumber, email, phone, linkedin, bio, skills, achievements } = req.body;

  if (!name || !batch || !company || !email) {
    return res.status(400).json({ success: false, message: 'Missing required fields (name, batch, company, email)' });
  }

  // Input sanitization and length validation
  const cleanName = sanitize(name);
  const cleanEmail = sanitize(email);
  const cleanCompany = sanitize(company);

  if (cleanName.length > 100) {
    return res.status(400).json({ success: false, message: 'Name must be 100 characters or fewer.' });
  }

  if (cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  const batchNum = parseInt(batch, 10);
  if (isNaN(batchNum) || batchNum < 1994 || batchNum > new Date().getFullYear() + 1) {
    return res.status(400).json({ success: false, message: 'Batch year must be between 1994 and next year.' });
  }

  if (cleanCompany.length > 200) {
    return res.status(400).json({ success: false, message: 'Company name must be 200 characters or fewer.' });
  }

  const cleanBio = sanitize(bio || '');
  if (cleanBio.length > 2000) {
    return res.status(400).json({ success: false, message: 'Bio must be 2000 characters or fewer.' });
  }

  const newEntry = {
    id: 'q_' + Date.now(),
    name: cleanName,
    batch: batchNum,
    company: cleanCompany,
    designation: sanitize(designation) || 'Software Engineer',
    location: sanitize(location) || 'Bengaluru, India',
    registerNumber: sanitize(registerNumber) || ('CS' + batch + '00' + Math.floor(Math.random() * 90 + 10)),
    email: cleanEmail,
    phone: sanitize(phone) || '+91 99999 00000',
    linkedin: sanitize(linkedin) || 'linkedin.com',
    bio: cleanBio || 'B.Sc CS Graduate eager to contribute to technology.',
    skills: Array.isArray(skills) ? skills.map(s => sanitize(s)).filter(Boolean) : (skills ? sanitize(skills).split(',').map(s => s.trim()).filter(Boolean) : ['Java', 'React']),
    achievements: Array.isArray(achievements) ? achievements.map(a => sanitize(a)).filter(Boolean) : (achievements ? sanitize(achievements).split('\n').filter(Boolean) : ['Completed Graduation']),
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  };

  data.verificationQueue.unshift(newEntry);
  writeData(data);

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully. Pending faculty verification.',
    data: newEntry
  });
});


// PATCH /api/alumni/queue/:id/approve - Approve pending alumnus
router.patch('/queue/:id/approve', (req, res) => {
  const data = readData();
  const index = data.verificationQueue.findIndex(q => q.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Queue item not found' });
  }

  const [item] = data.verificationQueue.splice(index, 1);
  const newAlumnus = {
    id: 'a_' + Date.now(),
    name: item.name,
    batch: item.batch,
    company: item.company,
    designation: item.designation,
    location: item.location,
    verified: true,
    distinguished: false,
    email: item.email,
    linkedin: item.linkedin,
    bio: item.bio,
    skills: item.skills,
    achievements: item.achievements,
    mentorship: true,
    photo: item.photo,
    timeline: [
      { year: String(item.batch), role: item.designation, company: item.company }
    ]
  };

  data.alumni.unshift(newAlumnus);
  writeData(data);

  res.json({
    success: true,
    message: `Alumnus ${item.name} approved successfully!`,
    data: newAlumnus
  });
});

// DELETE /api/alumni/queue/:id - Reject pending registration
router.delete('/queue/:id', (req, res) => {
  const data = readData();
  const index = data.verificationQueue.findIndex(q => q.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Queue item not found' });
  }

  const [removed] = data.verificationQueue.splice(index, 1);
  writeData(data);

  res.json({
    success: true,
    message: `Registration for ${removed.name} has been rejected.`,
    data: removed
  });
});

// PUT /api/alumni/:id - Update profile
router.put('/:id', (req, res) => {
  const data = readData();
  const index = data.alumni.findIndex(a => a.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Alumnus not found' });
  }

  data.alumni[index] = { ...data.alumni[index], ...req.body };
  writeData(data);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: data.alumni[index]
  });
});

module.exports = router;
