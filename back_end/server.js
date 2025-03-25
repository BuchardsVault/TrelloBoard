const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { configureSocket } = require('./services/socket');
const authRoutes = require('./routes/auth');
const cardRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');
const { corsConfig } = require('./middleware/cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: corsConfig });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Attach io to requests
app.use(configureSocket(io));

// Routes
app.use('/api', authRoutes);
app.use('/api', cardRoutes);
app.use('/api', userRoutes);

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});