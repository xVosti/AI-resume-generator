import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (!token || !savedUser) {
      navigate('/auth')
      return
    }

    const userData = JSON.parse(savedUser)
    setUser(userData)

    fetchResumes(userData.id)
  }, [])

  const fetchResumes = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resume/${userId}`)
      const data = await response.json()

      if (data.success) {
        setResumes(data.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleView = (resume) => {
    localStorage.setItem('generatedResume', resume.content)
    navigate('/resume')
  }

  // Форматуємо дату
  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Сьогодні, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    }
    if (diffDays === 1) return 'Вчора'
    return `${diffDays} дні тому`
  }

  // Мапа мов на прапорці
  const langFlags = {
    'Українська': '🇺🇦 UA',
    'Англійська': '🇬🇧 EN',
    'Іспанська': '🇪🇸 ES',
    'Німецька': '🇩🇪 DE',
    'Польська': '🇵🇱 PL'
  }

  const uniqueLanguages = [...new Set((resumes || []).map(r => r.language))]

  return (
    <div className="dashboard">

      <aside className="sidebar">
        <div className="sb-logo">Resume<em>AI</em></div>

        <nav className="sb-nav">
          <div className="sb-item active">
            <span>📄</span> Мої резюме
          </div>
          <div className="sb-item" onClick={() => navigate('/')}>
            <span>✦</span> Створити нове
          </div>
          <div className="sb-item">
            <span>👤</span> Профіль
          </div>
        </nav>

        <div className="sb-divider"></div>

        <div className="sb-item" onClick={() => navigate('/pricing')}>
            <span>⭐</span> Pro план
        </div>    
        <div className="sb-item" onClick={handleLogout}>
          <span>→</span> Вийти
        </div>

        <div className="sb-user">
          <div className="sb-avatar">
            {user?.user_metadata?.name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="sb-name">
              {user?.user_metadata?.name || user?.email?.split('@')[0]}
            </div>
            <div className="sb-plan">Free</div>
          </div>
        </div>
      </aside>

      <main className="dash-main">

        <div className="dash-top">
          <div>
            <h1 className="dash-title">Мої резюме</h1>
            <p className="dash-sub">Всі згенеровані документи</p>
          </div>
          <button className="btn-dark" onClick={() => navigate('/')}>+ Нове резюме</button>
        </div>

        <div className="plan-row">
          <div>
            <div className="plan-label">Free план</div>
            <div className="plan-desc">Використано {resumes.filter(r => new Date(r.created_at) > new Date(Date.now() - 24*60*60*1000)).length} з 5 генерацій за 24г</div>
          </div>
          <div className="plan-progress">
            <div className="progress-labels">
              <span>{resumes.filter(r => new Date(r.created_at) > new Date(Date.now() - 24*60*60*1000)).length} / 5</span>
              <span className="upgrade" onClick={() => navigate('/pricing')}>Upgrade →</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${((resumes?.length || 0) / 10) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-label">Резюме</div>
            <div className="stat-num">{resumes?.length || 0}</div>
            <div className="stat-hint">Всього</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Мови</div>
            <div className="stat-num">{uniqueLanguages.length}</div>
            <div className="stat-hint">{uniqueLanguages.join(', ') || '—'}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Останнє</div>
            <div className="stat-num small">
              {resumes?.[0] ? formatDate(resumes[0].created_at).split(',')[0] : '—'}
            </div>
            <div className="stat-hint">
              {resumes?.[0] ? formatDate(resumes[0].created_at).split(',')[1] || '' : ''}
            </div>
          </div>
        </div>

        <div className="sec-label">Історія генерацій</div>

        {loading ? (
          <p style={{ color: '#888680', fontSize: '14px' }}>Завантаження...</p>
        ) : !resumes || resumes.length === 0 ? (
          <div className="empty-state">
            <p>У тебе ще немає резюме.</p>
            <button className="btn-dark" onClick={() => navigate('/')}>Створити перше резюме</button>
          </div>
        ) : (
          <div className="history-list">
            {resumes.map((resume) => (
              <div className="history-item" key={resume.id} onClick={() => handleView(resume)}>
                <div className="h-icon">📄</div>
                <div className="h-info">
                  <div className="h-name">{resume.name} — {resume.position}</div>
                  <div className="h-meta">
                    <span>{formatDate(resume.created_at)}</span>
                    <span className="sep">·</span>
                    <span>{resume.style}</span>
                  </div>
                </div>
                <div className="lang-tag">{langFlags[resume.language] || resume.language}</div>
                <div className="h-actions">
                  <button className="act-btn" title="Переглянути" onClick={(e) => { e.stopPropagation(); handleView(resume) }}>👁</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

export default Dashboard