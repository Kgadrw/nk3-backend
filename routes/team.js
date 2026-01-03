const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// Get all team members
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single team member
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create team member
router.post('/', async (req, res) => {
  try {
    // Debug: Log incoming data
    console.log('POST /api/team - Received data:', JSON.stringify(req.body, null, 2));
    const team = new Team(req.body);
    await team.save();
    console.log('POST /api/team - Saved team:', JSON.stringify(team.toObject(), null, 2));
    res.status(201).json(team);
  } catch (error) {
    console.error('POST /api/team - Error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Update team member
router.put('/:id', async (req, res) => {
  try {
    // Debug: Log incoming data
    console.log(`PUT /api/team/${req.params.id} - Received data:`, JSON.stringify(req.body, null, 2));
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!team) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    console.log(`PUT /api/team/${req.params.id} - Updated team:`, JSON.stringify(team.toObject(), null, 2));
    res.json(team);
  } catch (error) {
    console.error(`PUT /api/team/${req.params.id} - Error:`, error.message);
    res.status(400).json({ error: error.message });
  }
});

// Delete team member
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

