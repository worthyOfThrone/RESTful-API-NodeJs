const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// Import routes
const authRoute = require('./routes/auth');
const authenticatedRoutes = require('./routes/authenticatedRoutes');

dotenv.config();

// Connect to Mongo DB
mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(
        () => console.log('connected to db!')
    );

// Middleware
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', authenticatedRoutes);

app.listen(port, () => console.log(`Started App on port ${port}`))