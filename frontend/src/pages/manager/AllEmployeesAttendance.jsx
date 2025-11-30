import { useEffect, useState } from 'react'
import api from '../../utils/api'
import './ManagerStyles.css'

function AllEmployeesAttendance() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    status: ''
  })

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filters.employeeId) params.employeeId = filters.employeeId
      if (filters.startDate) params.startDate = filters.startDate
      if (filters.endDate) params.endDate = filters.endDate
      if (filters.status) params.status = filters.status

      const response = await api.get('/attendance/all', { params })
      setAttendance(response.data)
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const handleApplyFilters = () => {
    fetchAttendance()
  }

  const handleResetFilters = () => {
    setFilters({
      employeeId: '',
      startDate: '',
      endDate: '',
      status: ''
    })
    setTimeout(() => {
      fetchAttendance()
    }, 100)
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

  return (
    <div className="manager-page-container">
      <div className="manager-page-background">
        <div className="manager-orb manager-orb-1"></div>
        <div className="manager-orb manager-orb-2"></div>
        <div className="manager-orb manager-orb-3"></div>
      </div>

      <div className="manager-content">
        <h1 className="manager-page-title">📋 All Employees Attendance</h1>

        {/* Filters */}
        <div className="enhanced-card">
          <h2>🔍 Filters</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="enhanced-input-group">
              <label>Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={filters.employeeId}
                onChange={handleFilterChange}
                placeholder="e.g., EMP001"
              />
            </div>
            <div className="enhanced-input-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="enhanced-input-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="enhanced-input-group">
              <label>Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half-day">Half Day</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button className="enhanced-button enhanced-button-primary" onClick={handleApplyFilters}>
              <span>Apply Filters</span>
            </button>
            <button className="enhanced-button enhanced-button-secondary" onClick={handleResetFilters}>
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="enhanced-card">
          <h2>📊 Attendance Records ({attendance.length})</h2>
          <div style={{ overflowX: 'auto' }}>
            {attendance.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
                <p style={{ fontSize: '18px', fontWeight: '600' }}>No attendance records found</p>
              </div>
            ) : (
              <table className="enhanced-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((att, idx) => (
                    <tr key={att._id} style={{ animationDelay: `${idx * 0.05}s` }}>
                      <td>{new Date(att.date).toLocaleDateString()}</td>
                      <td>{att.userId?.employeeId || '-'}</td>
                      <td>{att.userId?.name || '-'}</td>
                      <td>{att.userId?.department || '-'}</td>
                      <td>{att.checkInTime ? new Date(att.checkInTime).toLocaleString() : '-'}</td>
                      <td>{att.checkOutTime ? new Date(att.checkOutTime).toLocaleString() : '-'}</td>
                      <td>{att.totalHours || 0}</td>
                      <td>
                        <span className={`enhanced-badge badge-${att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : 'danger'}`}>
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllEmployeesAttendance
