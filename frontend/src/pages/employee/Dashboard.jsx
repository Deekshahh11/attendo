import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import './EmployeeStyles.css'

function EmployeeDashboard() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/employee')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    try {
      await api.post('/attendance/checkin')
      fetchDashboardData()
    } catch (error) {
      alert(error.response?.data?.message || 'Error checking in')
    }
  }

  const handleCheckOut = async () => {
    try {
      await api.post('/attendance/checkout')
      fetchDashboardData()
    } catch (error) {
      alert(error.response?.data?.message || 'Error checking out')
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!dashboardData) {
    return <div className="container">Error loading dashboard</div>
  }

  const chartData = dashboardData.recentAttendance.map(att => ({
    date: new Date(att.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    hours: att.totalHours || 0
  }))

  return (
    <div className="container employee-page-container">
      <h1>Employee Dashboard</h1>
      <p>Welcome, {user?.name}!</p>

      {/* Today's Status */}
      <div className="card">
        <h2>Today's Status</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '15px' }}>
          <div>
            <strong>Status:</strong>{' '}
            <span className={`badge badge-${dashboardData.todayStatus.status === 'present' ? 'success' : dashboardData.todayStatus.status === 'late' ? 'warning' : 'danger'}`}>
              {dashboardData.todayStatus.status.toUpperCase()}
            </span>
          </div>
          {dashboardData.todayStatus.checkInTime && (
            <div>
              <strong>Check In:</strong> {new Date(dashboardData.todayStatus.checkInTime).toLocaleTimeString()}
            </div>
          )}
          {dashboardData.todayStatus.checkOutTime && (
            <div>
              <strong>Check Out:</strong> {new Date(dashboardData.todayStatus.checkOutTime).toLocaleTimeString()}
            </div>
          )}
        </div>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          {!dashboardData.todayStatus.checkedIn && (
            <button className="btn btn-success" onClick={handleCheckIn}>
              Check In
            </button>
          )}
          {dashboardData.todayStatus.checkedIn && !dashboardData.todayStatus.checkedOut && (
            <button className="btn btn-danger" onClick={handleCheckOut}>
              Check Out
            </button>
          )}
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Present Days</h3>
          <div className="value" style={{ color: '#28a745' }}>{dashboardData.monthStats.present}</div>
        </div>
        <div className="stat-card">
          <h3>Absent Days</h3>
          <div className="value" style={{ color: '#dc3545' }}>{dashboardData.monthStats.absent}</div>
        </div>
        <div className="stat-card">
          <h3>Late Days</h3>
          <div className="value" style={{ color: '#ffc107' }}>{dashboardData.monthStats.late}</div>
        </div>
        <div className="stat-card">
          <h3>Total Hours</h3>
          <div className="value" style={{ color: '#007bff' }}>{dashboardData.monthStats.totalHours}</div>
        </div>
      </div>

      {/* Recent Attendance Chart */}
      <div className="card">
        <h2>Recent Attendance (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="hours" stroke="#8884d8" name="Hours Worked" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Attendance Table */}
      <div className="card">
        <h2>Recent Attendance</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentAttendance.map((att, idx) => (
              <tr key={idx}>
                <td>{new Date(att.date).toLocaleDateString()}</td>
                <td>{att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString() : '-'}</td>
                <td>{att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString() : '-'}</td>
                <td>{att.totalHours || 0}</td>
                <td>
                  <span className={`badge badge-${att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : 'danger'}`}>
                    {att.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeDashboard

