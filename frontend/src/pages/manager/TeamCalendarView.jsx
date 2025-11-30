import { useEffect, useState } from 'react'
import api from '../../utils/api'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import './ManagerStyles.css'

function TeamCalendarView() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)
  const [dateAttendance, setDateAttendance] = useState([])

  useEffect(() => {
    fetchAttendance()
  }, [selectedMonth, selectedYear])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString().split('T')[0]
      const endDate = new Date(selectedYear, selectedMonth, 0).toISOString().split('T')[0]
      
      const response = await api.get('/attendance/all', {
        params: { startDate, endDate }
      })
      setAttendance(response.data)
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAttendanceForDate = (date) => {
    return attendance.filter(a => isSameDay(new Date(a.date), date))
  }

  const handleDateClick = (date) => {
    const dayAttendance = getAttendanceForDate(date)
    setDateAttendance(dayAttendance)
    setSelectedDate(date)
  }

  const getDateStatus = (date) => {
    const dayAttendance = getAttendanceForDate(date)
    if (dayAttendance.length === 0) return null
    
    const present = dayAttendance.filter(a => a.status === 'present' || a.status === 'late').length
    const total = dayAttendance.length
    
    if (present === total) return 'all-present'
    if (present === 0) return 'all-absent'
    return 'partial'
  }

  const monthStart = startOfMonth(new Date(selectedYear, selectedMonth - 1))
  const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth - 1))
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const firstDayOfWeek = monthStart.getDay()
  const emptyDays = Array(firstDayOfWeek).fill(null)

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
        <h1 className="manager-page-title">📅 Team Calendar View</h1>

        {/* Month/Year Selector */}
        <div className="enhanced-card">
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '25px' }}>
            <div className="enhanced-input-group" style={{ marginBottom: 0, flex: 1 }}>
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
            <div className="enhanced-input-group" style={{ marginBottom: 0, flex: 1 }}>
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

          {/* Calendar */}
          <div className="enhanced-calendar-header">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="enhanced-calendar">
            {emptyDays.map((_, idx) => (
              <div key={`empty-${idx}`}></div>
            ))}
            {daysInMonth.map((day) => {
              const status = getDateStatus(day)
              const dayAttendance = getAttendanceForDate(day)
              const presentCount = dayAttendance.filter(a => a.status === 'present' || a.status === 'late').length
              
              return (
                <div
                  key={day.toISOString()}
                  className={`enhanced-calendar-day ${status || ''}`}
                  style={{
                    cursor: dayAttendance.length > 0 ? 'pointer' : 'default'
                  }}
                  onClick={() => dayAttendance.length > 0 && handleDateClick(day)}
                >
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{format(day, 'd')}</div>
                  {dayAttendance.length > 0 && (
                    <div style={{ fontSize: '9px', marginTop: '2px', fontWeight: '600' }}>
                      {presentCount}/{dayAttendance.length}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: '25px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }}>
              <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)', border: '2px solid #28a745', borderRadius: '6px' }}></div>
              <span style={{ fontWeight: '600' }}>All Present</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }}>
              <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)', border: '2px solid #dc3545', borderRadius: '6px' }}></div>
              <span style={{ fontWeight: '600' }}>All Absent</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }}>
              <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)', border: '2px solid #ffc107', borderRadius: '6px' }}></div>
              <span style={{ fontWeight: '600' }}>Partial</span>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && dateAttendance.length > 0 && (
          <div className="enhanced-card" style={{ animation: 'cardSlideUp 0.5s ease-out' }}>
            <h2>📋 Attendance Details - {format(selectedDate, 'MMMM d, yyyy')}</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="enhanced-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dateAttendance.map((att, idx) => (
                    <tr key={att._id} style={{ animationDelay: `${idx * 0.05}s` }}>
                      <td>{att.userId?.employeeId || '-'}</td>
                      <td>{att.userId?.name || '-'}</td>
                      <td>{att.userId?.department || '-'}</td>
                      <td>{att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString() : '-'}</td>
                      <td>{att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString() : '-'}</td>
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
            <button 
              className="enhanced-button enhanced-button-secondary" 
              onClick={() => setSelectedDate(null)} 
              style={{ marginTop: '20px' }}
            >
              <span>Close</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamCalendarView
