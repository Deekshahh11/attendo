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
        <h1 className="manager-page-title" style={{ textAlign: 'center', width: '100%' }}>👤 Profile</h1>

        <div className="enhanced-card" style={{
          maxWidth: '500px',
          margin: '0 auto',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'rotateY(5deg) rotateX(5deg) scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 15px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: 'white',
              boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
              animation: 'iconPulse 2s ease-in-out infinite',
              transform: 'translateZ(20px)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{
              fontSize: '22px',
              margin: '0 0 3px 0',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {user.name}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              {user.role === 'manager' ? 'Manager' : 'Employee'}
            </p>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              transform: 'translateZ(10px)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateZ(15px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateZ(10px)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
                    Email
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {user.email}
                  </div>
                </div>
                <div style={{ fontSize: '18px' }}>📧</div>
              </div>
            </div>

            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              transform: 'translateZ(10px)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateZ(15px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateZ(10px)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
                    Employee ID
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {user.employeeId}
                  </div>
                </div>
                <div style={{ fontSize: '18px' }}>🆔</div>
              </div>
            </div>

            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              transform: 'translateZ(10px)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateZ(15px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateZ(10px)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
                    Department
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {user.department}
                  </div>
                </div>
                <div style={{ fontSize: '18px' }}>🏢</div>
              </div>
            </div>

            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              transform: 'translateZ(10px)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateZ(15px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateZ(10px)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
                    Role
                  </div>
                  <div>
                    <span className={`enhanced-badge badge-${user.role === 'manager' ? 'info' : 'success'}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '18px' }}>👔</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
