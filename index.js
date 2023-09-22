// Import necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Use body-parser's json middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/devops-heatmap', { useNewUrlParser: true, useUnifiedTopology: true });

// Import routes
const webhookRoute = require('./routes/webhook');

// Use routes
app.use('/webhook', webhookRoute);

// Add a GET route at /
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
