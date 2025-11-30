Name : H H Deeksha
College Name : Adichunchangiri Institute of Technology Chikkamagaluru - 577102
Contact Number : 9482885019

# Employee Attendance System

A comprehensive attendance tracking system with role-based access for employees and managers.

## Tech Stack

- **Frontend**: React + Redux Toolkit + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Features

### Employee Features
- ✅ Register/Login
- ✅ Mark attendance (Check In / Check Out)
- ✅ View attendance history (calendar and table view)
- ✅ View monthly summary (Present/Absent/Late days)
- ✅ Dashboard with statistics and charts

### Manager Features
- ✅ Login
- ✅ View all employees attendance
- ✅ Filter by employee, date, status
- ✅ View team attendance summary
- ✅ Export attendance reports (CSV)
- ✅ Dashboard with team statistics and charts
- ✅ Team calendar view

## Project Structure

```
tapmain/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── attendance.js
│   │   └── dashboard.js
│   ├── middleware/
│   │   └── auth.js
│   ├── scripts/
│   │   └── seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── employee/
│   │   │   └── manager/
│   │   ├── store/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# On Windows (if MongoDB is installed as a service, it should start automatically)
# On macOS/Linux:
mongod
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Attendance (Employee)
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/today` - Get today's status
- `GET /api/attendance/my-history` - Get attendance history
- `GET /api/attendance/my-summary` - Get monthly summary

### Attendance (Manager)
- `GET /api/attendance/all` - Get all employees attendance
- `GET /api/attendance/employee/:id` - Get specific employee attendance
- `GET /api/attendance/summary` - Get team summary
- `GET /api/attendance/export` - Export CSV
- `GET /api/attendance/today-status` - Get today's status for all employees

### Dashboard
- `GET /api/dashboard/employee` - Employee dashboard stats
- `GET /api/dashboard/manager` - Manager dashboard stats

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (employee/manager),
  employeeId: String (unique),
  department: String,
  createdAt: Date
}
```

### Attendance Collection
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  status: String (present/absent/late/half-day),
  totalHours: Number,
  createdAt: Date
}
```

## Seed Data

The seed script creates:
- 1 Manager user
  - Email: `manager@example.com`
  - Password: `manager123`
- 10 Employee users
  - Email: `john@example.com`, `jane@example.com`, `bob@example.com`, `alice@example.com`, `charlie@example.com`, `david@example.com`, `emma@example.com`, `frank@example.com`, `grace@example.com`, `henry@example.com`
  - Password: `employee123`
- Sample attendance data for the last 30 days

## Usage

### Employee Login
1. Go to `http://localhost:3000/login`
2. Login with employee credentials (e.g., `john@example.com` / `employee123`)
3. Access features:
   - Dashboard: View today's status and monthly stats
   - Mark Attendance: Check in/out for the day
   - My Attendance: View calendar and history
   - Profile: View personal information

### Manager Login
1. Go to `http://localhost:3000/login`
2. Login with manager credentials (`manager@example.com` / `manager123`)
3. Access features:
   - Dashboard: View team statistics and charts
   - All Attendance: View and filter all employees attendance
   - Calendar View: Team calendar with attendance status
   - Reports: Generate and export attendance reports

## Features in Detail

### Attendance History
- Calendar view with color coding:
  - 🟢 Green: Present
  - 🔴 Red: Absent
  - 🟡 Yellow: Late
  - 🟠 Orange: Half Day
- Click on any date to view details
- Filter by month and year

### Reports
- Select date range
- Filter by employee (optional)
- View detailed attendance table
- Export to CSV format

### Dashboard Charts
- Weekly attendance trend
- Department-wise attendance statistics
- Monthly summary cards

## Development

### Running in Development Mode
- Backend: `npm run dev` (uses nodemon for auto-reload)
- Frontend: `npm run dev` (uses Vite for hot module replacement)

### Building for Production
- Frontend: `npm run build` (creates optimized build in `dist/` folder)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env` file
- For MongoDB Atlas, use the connection string provided

### Port Already in Use
- Change the `PORT` in backend `.env` file
- Update the proxy URL in `frontend/vite.config.js` if needed

### CORS Issues
- CORS is enabled in the backend for all origins in development
- For production, configure CORS properly

## License

ISC

## Author

Employee Attendance System - Full Stack Application

