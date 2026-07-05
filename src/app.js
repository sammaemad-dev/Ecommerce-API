const express = require("express");
const app = express();
import authRoutes from './routes/auth.route.js';

app.use(express.json());
app.use('/api/auth', authRoutes);

module.exports = app;
