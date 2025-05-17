const express = require('express');
const dotenv  = require('dotenv');
const cors    = require('cors');
const authRoutes  = require('./routes/auth');
const bookingRoutes = require('./routes/book');

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

app.use(express.json());

const startServer = async () => {
  try {
    const db = await require('./models');
    console.log('Database connection established');
    await db.sequelize.sync({ force: false });
    console.log('Database synchronized');
    app.use('/api/auth', authRoutes);
    app.use('/api/booking', bookingRoutes);
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: err.message || 'Server Error' });
    });
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};
startServer();
