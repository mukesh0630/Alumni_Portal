const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/alumni.json');

router.get('/', (req, res) => {
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    const { alumni, verificationQueue } = JSON.parse(raw);

    const verifiedAlumni = alumni.filter(a => a.verified);
    const totalAlumni = verifiedAlumni.length;
    const pendingCount = verificationQueue.length;

    // Companies count
    const uniqueCompanies = new Set(verifiedAlumni.map(a => a.company.trim()));

    // Regions count
    const uniqueLocations = new Set(verifiedAlumni.map(a => a.location.split(',')[0].trim()));

    // Mentors count
    const mentorsCount = verifiedAlumni.filter(a => a.mentorship).length;

    // Batch Distribution (Count of alumni per batch)
    const batchDistribution = {};
    verifiedAlumni.forEach(a => {
      batchDistribution[a.batch] = (batchDistribution[a.batch] || 0) + 1;
    });

    // Top Companies Distribution
    const companyDistribution = {};
    verifiedAlumni.forEach(a => {
      companyDistribution[a.company] = (companyDistribution[a.company] || 0) + 1;
    });

    // Country Distribution
    const regionDistribution = {};
    verifiedAlumni.forEach(a => {
      let region = 'India';
      if (a.location.includes('USA')) region = 'United States';
      else if (a.location.includes('UK')) region = 'United Kingdom';
      else if (a.location.includes('EU') || a.location.includes('Europe')) region = 'Europe';
      regionDistribution[region] = (regionDistribution[region] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalAlumni,
        verifiedCount: totalAlumni,
        pendingCount,
        uniqueCompaniesCount: uniqueCompanies.size,
        uniqueRegionsCount: uniqueLocations.size,
        mentorsCount,
        batchDistribution,
        companyDistribution,
        regionDistribution
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to compute statistics' });
  }
});

module.exports = router;
