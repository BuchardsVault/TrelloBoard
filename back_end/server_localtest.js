const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs'); 

const app = express();
app.use(cors()); // Allows requests from your frontend
app.use(express.json());

const serverCA = [fs.readFileSync('./DigiCertGlobalRootCA.crt.pem', 'utf8')]; 

const dbConfig = {
  host: "trellodb.mysql.database.azure.com",
  user: "myadmin", // Replace with your MySQL username, just using root here since it has most privilages 
  password: "SDSU@2025", // Replace with your MySQL password, I had to alter mine and just used this 
  database: "trello_db",
  port: 3306,
  ssl: {
    rejectUnauthorized: true,
    ca: serverCA
  }
};


// Create DB connection poolt
const pool = mysql.createPool(dbConfig);

// Get all tickets
app.get('/api/cards', async (req, res) => {
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
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create a ticket
app.post('/api/cards', async (req, res) => {
  try {
    const { title, description, priority, status, author_id, designee_id } = req.body;
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

// Update ticket status
app.put('/api/cards/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE cards SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
