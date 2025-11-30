const express = require('express');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { auth, isManager } = require('../middleware/auth');

const router = express.Router();

// @route GET /api/users
// @desc  Get all employees (manager only)
// @access Private (Manager)
router.get('/', auth, isManager, async (req, res) => {
  try {
    const users = await User.find({ role: 'employee' }).select('name email employeeId department');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route DELETE /api/users/:id
// @desc  Delete an employee and their attendance records (manager only)
// @access Private (Manager)
router.delete('/:id', auth, isManager, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'manager') return res.status(400).json({ message: 'Cannot delete manager' });

    // Delete attendance records for the user
    await Attendance.deleteMany({ userId: user._id });

    // Delete the user
    await User.findByIdAndDelete(user._id);

    res.json({ message: 'User and attendance records deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
