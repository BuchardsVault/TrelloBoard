const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const serverCA = [fs.readFileSync('./DigiCertGlobalRootCA.crt.pem', 'utf8')];

const dbConfig = {
  host: "trellodb.mysql.database.azure.com",
  user: "myadmin",
  password: "SDSU@2025",
  database: "trello_db",
  port: 3306,
  ssl: {
    rejectUnauthorized: true,
    ca: serverCA
  }
};

const pool = mysql.createPool(dbConfig);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Login endpoint (unchanged)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    if (user.password !== password) { // Replace with bcrypt.compare if hashed
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all tickets
app.get('/api/cards', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.priority,
        c.status,
        u1.name AS author,
        u2.name AS designee,
        c.author_id,
        c.designee_id
      FROM cards c
      LEFT JOIN users u1 ON c.author_id = u1.id
      LEFT JOIN users u2 ON c.designee_id = u2.id
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get all users
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create a ticket
app.post('/api/cards', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, status, designee_id } = req.body;
    const author_id = req.user.id;
    const [result] = await pool.query(
      'INSERT INTO cards (title, description, priority, status, author_id, designee_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, priority, status, author_id, designee_id]
    );

    const [newTicket] = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.priority,
        c.status,
        u1.name AS author,
        u2.name AS designee,
        c.author_id,
        c.designee_id
      FROM cards c
      LEFT JOIN users u1 ON c.author_id = u1.id
      LEFT JOIN users u2 ON c.designee_id = u2.id
      WHERE c.id = ?
    `, [result.insertId]);

    res.status(201).json(newTicket[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Update ticket (expanded to handle all fields)
app.put('/api/cards/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, status, designee_id } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;
    if (designee_id !== undefined) updates.designee_id = designee_id;

    const [result] = await pool.query(
      'UPDATE cards SET ? WHERE id = ?',
      [updates, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// Delete ticket
app.delete('/api/cards/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM cards WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});
