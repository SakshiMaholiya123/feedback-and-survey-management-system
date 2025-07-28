import express from 'express';
import Admin from '../models/Admin.js'; // or any model

const router = express.Router();

router.get('/atlas', async (req, res) => {
  try {
    const admins = await Admin.find().limit(5);
    res.json({ message: '✅ Atlas is working!', data: admins });
  } catch (error) {
    res.status(500).json({ message: '❌ Error connecting to Atlas', error: error.message });
  }
});

export default router;
