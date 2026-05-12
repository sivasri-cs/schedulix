import { Router } from 'express';
import User from '../models/User.js';
import Simulation from '../models/Simulation.js';
import Announcement from '../models/Announcement.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = Router();

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Stats
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSimulations = await Simulation.countDocuments();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const activeToday = await Simulation.distinct('userId', { createdAt: { $gte: today } });
    res.json({ totalUsers, totalSimulations, activeToday: activeToday.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Announcements
router.get('/announcements', auth, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(20);
    res.json({ announcements });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/announcements', auth, adminAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const announcement = await Announcement.create({ title, content, author: req.user._id });
    res.status(201).json({ announcement });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/announcements/:id', auth, adminAuth, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
