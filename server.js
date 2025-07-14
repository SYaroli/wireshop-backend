// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jobRoutes = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup (SQLite)
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('logs.db'); // File-based for persistence (Render may reset, but better than memory)

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, partNumber TEXT, action TEXT, notes TEXT, timestamp TEXT)');
});

app.use(cors());
app.use(bodyParser.json());
app.use('/api/jobs', jobRoutes);

// GET / - Test endpoint
app.get('/', (req, res) => {
  res.send('Wireshop Backend Running');
});

// POST /api/log - Save a new log
app.post('/api/log', (req, res) => {
  const { username, partNumber, action, notes, timestamp } = req.body;
  db.run(
    'INSERT INTO logs (username, partNumber, action, notes, timestamp) VALUES (?, ?, ?, ?, ?)',
    [username, partNumber, action, notes, timestamp],
    function (err) {
      if (err) {
        console.error('Error inserting log:', err);
        return res.status(500).json({ error: 'Failed to save log' });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// GET /api/logs - Fetch all logs
app.get('/api/logs', (req, res) => {
  db.all('SELECT * FROM logs ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching logs:', err);
      return res.status(500).json({ error: 'Failed to fetch logs' });
    }
    res.json(rows);
  });
});

// DELETE /api/delete-logs - Clear all logs
app.delete('/api/delete-logs', (req, res) => {
  db.run('DELETE FROM logs', err => {
    if (err) {
      console.error('Error deleting logs:', err);
      return res.status(500).json({ error: 'Failed to delete logs' });
    }
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
