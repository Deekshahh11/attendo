const express = require('express');
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

// @route   GET /api/dashboard/employee
// @desc    Get employee dashboard stats
// @access  Private (Employee)
router.get('/employee', auth, async (req, res) => {
  try {
    const today = new Date();
    const { start: todayStart, end: todayEnd } = getDayBounds(today);
    
    // Today's status
    const todayAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    // Current month stats
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthAttendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const present = monthAttendance.filter(a => a.status === 'present').length;
    const absent = monthAttendance.filter(a => a.status === 'absent').length;
    const late = monthAttendance.filter(a => a.status === 'late').length;
    const totalHours = monthAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);

    // Recent attendance (last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentAttendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: sevenDaysAgo, $lte: todayEnd }
    }).sort({ date: -1 }).limit(7);

    res.json({
      todayStatus: {
        checkedIn: !!todayAttendance?.checkInTime,
        checkedOut: !!todayAttendance?.checkOutTime,
        checkInTime: todayAttendance?.checkInTime,
        checkOutTime: todayAttendance?.checkOutTime,
        status: todayAttendance?.status || 'absent'
      },
      monthStats: {
        present,
        absent,
        late,
        totalHours: Math.round(totalHours * 100) / 100
      },
      recentAttendance: recentAttendance.map(a => ({
        date: a.date,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
        status: a.status,
        totalHours: a.totalHours
      }))
    });
  } catch (error) {
    console.error('Get employee dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/dashboard/manager
// @desc    Get manager dashboard stats
// @access  Private (Manager)
router.get('/manager', auth, isManager, async (req, res) => {
  try {
    const today = new Date();
    const { start: todayStart, end: todayEnd } = getDayBounds(today);

    // Total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    // Today's attendance
    const todayAttendance = await Attendance.find({
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate('userId', 'name employeeId department');

    const todayPresent = todayAttendance.filter(a => a.checkInTime).length;
    const todayAbsent = totalEmployees - todayPresent;
    const todayLate = todayAttendance.filter(a => a.status === 'late').length;
    const absentEmployees = todayAttendance
      .filter(a => !a.checkInTime)
      .map(a => a.userId)
      .filter(Boolean);

    // Weekly attendance trend (last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyAttendance = await Attendance.find({
      date: { $gte: sevenDaysAgo, $lte: todayEnd }
    }).populate('userId', 'department');

    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const { start, end } = getDayBounds(date);
      const dayAttendance = weeklyAttendance.filter(a => {
        const attDate = new Date(a.date);
        return attDate >= start && attDate <= end;
      });
      weeklyTrend.push({
        date: date.toISOString().split('T')[0],
        present: dayAttendance.filter(a => a.status === 'present' || a.status === 'late').length,
        absent: dayAttendance.filter(a => a.status === 'absent').length
      });
    }

    // Department-wise attendance
    const departmentStats = {};
    todayAttendance.forEach(a => {
      if (a.userId && a.userId.department) {
        const dept = a.userId.department;
        if (!departmentStats[dept]) {
          departmentStats[dept] = { present: 0, absent: 0, late: 0, total: 0 };
        }
        departmentStats[dept].total++;
        if (a.checkInTime) {
          departmentStats[dept].present++;
          if (a.status === 'late') departmentStats[dept].late++;
        } else {
          departmentStats[dept].absent++;
        }
      }
    });

    // Get all departments and their employee counts
    const allDepartments = await User.distinct('department', { role: 'employee' });
    for (const dept of allDepartments) {
      if (!departmentStats[dept]) {
        const deptEmployeeCount = await User.countDocuments({ department: dept, role: 'employee' });
        departmentStats[dept] = { present: 0, absent: deptEmployeeCount, late: 0, total: deptEmployeeCount };
      }
    }

    res.json({
      totalEmployees,
      todayStats: {
        present: todayPresent,
        absent: todayAbsent,
        late: todayLate
      },
      absentEmployeesToday: absentEmployees.map(u => ({
        id: u._id,
        name: u.name,
        employeeId: u.employeeId,
        department: u.department
      })),
      weeklyTrend,
      departmentStats
    });
  } catch (error) {
    console.error('Get manager dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

