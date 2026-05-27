const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    multipleStatements: true,
  });

  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  await connection.query(sql);
  await connection.end();
  console.log('Database initialized');
}

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const pool = require('./db');
    const [rows] = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create todo
app.post('/api/todos', async (req, res) => {
  try {
    const pool = require('./db');
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const [result] = await pool.query('INSERT INTO todos (title) VALUES (?)', [title]);
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const pool = require('./db');
    const { id } = req.params;
    const { completed } = req.body;
    await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id]);
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const pool = require('./db');
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err.message);
  process.exit(1);
});
