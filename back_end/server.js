const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://trello.azurewebsites.net/' : 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

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
    ca: serverCA,
  },
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

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error: No token provided'));

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error: Invalid token'));
    socket.user = decoded;
    next();
  });
});

io.on('connection', (socket) => {
  console.log(`User ${socket.user.id} connected`);
  socket.on('disconnect', () => {
    console.log(`User ${socket.user.id} disconnected`);
  });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    if (user.password !== password) {
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

// Get current user data
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Update user data (no hashing)
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, email, password, currentPassword } = req.body;
    const updates = {};

    // Fetch current user data for password verification
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Verify current password if changing password
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password required to change password' });
      }
      if (currentPassword !== user.password) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      updates.password = password; // Plain text, no hashing
    }

    if (name) updates.name = name;
    if (email) updates.email = email;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No changes provided' });
    }

    const [result] = await pool.query(
      'UPDATE users SET ? WHERE id = ?',
      [updates, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [updatedUser] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [req.params.id]);
    res.json(updatedUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
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

    const ticket = newTicket[0];
    io.emit('ticketCreated', ticket);
    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Update ticket
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

    const [updatedTicket] = await pool.query(`
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
    `, [req.params.id]);

    const ticket = updatedTicket[0];
    io.emit('ticketUpdated', ticket);
    res.json(ticket);
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

    io.emit('ticketDeleted', { id: parseInt(req.params.id) });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});