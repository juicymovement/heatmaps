// Your existing app.js code here

// ---------------------
// Added New Comments
// ---------------------
// This is a new comment to demonstrate changes to the app.js file.
// You can also add other code snippets here as per your requirements.
// ---------------------

// Your existing app.js code continues here

// Import necessary packages
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Use body-parser's json middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/devops-heatmap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import routes
const webhookRoute = require('./routes/webhook');

// Use routes
app.use('/webhook', webhookRoute);

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Add a GET route at /
app.get('/', (req, res) => {
  res.render('heatmap');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
