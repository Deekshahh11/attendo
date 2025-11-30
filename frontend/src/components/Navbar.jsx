import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">Attendo</div>
        <div className="navbar-links">
          {user?.role === 'employee' && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/mark-attendance">Mark Attendance</Link>
              <Link to="/my-attendance">My Attendance</Link>
            </>
          )}
          {user?.role === 'manager' && (
            <>
              <Link to="/manager/dashboard">Dashboard</Link>
              <Link to="/manager/attendance">All Attendance</Link>
              <Link to="/manager/calendar">Calendar View</Link>
              <Link to="/manager/reports">Reports</Link>
            </>
          )}
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

