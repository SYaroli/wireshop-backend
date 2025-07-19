// routes/jobs.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Log a job action
router.post('/log', (req, res) => {
  const { username, partNumber, action, note, startTime, endTime } = req.body;

  if (!username || !partNumber || !action) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = `
    INSERT INTO jobs (username, partNumber, action, note, startTime, endTime)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(stmt, [username, partNumber, action, note || '', startTime || null, endTime || null], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

// Get all job logs
router.get('/logs', (req, res) => {
  db.all(`SELECT * FROM jobs ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get logs for a specific user
router.get('/logs/:username', (req, res) => {
  db.all(`SELECT * FROM jobs WHERE username = ? ORDER BY id DESC`, [req.params.username], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;