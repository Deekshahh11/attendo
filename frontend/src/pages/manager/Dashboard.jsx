import { useEffect, useState } from 'react'
import api from '../../utils/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './ManagerStyles.css'

function ManagerDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/manager')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="manager-page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="manager-page-container">
        <div className="manager-content">
          <div className="enhanced-card">
            <p>Error loading dashboard</p>
          </div>
        </div>
      </div>
    )
  }

  // Prepare department data for pie chart
  const departmentPieData = Object.entries(dashboardData.departmentStats).map(([dept, stats]) => ({
    name: dept,
    value: stats.present + stats.absent + stats.late || stats.total || 0
  }))

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#ff6b6b']

  return (
    <div className="manager-page-container">
      <div className="manager-page-background">
        <div className="manager-orb manager-orb-1"></div>
        <div className="manager-orb manager-orb-2"></div>
        <div className="manager-orb manager-orb-3"></div>
      </div>

      <div className="manager-content">
        <h1 className="manager-page-title">📊 Manager Dashboard</h1>

        {/* Overview Stats */}
        <div className="enhanced-stats-grid">
          <div className="enhanced-stat-card" style={{ animationDelay: '0.1s' }}>
            <h3>Total Employees</h3>
            <div className="stat-value" style={{ color: '#667eea' }}>{dashboardData.totalEmployees}</div>
          </div>
          <div className="enhanced-stat-card" style={{ animationDelay: '0.2s' }}>
            <h3>Present Today</h3>
            <div className="stat-value" style={{ color: '#28a745' }}>{dashboardData.todayStats.present}</div>
          </div>
          <div className="enhanced-stat-card" style={{ animationDelay: '0.3s' }}>
            <h3>Absent Today</h3>
            <div className="stat-value" style={{ color: '#dc3545' }}>{dashboardData.todayStats.absent}</div>
          </div>
          <div className="enhanced-stat-card" style={{ animationDelay: '0.4s' }}>
            <h3>Late Today</h3>
            <div className="stat-value" style={{ color: '#ffc107' }}>{dashboardData.todayStats.late}</div>
          </div>
        </div>

        {/* Charts Side by Side */}
        <div className="charts-container">
          {/* Weekly Trend Chart - Bar Chart */}
          <div className="enhanced-card" style={{ animationDelay: '0.5s' }}>
            <h2>📈 Weekly Attendance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="present" fill="#28a745" name="Present" radius={[8, 8, 0, 0]} />
                <Bar dataKey="absent" fill="#dc3545" name="Absent" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department-wise Attendance - Pie Chart */}
          <div className="enhanced-card" style={{ animationDelay: '0.6s' }}>
            <h2>🥧 Department-wise Attendance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {departmentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Absent Employees Today */}
        <div className="enhanced-card" style={{ animationDelay: '0.7s' }}>
          <h2>👥 Absent Employees Today</h2>
          {dashboardData.absentEmployeesToday.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#28a745' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>All employees are present today!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="enhanced-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.absentEmployeesToday.map((emp, idx) => (
                    <tr key={emp.id} style={{ animationDelay: `${idx * 0.1}s` }}>
                      <td>{emp.employeeId}</td>
                      <td>{emp.name}</td>
                      <td>{emp.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard
