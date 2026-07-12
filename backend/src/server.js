const express = require('express');
const cors = require('cors');
const path = require('path');

// Ensure env variables are loaded from the backend directory
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
