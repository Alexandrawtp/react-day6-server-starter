require('dotenv/config');
require('./db');
const express = require('express');
const app = express();
require('./config')(app);

// session config

const session = require('express-session');
const MongoStore = require('connect-mongo').default;

app.use(session({
    secret: 'MyPortfolioProject',
    saveUninitialized: false, 
    resave: false, 
    cookie: {
      maxAge: 1000*60*60*24 // expiring in 1 day
    },
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/portfolio",
      ttl: 60*60*24, // expiring in 1 day
    })
}));

const allRoutes = require('./routes');


//Middlewares
app.use('/api', allRoutes);

const projectRoutes = require('./routes/projects.routes');
app.use('/api', projectRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);

const cloudinaryRoutes = require("./routes/cloudinary.routes");
app.use("/api", cloudinaryRoutes);

//Errors handling
require('./error-handling')(app);

module.exports = app;
