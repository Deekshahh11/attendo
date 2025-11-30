const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Attendance = require('../models/Attendance');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_system');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared existing data');

    // Create Manager
    const manager = new User({
      name: 'Manager User',
      email: 'manager@example.com',
      password: 'manager123',
      role: 'manager',
      employeeId: 'MGR001',
      department: 'Management'
    });
    await manager.save();
    console.log('Created manager:', manager.email);

    // Create Employees
    const employees = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'employee123',
        employeeId: 'EMP001',
        department: 'Engineering'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'employee123',
        employeeId: 'EMP002',
        department: 'Engineering'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'employee123',
        employeeId: 'EMP003',
        department: 'Sales'
      },
      {
        name: 'Alice Williams',
        email: 'alice@example.com',
        password: 'employee123',
        employeeId: 'EMP004',
        department: 'Marketing'
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: 'employee123',
        employeeId: 'EMP005',
        department: 'Engineering'
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        password: 'employee123',
        employeeId: 'EMP006',
        department: 'HR'
      },
      {
        name: 'Emma Davis',
        email: 'emma@example.com',
        password: 'employee123',
        employeeId: 'EMP007',
        department: 'Finance'
      },
      {
        name: 'Frank Miller',
        email: 'frank@example.com',
        password: 'employee123',
        employeeId: 'EMP008',
        department: 'Engineering'
      },
      {
        name: 'Grace Lee',
        email: 'grace@example.com',
        password: 'employee123',
        employeeId: 'EMP009',
        department: 'Sales'
      },
      {
        name: 'Henry Taylor',
        email: 'henry@example.com',
        password: 'employee123',
        employeeId: 'EMP010',
        department: 'Marketing'
      }
    ];

    const createdEmployees = [];
    for (const emp of employees) {
      const employee = new User(emp);
      await employee.save();
      createdEmployees.push(employee);
      console.log('Created employee:', employee.email);
    }

    // Create sample attendance data for the last 30 days
    const today = new Date();
    const attendanceRecords = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Skip weekends (Saturday = 6, Sunday = 0)
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      for (const employee of createdEmployees) {
        // Randomly decide if employee was present (80% chance)
        const isPresent = Math.random() > 0.2;

        if (isPresent) {
          // Check in time (between 8:00 AM and 10:00 AM)
          const checkInHour = 8 + Math.floor(Math.random() * 2);
          const checkInMinute = Math.floor(Math.random() * 60);
          const checkInTime = new Date(date);
          checkInTime.setHours(checkInHour, checkInMinute, 0, 0);

          // Check out time (between 5:00 PM and 7:00 PM)
          const checkOutHour = 17 + Math.floor(Math.random() * 2);
          const checkOutMinute = Math.floor(Math.random() * 60);
          const checkOutTime = new Date(date);
          checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);

          // Determine status (late if check in after 9:00 AM)
          const status = checkInTime.getHours() > 9 || 
                        (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 0) 
                        ? 'late' : 'present';

          const attendance = new Attendance({
            userId: employee._id,
            date: date,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            status: status
          });

          attendanceRecords.push(attendance);
        } else {
          // Absent
          const attendance = new Attendance({
            userId: employee._id,
            date: date,
            status: 'absent'
          });

          attendanceRecords.push(attendance);
        }
      }
    }

    // Insert all attendance records
    await Attendance.insertMany(attendanceRecords);
    console.log(`Created ${attendanceRecords.length} attendance records`);

    console.log('\nSeed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Manager - Email: manager@example.com, Password: manager123');
    console.log('Employee - Email: john@example.com, Password: employee123');
    console.log('(Other employees: jane@example.com, bob@example.com, alice@example.com, charlie@example.com, david@example.com, emma@example.com, frank@example.com, grace@example.com, henry@example.com)');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();

