const express = require('express');
const dotenv  = require('dotenv');
const cors    = require('cors');
const db      = require('./models');
const authRoutes  = require('./routes/auth');
const bookingRoutes = require('./routes/book');

dotenv.config();
const app = express();

// Connect & sync
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('MySQL connected');
    await db.sequelize.sync({ force: false });
  } catch (err) {
    console.error('Unable to connect to MySQL:', err);
    process.exit(1);
  }
})();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// Middleware
app.use(express.json());
// Auth routes
app.use('/api/auth',    authRoutes);
// Book routes
app.use('/api/booking', bookingRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
);
