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
    const confirmed = window.confirm('Are you sure you want to check out now?')
    if (!confirmed) return

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

        {/* Attendance Information Blocks */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '30px', maxWidth: '850px' }}>
          <div className="stat-card animate-fade-in-up" style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '15px',
            flex: '1 1 calc(50% - 7.5px)',
            minWidth: '200px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>Date</h3>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{currentTime.toLocaleDateString()}</div>
          </div>

          <div className="stat-card animate-fade-in-up" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '15px', flex: '1 1 calc(50% - 7.5px)', minWidth: '200px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>Current Time</h3>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{currentTime.toLocaleTimeString()}</div>
          </div>

          <div className="stat-card animate-fade-in-up" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '15px', flex: '1 1 calc(50% - 7.5px)', minWidth: '200px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>Status</h3>
            <div style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {todayStatus?.status?.toUpperCase() || 'NOT CHECKED IN'}
            </div>
          </div>

          {todayStatus?.checkInTime && (
            <div className="stat-card animate-fade-in-up" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '15px', flex: '1 1 calc(50% - 7.5px)', minWidth: '200px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>Check In Time</h3>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{new Date(todayStatus.checkInTime).toLocaleString()}</div>
            </div>
          )}

          {todayStatus?.checkOutTime && (
            <>
              <div className="stat-card animate-fade-in-up" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '15px', flex: '1 1 calc(50% - 7.5px)', minWidth: '200px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>Check Out Time</h3>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{new Date(todayStatus.checkOutTime).toLocaleString()}</div>
              </div>

              <div className="stat-card animate-fade-in-up" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '15px', flex: '1 1 calc(50% - 7.5px)', minWidth: '200px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>Total Hours</h3>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{todayStatus.totalHours || 0} hours</div>
              </div>
            </>
          )}
        </div>

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

