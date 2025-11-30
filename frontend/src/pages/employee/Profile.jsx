import { useSelector } from 'react-redux'
import '../manager/ManagerStyles.css'

function Profile() {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
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
        <h1 className="manager-page-title">👤 Profile</h1>

        <div className="enhanced-card">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: 'white',
              boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
              animation: 'iconPulse 2s ease-in-out infinite'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{
              fontSize: '28px',
              margin: '0 0 5px 0',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {user.name}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
              {user.role === 'manager' ? 'Manager' : 'Employee'}
            </p>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(102, 126, 234, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>
                    Email
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                    {user.email}
                  </div>
                </div>
                <div style={{ fontSize: '24px' }}>📧</div>
              </div>
            </div>

            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(102, 126, 234, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>
                    Employee ID
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                    {user.employeeId}
                  </div>
                </div>
                <div style={{ fontSize: '24px' }}>🆔</div>
              </div>
            </div>

            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(102, 126, 234, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>
                    Department
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                    {user.department}
                  </div>
                </div>
                <div style={{ fontSize: '24px' }}>🏢</div>
              </div>
            </div>

            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(102, 126, 234, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>
                    Role
                  </div>
                  <div>
                    <span className={`enhanced-badge badge-${user.role === 'manager' ? 'info' : 'success'}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '24px' }}>👔</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
