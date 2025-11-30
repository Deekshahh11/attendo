import { useEffect, useState } from 'react'
import api from '../../utils/api'
import './EmployeeStyles.css'

function MarkAttendance() {
  const [todayStatus, setTodayStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetchTodayStatus()
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchTodayStatus = async () => {
    try {
      const response = await api.get('/attendance/today')
      setTodayStatus(response.data)
    } catch (error) {
      console.error('Error fetching today status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    try {
      setMessage('')
      const response = await api.post('/attendance/checkin')
      setMessage('Checked in successfully!')
      fetchTodayStatus()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error checking in')
    }
  }

  const handleCheckOut = async () => {
    try {
      setMessage('')
      const response = await api.post('/attendance/checkout')
      setMessage('Checked out successfully!')
      fetchTodayStatus()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error checking out')
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="container employee-page-container">
      <h1>Mark Attendance</h1>
      
      <div className="card">
        <h2>Today's Attendance</h2>
        
        {message && (
          <div className={message.includes('Error') ? 'error' : 'success'} style={{ marginBottom: '15px' }}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <p><strong>Date:</strong> {currentTime.toLocaleDateString()}</p>
          <div className="current-time-display">
            <p>{currentTime.toLocaleTimeString()}</p>
          </div>
          <p><strong>Status:</strong>{' '}
            <span className={`badge badge-${todayStatus?.status === 'present' ? 'success' : todayStatus?.status === 'late' ? 'warning' : 'danger'} ${message ? 'animate-pulse' : ''}`}>
              {todayStatus?.status?.toUpperCase() || 'NOT CHECKED IN'}
            </span>
          </p>
        </div>

        {todayStatus?.checkInTime && (
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Check In Time:</strong> {new Date(todayStatus.checkInTime).toLocaleString()}</p>
          </div>
        )}

        {todayStatus?.checkOutTime && (
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Check Out Time:</strong> {new Date(todayStatus.checkOutTime).toLocaleString()}</p>
            <p><strong>Total Hours:</strong> {todayStatus.totalHours || 0} hours</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          {!todayStatus?.checkedIn && (
            <button className="btn btn-success animate-bounce" onClick={handleCheckIn} style={{ fontSize: '18px', padding: '15px 30px' }}>
              🟢 Check In
            </button>
          )}
          {todayStatus?.checkedIn && !todayStatus?.checkedOut && (
            <button className="btn btn-danger animate-bounce" onClick={handleCheckOut} style={{ fontSize: '18px', padding: '15px 30px' }}>
              🔴 Check Out
            </button>
          )}
          {todayStatus?.checkedOut && (
            <p className="success animate-fade-in">🎉 You have completed your attendance for today!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarkAttendance

