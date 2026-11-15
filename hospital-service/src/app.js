const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const hospitalRoutes = require('./routes/hospital.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();
app.use(cors());
app.use(express.json({ limit: '64kb' }));
app.use((req, res, next) => { req.id = req.get('x-request-id') || crypto.randomUUID(); res.set('x-request-id', req.id); next(); });
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/hospitals', hospitalRoutes);
app.use((req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } }));
app.use(errorHandler);
module.exports = app;
