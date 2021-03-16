require('dotenv/config');
require('./db');
const express = require('express');
const app = express();
require('./config')(app);
const allRoutes = require('./routes');

//Middlewares
app.use('/api', allRoutes);

const projectRoutes = require('./routes/projects.routes');
app.use('/api', projectRoutes);

//Errors handling
require('./error-handling')(app);

module.exports = app;
