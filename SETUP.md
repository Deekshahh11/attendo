# Quick Setup Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

## Step-by-Step Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

Seed database:
```bash
npm run seed
```

Start server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Default Login Credentials

### Manager
- Email: `manager@example.com`
- Password: `manager123`

### Employees
- Email: `john@example.com` (or jane@example.com, bob@example.com, etc.)
- Password: `employee123`

## Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Troubleshooting

1. **MongoDB not running**: Start MongoDB service
2. **Port already in use**: Change PORT in .env
3. **CORS errors**: Ensure backend is running on port 5000

