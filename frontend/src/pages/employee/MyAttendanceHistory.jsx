import { useEffect, useState } from 'react'
import api from '../../utils/api'
import './EmployeeStyles.css'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subDays, isWithinInterval } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function MyAttendanceHistory() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    fetchAttendance()
  }, [selectedMonth, selectedYear])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await api.get('/attendance/my-history', {
        params: { month: selectedMonth, year: selectedYear }
      })
      setAttendance(response.data)
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAttendanceForDate = (date) => {
    return attendance.find(a => isSameDay(new Date(a.date), date))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#d4edda'
      case 'absent': return '#f8d7da'
      case 'late': return '#fff3cd'
      case 'half-day': return '#ffeaa7'
      default: return '#f0f0f0'
    }
  }

  const monthStart = startOfMonth(new Date(selectedYear, selectedMonth - 1))
  const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth - 1))
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get first day of week for the month
  const firstDayOfWeek = monthStart.getDay()
  const emptyDays = Array(firstDayOfWeek).fill(null)

  // Recent 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse()
  const recentAttendance = last7Days.map(day => {
    const att = attendance.find(a => isSameDay(new Date(a.date), day))
    return {
      date: format(day, 'MMM dd'),
      status: att ? att.status : 'no-record',
      hours: att ? att.totalHours || 0 : 0
    }
  })

  // Pie chart data
  const statusCounts = attendance.reduce((acc, att) => {
    acc[att.status] = (acc[att.status] || 0) + 1
    return acc
  }, {})
  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: status === 'present' ? '#28a745' : status === 'late' ? '#ffc107' : status === 'absent' ? '#dc3545' : '#6c757d'
  }))

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="container employee-page-container">
      <h1>My Attendance History</h1>

      {/* Month/Year Selector */}
      <div className="card">
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {format(new Date(2000, month - 1), 'MMMM')}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendar View */}
        <div className="calendar-header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="calendar">
          {emptyDays.map((_, idx) => (
            <div key={`empty-${idx}`}></div>
          ))}
          {daysInMonth.map((day) => {
            const att = getAttendanceForDate(day)
            return (
              <div
                key={day.toISOString()}
                className={`calendar-day ${att ? att.status : ''}`}
                style={{
                  backgroundColor: att ? getStatusColor(att.status) : '#f0f0f0',
                  cursor: att ? 'pointer' : 'default'
                }}
                onClick={() => att && setSelectedDate(att)}
              >
                <div>{format(day, 'd')}</div>
                {att && (
                  <div style={{ fontSize: '10px', marginTop: '5px' }}>
                    {att.status === 'present' ? '✓' : att.status === 'late' ? 'L' : att.status === 'absent' ? '✗' : 'H'}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#d4edda', border: '1px solid #ddd' }}></div>
            <span>Present</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#f8d7da', border: '1px solid #ddd' }}></div>
            <span>Absent</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#fff3cd', border: '1px solid #ddd' }}></div>
            <span>Late</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#ffeaa7', border: '1px solid #ddd' }}></div>
            <span>Half Day</span>
          </div>
        </div>
      </div>

      {/* Recent Attendance Graph */}
      <div className="card">
        <h2>Recent Attendance (Last 7 Days)</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px', height: '300px' }}>
            <h3>Daily Hours</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 1, minWidth: '300px', height: '300px' }}>
            <h3>Status Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
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
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="card">
          <h2>Attendance Details - {format(new Date(selectedDate.date), 'MMMM d, yyyy')}</h2>
          <table className="table">
            <tbody>
              <tr>
                <td><strong>Date</strong></td>
                <td>{format(new Date(selectedDate.date), 'MMMM d, yyyy')}</td>
              </tr>
              <tr>
                <td><strong>Status</strong></td>
                <td>
                  <span className={`badge badge-${selectedDate.status === 'present' ? 'success' : selectedDate.status === 'late' ? 'warning' : 'danger'}`}>
                    {selectedDate.status}
                  </span>
                </td>
              </tr>
              <tr>
                <td><strong>Check In</strong></td>
                <td>{selectedDate.checkInTime ? new Date(selectedDate.checkInTime).toLocaleString() : 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Check Out</strong></td>
                <td>{selectedDate.checkOutTime ? new Date(selectedDate.checkOutTime).toLocaleString() : 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Total Hours</strong></td>
                <td>{selectedDate.totalHours || 0} hours</td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-secondary" onClick={() => setSelectedDate(null)} style={{ marginTop: '15px' }}>
            Close
          </button>
        </div>
      )}

      {/* Table View */}
      <div className="card">
        <h2>Attendance List</h2>
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
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No attendance records found</td>
              </tr>
            ) : (
              attendance.map((att) => (
                <tr key={att._id} onClick={() => setSelectedDate(att)} style={{ cursor: 'pointer' }}>
                  <td>{format(new Date(att.date), 'MMM d, yyyy')}</td>
                  <td>{att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString() : '-'}</td>
                  <td>{att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString() : '-'}</td>
                  <td>{att.totalHours || 0}</td>
                  <td>
                    <span className={`badge badge-${att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : 'danger'}`}>
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyAttendanceHistory

