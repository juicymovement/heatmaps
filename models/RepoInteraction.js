// Import mongoose
const mongoose = require('mongoose');

// Define the schema for RepoInteraction
const RepoInteractionSchema = new mongoose.Schema({
  repoName: {
    type: String,
    required: true
  },
  collaborator: {
    type: String,
    required: true
  },
  interactionType: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  linesAdded: {
    type: Number,
    default: 0
  },
  linesDeleted: {
    type: Number,
    default: 0
  },
  numCommits: {
    type: Number,
    default: 0
  },
  insertions: {
    type: Number,
    default: 0 // Add this field
  },
  changedFiles: {
    type: Number,
    default: 0 // Add this field
  }
});

// Export the RepoInteraction model
module.exports = mongoose.model('RepoInteraction', RepoInteractionSchema);
