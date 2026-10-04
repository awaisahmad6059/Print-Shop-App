const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db/mongoose');
const errorHandler = require('./middleware/errorHandler');
const socketHandlers = require('./socket/socketHandlers');

const orderRoutes = require('./routes/orders');
const shopRoutes = require('./routes/shop');
const fileRoutes = require('./routes/files');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'],
  },
});

// MongoDB Connection
connectDB()
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
  })
  .catch((err) => {
    console.log('❌ MongoDB Connection Error:', err);
  });

app.use(cors());
app.use(express.json());

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server running, DB connected!' });
});

app.set('io', io);
socketHandlers(io);

app.use('/api/orders', orderRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/files', fileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
