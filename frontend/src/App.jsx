import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './store/slices/authSlice'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import EmployeeDashboard from './pages/employee/Dashboard'
import MarkAttendance from './pages/employee/MarkAttendance'
import MyAttendanceHistory from './pages/employee/MyAttendanceHistory'
import Profile from './pages/employee/Profile'
import ManagerDashboard from './pages/manager/Dashboard'
import AllEmployeesAttendance from './pages/manager/AllEmployeesAttendance'
import TeamCalendarView from './pages/manager/TeamCalendarView'
import Reports from './pages/manager/Reports'

function RoleBasedRedirect() {
  const { user } = useSelector((state) => state.auth)
  
  if (user?.role === 'manager') {
    return <Navigate to="/manager/dashboard" replace />
  }
  return <Navigate to="/dashboard" replace />
}

function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated || localStorage.getItem('token')) {
      dispatch(getMe())
    }
  }, [dispatch, isAuthenticated])

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <RoleBasedRedirect />
            </PrivateRoute>
          }
        />
        
        {/* Employee Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['employee']}>
              <Navbar />
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/mark-attendance"
          element={
            <PrivateRoute allowedRoles={['employee']}>
              <Navbar />
              <MarkAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-attendance"
          element={
            <PrivateRoute allowedRoles={['employee']}>
              <Navbar />
              <MyAttendanceHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={['employee', 'manager']}>
              <Navbar />
              <Profile />
            </PrivateRoute>
          }
        />
        
        {/* Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={
            <PrivateRoute allowedRoles={['manager']}>
              <Navbar />
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/attendance"
          element={
            <PrivateRoute allowedRoles={['manager']}>
              <Navbar />
              <AllEmployeesAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/calendar"
          element={
            <PrivateRoute allowedRoles={['manager']}>
              <Navbar />
              <TeamCalendarView />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/reports"
          element={
            <PrivateRoute allowedRoles={['manager']}>
              <Navbar />
              <Reports />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App

