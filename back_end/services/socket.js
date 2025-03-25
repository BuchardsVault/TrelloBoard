const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

const configureSocket = (io) => {
  io.use((socket, next) => {
    console.log('Handshake auth:', socket.handshake.auth);
    const token = socket.handshake.auth.token;
    if (!token) {
      console.error('No token provided');
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Client origin:', socket.handshake.headers.origin);
    console.log(`User ${socket.user.id} connected`);
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.id} disconnected`);
    });
  });

  // Middleware to attach io to req object for routes
  return (req, res, next) => {
    req.io = io;
    next();
  };
};

module.exports = { configureSocket };