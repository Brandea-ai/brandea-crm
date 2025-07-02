const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const path = require('path');

// Import your existing routes
const authRoutes = require('../../backend/routes/auth');
const suppliersRoutes = require('../../backend/routes/suppliers');
const columnsRoutes = require('../../backend/routes/columns');
const exportRoutes = require('../../backend/routes/export');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/columns', columnsRoutes);
app.use('/api/export', exportRoutes);

module.exports = app;
module.exports.handler = serverless(app);