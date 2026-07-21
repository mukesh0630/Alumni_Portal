const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/alumni.json');

router.post('/', (req, res) => {
  const { query, promptType, targetAlumniName } = req.body;
  const userQuery = (query || '').toLowerCase();

  let alumniList = [];
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    alumniList = JSON.parse(raw).alumni || [];
  } catch (e) {
    alumniList = [];
  }

  let answer = '';

  // 1. Profile Summary Request
  if (promptType === 'summary' && targetAlumniName) {
    const target = alumniList.find(a => a.name.toLowerCase() === targetAlumniName.toLowerCase());
    if (target) {
      answer = `### 🌟 Profile Executive Summary for **${target.name}**\n\n` +
        `**Current Role:** ${target.designation} at **${target.company}** (${target.location})\n` +
        `**Graduation Batch:** B.Sc Computer Science Class of **${target.batch}**\n\n` +
        `**Key Strengths & Expertise:** ${target.skills.join(', ')}\n\n` +
        `**Highlights:**\n` +
        target.achievements.map(ach => `- ${ach}`).join('\n') + '\n\n' +
        `**Mentorship Availability:** ${target.mentorship ? '✅ Available for student mentoring & career advice' : '❌ Currently unavailable for direct 1-on-1 mentorship'}`;
    } else {
      answer = `I couldn't find a record for ${targetAlumniName} in our Department Registry.`;
    }
  }
  // 2. Career Roadmap Request
  else if (promptType === 'roadmap' && targetAlumniName) {
    const target = alumniList.find(a => a.name.toLowerCase() === targetAlumniName.toLowerCase());
    if (target) {
      answer = `### 🚀 Career Roadmap & Growth Milestones: **${target.name}**\n\n` +
        `Here is the step-by-step career trajectory of ${target.name} starting from the B.Sc Computer Science department:\n\n` +
        target.timeline.map((step, idx) => `**Step ${idx + 1} (${step.year}):** ${step.role} at *${step.company}*`).join('\n\n') + '\n\n' +
        `**Key Takeaway for CS Students:** To follow in ${target.name}'s footsteps, focus on building strong foundations in ${target.skills.slice(0, 3).join(', ')}.`;
    } else {
      answer = `I couldn't generate a roadmap for ${targetAlumniName}.`;
    }
  }
  // 3. Custom Query Matching
  else if (userQuery.includes('google')) {
    const googleAlumni = alumniList.filter(a => a.company.toLowerCase().includes('google'));
    answer = `We have **${googleAlumni.length} alumni** working at **Google**!\n\n` +
      googleAlumni.map(a => `- **${a.name}** (Batch of ${a.batch}) - ${a.designation} in ${a.location}`).join('\n');
  }
  else if (userQuery.includes('microsoft')) {
    const msAlumni = alumniList.filter(a => a.company.toLowerCase().includes('microsoft'));
    answer = `We have **${msAlumni.length} alumnus/alumni** at **Microsoft**:\n\n` +
      msAlumni.map(a => `- **${a.name}** (Batch of ${a.batch}) - ${a.designation} in ${a.location}`).join('\n');
  }
  else if (userQuery.includes('mentor') || userQuery.includes('guidance')) {
    const mentors = alumniList.filter(a => a.mentorship);
    answer = `Currently, **${mentors.length} alumni** are actively available for student mentorship!\n\n` +
      `Top featured mentors:\n` +
      mentors.slice(0, 4).map(a => `- **${a.name}** (${a.company}) - Expert in ${a.skills.slice(0, 2).join(', ')}`).join('\n') +
      `\n\nYou can click on any alumnus card in the **Directory** tab to request 1-on-1 mentorship.`;
  }
  else if (userQuery.includes('hall of fame') || userQuery.includes('top alumni') || userQuery.includes('distinguished')) {
    const distinguished = alumniList.filter(a => a.distinguished);
    answer = `🏆 Our **Department Hall of Fame** features **${distinguished.length} distinguished pioneers**:\n\n` +
      distinguished.map(a => `- **${a.name}** (${a.company}, Batch '${a.batch.toString().slice(-2)}) - ${a.designation}`).join('\n');
  }
  else {
    answer = `The **B.Sc Computer Science Department** (established 1994) has a rich legacy of graduates across global tech leaders like Google, Microsoft, Amazon, Zoho, and Infosys.\n\n` +
      `Here are a few quick things you can ask me:\n` +
      `- "Show alumni working at Google"\n` +
      `- "Who offers mentorship in Cloud & AI?"\n` +
      `- "Tell me about Hall of Fame inductees"\n` +
      `- "What is the department history?"`;
  }

  res.json({
    success: true,
    reply: answer,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
