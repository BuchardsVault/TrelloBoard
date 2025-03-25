const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getAllCards, createCard, updateCard, deleteCard } = require('../services/db');

router.get('/cards', authenticateToken, async (req, res) => {
  try {
    const cards = await getAllCards();
    res.json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

router.post('/cards', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, status, designee_id } = req.body;
    const author_id = req.user.id;
    const ticket = await createCard({ title, description, priority, status, author_id, designee_id });
    req.io.emit('ticketCreated', ticket);
    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

router.put('/cards/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, status, designee_id } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;
    if (designee_id !== undefined) updates.designee_id = designee_id;

    const ticket = await updateCard(req.params.id, updates);
    req.io.emit('ticketUpdated', ticket);
    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(error.message === 'Ticket not found' ? 404 : 500).json({ error: error.message });
  }
});

router.delete('/cards/:id', authenticateToken, async (req, res) => {
  try {
    const result = await deleteCard(req.params.id);
    req.io.emit('ticketDeleted', result);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(error.message === 'Ticket not found' ? 404 : 500).json({ error: error.message });
  }
});

module.exports = router;