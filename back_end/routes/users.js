const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getAllUsers, getUserById, updateUser, getUserByEmail } = require('../services/db');

router.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

router.put('/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, email, password, currentPassword } = req.body;
    const updates = {};

    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password required to change password' });
      }
      const currentUser = await getUserByEmail(user.email); // Fetch full user for password
      if (currentPassword !== currentUser.password) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      updates.password = password;
    }

    if (name) updates.name = name;
    if (email) updates.email = email;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No changes provided' });
    }

    const updatedUser = await updateUser(req.params.id, updates);
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(error.message === 'User not found' ? 404 : 500).json({ error: error.message });
  }
});

module.exports = router;