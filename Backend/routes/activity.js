const express = require('express');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

const router = express.Router();

// Get last 20 activities
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('userId', 'username')
      .populate('taskId', 'title status');

    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activities for a specific task
router.get('/task/:taskId', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ taskId: req.params.taskId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username');

    res.json(activities);
  } catch (error) {
    console.error('Get task activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
