import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts'

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
      navigate('/mark-attendance')
    } catch (error) {
      alert(error.response?.data?.message || 'Error checking in')
    }
  }

  const handleCheckOut = async () => {
    try {
      await api.post('/attendance/checkout')
      navigate('/mark-attendance')
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

  // Calculate additional stats
  const totalDays = dashboardData.monthStats.present + dashboardData.monthStats.absent + dashboardData.monthStats.late
  const attendancePercentage = totalDays > 0 ? Math.round(((dashboardData.monthStats.present + dashboardData.monthStats.late) / totalDays) * 100) : 0
  const averageHours = totalDays > 0 ? Math.round((dashboardData.monthStats.totalHours / totalDays) * 100) / 100 : 0

  // Pie chart data
  const pieData = [
    { name: 'Present', value: dashboardData.monthStats.present, color: '#28a745' },
    { name: 'Absent', value: dashboardData.monthStats.absent, color: '#dc3545' },
    { name: 'Late', value: dashboardData.monthStats.late, color: '#ffc107' }
  ].filter(item => item.value > 0)

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
        <div className="stat-card">
          <h3>Attendance %</h3>
          <div className="value" style={{ color: '#17a2b8' }}>{attendancePercentage}%</div>
        </div>
        <div className="stat-card">
          <h3>Avg Hours/Day</h3>
          <div className="value" style={{ color: '#6f42c1' }}>{averageHours}</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Recent Attendance Chart */}
        <div className="card" style={{ flex: 1, minWidth: '300px', boxShadow: '0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)' }}>
          <h2>Recent Attendance (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorHours)"
                strokeWidth={3}
                name="Hours Worked"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Distribution Pie Chart */}
        <div className="card" style={{
          flex: 1,
          minWidth: '300px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)',
          transform: 'perspective(1000px) rotateX(5deg)',
          transformStyle: 'preserve-3d'
        }}>
          <h2>Monthly Attendance Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                style={{
                  filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.4)) drop-shadow(-2px -2px 4px rgba(255,255,255,0.1))',
                  transform: 'translateZ(20px)'
                }}
                stroke="#fff"
                strokeWidth={2}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: `drop-shadow(2px 2px 4px ${entry.color}40)`,
                      transform: `scale(${1 + index * 0.05})`
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
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

