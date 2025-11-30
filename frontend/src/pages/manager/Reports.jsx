import { useState } from 'react'
import api from '../../utils/api'
import './ManagerStyles.css'

function Reports() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    employeeId: ''
  })
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const handleGenerateReport = async () => {
    if (!filters.startDate || !filters.endDate) {
      alert('Please select start and end dates')
      return
    }

    try {
      setLoading(true)
      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate
      }
      if (filters.employeeId) {
        params.employeeId = filters.employeeId
      }

      const response = await api.get('/attendance/all', { params })
      setAttendance(response.data)
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Error generating report')
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = async () => {
    if (!filters.startDate || !filters.endDate) {
      alert('Please select start and end dates')
      return
    }

    try {
      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate
      }
      if (filters.employeeId) {
        params.employeeId = filters.employeeId
      }

      const response = await api.get('/attendance/export', {
        params,
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `attendance_${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Error exporting CSV')
    }
  }

  return (
    <div className="manager-page-container">
      <div className="manager-page-background">
        <div className="manager-orb manager-orb-1"></div>
        <div className="manager-orb manager-orb-2"></div>
        <div className="manager-orb manager-orb-3"></div>
      </div>

      <div className="manager-content">
        <h1 className="manager-page-title">📊 Attendance Reports</h1>

        {/* Report Filters */}
        <div className="enhanced-card">
          <h2>📝 Generate Report</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="enhanced-input-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                required
              />
            </div>
            <div className="enhanced-input-group">
              <label>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                required
              />
            </div>
            <div className="enhanced-input-group">
              <label>Employee ID (Optional)</label>
              <input
                type="text"
                name="employeeId"
                value={filters.employeeId}
                onChange={handleFilterChange}
                placeholder="e.g., EMP001"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button 
              className="enhanced-button enhanced-button-primary" 
              onClick={handleGenerateReport} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>📈 Generate Report</span>
                </>
              )}
            </button>
            {attendance.length > 0 && (
              <button className="enhanced-button enhanced-button-success" onClick={handleExportCSV}>
                <span>💾 Export to CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Report Results */}
        {attendance.length > 0 && (
          <div className="enhanced-card" style={{ animation: 'cardSlideUp 0.5s ease-out' }}>
            <h2>📋 Report Results ({attendance.length} records)</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="enhanced-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((att, idx) => (
                    <tr key={att._id} style={{ animationDelay: `${idx * 0.03}s` }}>
                      <td>{new Date(att.date).toLocaleDateString()}</td>
                      <td>{att.userId?.employeeId || '-'}</td>
                      <td>{att.userId?.name || '-'}</td>
                      <td>{att.userId?.department || '-'}</td>
                      <td>{att.userId?.email || '-'}</td>
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
            </div>
          </div>
        )}

        {attendance.length === 0 && !loading && (
          <div className="enhanced-card">
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '64px', marginBottom: '15px' }}>📄</div>
              <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>No data to display</p>
              <p style={{ fontSize: '14px' }}>Please generate a report using the filters above</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports
