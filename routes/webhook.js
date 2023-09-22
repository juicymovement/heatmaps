// Import necessary packages
const express = require('express');
const router = express.Router();
const RepoInteraction = require('../models/RepoInteraction');
const redis = require('redis');

// Setup Redis client
const redisClient = redis.createClient();

// Advanced formula to calculate productivity based on GitHub events
const calculateProductivity = (eventCounts) => {
  return (
    5 * (eventCounts.push || 0) +
    4 * (eventCounts.pull_request || 0) +
    3 * (eventCounts.pull_request_review || 0) +
    2 * (eventCounts.issues || 0) +
    1 * (eventCounts.commit_comment || 0)
  );
};

// POST route to capture GitHub webhook data
router.post('/', async (req, res) => {
  const payload = req.body;
  const eventType = req.headers['x-github-event'];

  try {
    const repoInteraction = new RepoInteraction({
      repoName: payload.repository.name,
      collaborator: payload.sender.login,
      interactionType: eventType,
      timestamp: new Date(),
    });

    if (eventType === 'push' && payload.commits && payload.commits.length > 0) {
      // Extract and calculate insertions and changed files from commits
      let insertions = 0;
      let changedFiles = 0;

      payload.commits.forEach((commit) => {
        insertions += commit.stats.additions;
        changedFiles += commit.stats.total;
      });

      repoInteraction.insertions = insertions;
      repoInteraction.changedFiles = changedFiles;
    }

    await repoInteraction.save();
    res.status(200).json({ message: 'Webhook data processed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error processing webhook data.', error: err });
  }
});

// GET route to fetch heatmap data
router.get('/api/getHeatmapData', (req, res) => {
  redisClient.get('heatmapData', async (err, cachedData) => {
    if (err) throw err;

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
    } else {
      try {
        const rawData = await RepoInteraction.find({});
        const eventCounts = {};
        
        rawData.forEach(item => {
          const collab = item.collaborator;
          const eventType = item.interactionType;
          
          if (!eventCounts[collab]) {
            eventCounts[collab] = {};
          }
          eventCounts[collab][eventType] = (eventCounts[collab][eventType] || 0) + 1;
        });
        
        const processedData = Object.keys(eventCounts).map(collab => {
          return {
            collaborator: collab,
            productivity: calculateProductivity(eventCounts[collab])
          };
        });

        redisClient.setex('heatmapData', 3600, JSON.stringify(processedData));
        
        res.status(200).json(processedData);
      } catch (err) {
        res.status(500).json({ message: 'Error fetching heatmap data.', error: err });
      }
    }
  });
});

// Export the router
module.exports = router;
