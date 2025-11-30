const express = require('express');
const { body, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { auth, isManager } = require('../middleware/auth');

const router = express.Router();

// Helper function to get start and end of day
const getDayBounds = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// @route   POST /api/attendance/checkin
// @desc    Check in for today
// @access  Private (Employee)
router.post('/checkin', auth, async (req, res) => {
  try {
    const today = new Date();
    const { start, end } = getDayBounds(today);

    // Check if already checked in today
    let attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });

    if (attendance && attendance.checkInTime) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const checkInTime = new Date();
    const isLate = checkInTime.getHours() > 9 || (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 0);

    if (attendance) {
      attendance.checkInTime = checkInTime;
      attendance.status = isLate ? 'late' : 'present';
      await attendance.save();
    } else {
      attendance = new Attendance({
        userId: req.user._id,
        date: today,
        checkInTime: checkInTime,
        status: isLate ? 'late' : 'present'
      });
      await attendance.save();
    }

    res.json({
      message: 'Checked in successfully',
      attendance: {
        id: attendance._id,
        date: attendance.date,
        checkInTime: attendance.checkInTime,
        status: attendance.status
      }
    });
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/attendance/checkout
// @desc    Check out for today
// @access  Private (Employee)
router.post('/checkout', auth, async (req, res) => {
  try {
    const today = new Date();
    const { start, end } = getDayBounds(today);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    attendance.checkOutTime = new Date();
    await attendance.save();

    res.json({
      message: 'Checked out successfully',
      attendance: {
        id: attendance._id,
        date: attendance.date,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        totalHours: attendance.totalHours,
        status: attendance.status
      }
    });
  } catch (error) {
    console.error('Check out error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance/today
// @desc    Get today's attendance status
// @access  Private (Employee)
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    const { start, end } = getDayBounds(today);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });

    if (!attendance) {
      return res.json({
        checkedIn: false,
        checkedOut: false,
        status: 'absent'
      });
    }

    // Calculate total hours if not set or if both times are present
    let totalHours = attendance.totalHours;
    if (attendance.checkInTime && attendance.checkOutTime) {
      const diff = attendance.checkOutTime - attendance.checkInTime;
      totalHours = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
    }

    res.json({
      checkedIn: !!attendance.checkInTime,
      checkedOut: !!attendance.checkOutTime,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      totalHours: totalHours,
      status: attendance.status
    });
  } catch (error) {
    console.error('Get today error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance/my-history
// @desc    Get my attendance history
// @access  Private (Employee)
router.get('/my-history', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { userId: req.user._id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(100);

    // Calculate total hours for each record if both times are present
    const attendanceWithHours = attendance.map(att => {
      const attObj = att.toObject();
      if (att.checkInTime && att.checkOutTime) {
        const diff = att.checkOutTime - att.checkInTime;
        attObj.totalHours = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
      }
      return attObj;
    });

    res.json(attendanceWithHours);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance/my-summary
// @desc    Get monthly summary
// @access  Private (Employee)
router.get('/my-summary', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const attendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const halfDay = attendance.filter(a => a.status === 'half-day').length;
    const totalHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);

    res.json({
      month: targetMonth,
      year: targetYear,
      present,
      absent,
      late,
      halfDay,
      totalHours: Math.round(totalHours * 100) / 100,
      totalDays: attendance.length
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance/all
// @desc    Get all employees attendance
// @access  Private (Manager)
router.get('/all', auth, isManager, async (req, res) => {
  try {
    const { employeeId, startDate, endDate, status } = req.query;
    const query = {};

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) query.userId = user._id;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 })
      .limit(500);

    res.json(attendance);
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance/employee/:id
// @desc    Get specific employee attendance
// @access  Private (Manager)
router.get('/employee/:id', auth, isManager, async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { userId: req.params.id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error('Get employee attendance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance/summary
// @desc    Get team attendance summary
// @access  Private (Manager)
router.get('/summary', auth, isManager, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('userId', 'name employeeId department');

    const summary = {
      month: targetMonth,
      year: targetYear,
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0,
      totalHalfDay: 0,
      departmentWise: {}
    };

    attendance.forEach(a => {
      if (a.status === 'present') summary.totalPresent++;
      if (a.status === 'absent') summary.totalAbsent++;
      if (a.status === 'late') summary.totalLate++;
      if (a.status === 'half-day') summary.totalHalfDay++;

      if (a.userId && a.userId.department) {
        const dept = a.userId.department;
        if (!summary.departmentWise[dept]) {
          summary.departmentWise[dept] = { present: 0, absent: 0, late: 0, halfDay: 0 };
        }
        summary.departmentWise[dept][a.status] = (summary.departmentWise[dept][a.status] || 0) + 1;
      }
    });

    res.json(summary);
  } catch (error) {
    console.error('Get team summary error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance/today-status
// @desc    Get today's attendance status for all employees
// @access  Private (Manager)
router.get('/today-status', auth, isManager, async (req, res) => {
  try {
    const today = new Date();
    const { start, end } = getDayBounds(today);

    const attendance = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).populate('userId', 'name email employeeId department');

    const present = attendance.filter(a => a.checkInTime).length;
    const absent = attendance.filter(a => !a.checkInTime).length;
    const late = attendance.filter(a => a.status === 'late').length;

    res.json({
      date: today,
      present,
      absent,
      late,
      attendance: attendance.map(a => ({
        id: a._id,
        user: a.userId,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
        status: a.status
      }))
    });
  } catch (error) {
    console.error('Get today status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance/export
// @desc    Export attendance to CSV
// @access  Private (Manager)
router.get('/export', auth, isManager, async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    const query = {};

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) query.userId = user._id;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    // Generate CSV
    let csv = 'Date,Employee ID,Name,Email,Department,Check In,Check Out,Total Hours,Status\n';
    attendance.forEach(a => {
      const date = new Date(a.date).toLocaleDateString();
      const checkIn = a.checkInTime ? new Date(a.checkInTime).toLocaleString() : '';
      const checkOut = a.checkOutTime ? new Date(a.checkOutTime).toLocaleString() : '';
      const name = a.userId ? a.userId.name : '';
      const email = a.userId ? a.userId.email : '';
      const empId = a.userId ? a.userId.employeeId : '';
      const dept = a.userId ? a.userId.department : '';
      
      csv += `${date},${empId},${name},${email},${dept},${checkIn},${checkOut},${a.totalHours || 0},${a.status}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=attendance_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

