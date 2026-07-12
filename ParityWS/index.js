const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
// Default to 5001 to avoid conflict with macOS AirPlay Receiver on port 5000
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static assets of marketing website at /pairity
app.use('/pairity', express.static(path.join(__dirname, '../Parity_HomePage')));

app.get('/', (req, res) => {
  res.json({ message: 'Hello from PairityWS Express Backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
