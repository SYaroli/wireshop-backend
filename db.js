// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database will live in root of project
const db = new sqlite3.Database(path.resolve(__dirname, 'wireshop.db'), (err) => {
  if (err) console.error('Failed to connect to database:', err);
  else console.log('Connected to SQLite database');
});

// Create jobs table if it doesn’t exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    partNumber TEXT,
    action TEXT,
    note TEXT,
    startTime INTEGER,
    endTime INTEGER
  )`);
});

module.exports = db;
