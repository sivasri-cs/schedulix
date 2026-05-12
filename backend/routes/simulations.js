import { Router } from 'express';
import Simulation from '../models/Simulation.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Save simulation
router.post('/', auth, async (req, res) => {
  try {
    const { type, config, results } = req.body;
    const sim = await Simulation.create({ userId: req.user._id, type, config, results });
    res.status(201).json({ simulation: sim });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user simulations
router.get('/', auth, async (req, res) => {
  try {
    const simulations = await Simulation.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ simulations });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single simulation
router.get('/:id', auth, async (req, res) => {
  try {
    const sim = await Simulation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!sim) return res.status(404).json({ message: 'Not found' });
    res.json({ simulation: sim });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete simulation
router.delete('/:id', auth, async (req, res) => {
  try {
    await Simulation.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
