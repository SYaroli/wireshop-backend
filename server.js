// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup (SQLite)
const sqlite3 = require('sqlite3').verbose();
const dbPath = process.env.DATABASE_PATH || '/data/logs.db';
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('Error connecting to DB:', err);
  } else {
    console.log('Connected to SQLite at', dbPath);
  }
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, partNumber TEXT, action TEXT, notes TEXT, timestamp TEXT)', err => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Logs table ready');
    }
  });
});

app.use(cors());
app.use(bodyParser.json());

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
      console.log('Log inserted, ID:', this.lastID);
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
    console.log('Fetched', rows.length, 'logs');
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
    console.log('All logs deleted');
    res.json({ success: true });
  });
});

// GET /api/test-db - Test DB count
app.get('/api/test-db', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM logs', (err, row) => {
    if (err) {
      console.error('Error testing DB:', err);
      return res.status(500).json({ error: 'DB test failed' });
    }
    console.log('DB test: ', row.count, 'logs');
    res.json({ count: row.count });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
