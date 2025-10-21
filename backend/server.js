require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const loginRate = require('./middleware/rateLimit');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/api/auth', loginRate, authRoutes);
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: `Selamat Datang ${req.user.username || req.user.email}` });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
