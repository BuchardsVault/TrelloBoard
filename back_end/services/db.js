const { pool } = require('../config/database');

/***********  User Related Queries for DB *************/
async function getUserByEmail(email) {
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return users[0] || null;
}

async function getUserById(id) {
  const [users] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [id]);
  return users[0] || null;
}

async function getAllUsers() {
  const [rows] = await pool.query('SELECT id, name FROM users');
  return rows;
}

async function updateUser(id, updates) {
  const [result] = await pool.query('UPDATE users SET ? WHERE id = ?', [updates, id]);
  if (result.affectedRows === 0) {
    throw new Error('User not found');
  }
  return getUserById(id); // Return updated user
}

/***********  Card Related Queries for DB *************/
async function getAllCards() {
  const [rows] = await pool.query(`
    SELECT 
      c.id, c.title, c.description, c.priority, c.status,
      u1.name AS author, u2.name AS designee, c.author_id, c.designee_id
    FROM cards c
    LEFT JOIN users u1 ON c.author_id = u1.id
    LEFT JOIN users u2 ON c.designee_id = u2.id
  `);
  return rows;
}

async function createCard({ title, description, priority, status, author_id, designee_id }) {
  const [result] = await pool.query(
    'INSERT INTO cards (title, description, priority, status, author_id, designee_id) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, priority, status, author_id, designee_id]
  );
  return getCardById(result.insertId);
}

async function getCardById(id) {
  const [cards] = await pool.query(`
    SELECT 
      c.id, c.title, c.description, c.priority, c.status,
      u1.name AS author, u2.name AS designee, c.author_id, c.designee_id
    FROM cards c
    LEFT JOIN users u1 ON c.author_id = u1.id
    LEFT JOIN users u2 ON c.designee_id = u2.id
    WHERE c.id = ?
  `, [id]);
  return cards[0] || null;
}

async function updateCard(id, updates) {
  const [result] = await pool.query('UPDATE cards SET ? WHERE id = ?', [updates, id]);
  if (result.affectedRows === 0) {
    throw new Error('Ticket not found');
  }
  return getCardById(id); // Return updated card
}

async function deleteCard(id) {
  const [result] = await pool.query('DELETE FROM cards WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new Error('Ticket not found');
  }
  return { id: parseInt(id) };
}

/**
 * Exports the query calls to be referenced throughout the code 
 */
module.exports = {
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
  getAllCards,
  createCard,
  getCardById,
  updateCard,
  deleteCard,
};