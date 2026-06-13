import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Resume.css'

function Resume() {
  const navigate = useNavigate()
  const [resume, setResume] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('generatedResume')
    if (!saved) {
      navigate('/')
      return
    }
    setResume(saved)
  }, [])

  // Рендеримо markdown правильно
  const renderLine = (line, i) => {
    if (line.startsWith('#### ')) return <h4 key={i} className="r-h4">{line.replace('#### ', '')}</h4>
    if (line.startsWith('### ')) return <h3 key={i} className="r-h3">{line.replace('### ', '')}</h3>
    if (line.startsWith('## ')) return <h2 key={i} className="r-h2">{line.replace('## ', '')}</h2>
    if (line.startsWith('# ')) return <h1 key={i} className="r-h1">{line.replace('# ', '')}</h1>

    if (line.trim() === '') return <div key={i} className="r-spacer"></div>

    // Замінюємо **text** на <strong>
    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ ')) {
      const text = line.replace(/^[-*+] /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return <li key={i} className="r-li" dangerouslySetInnerHTML={{ __html: text }} />
    }

    return <p key={i} className="r-p" dangerouslySetInnerHTML={{ __html: formatted }} />
  }

  return (
    <div className="resume-page">

      <div className="resume-topbar no-print">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Назад
        </button>
        <div className="resume-title">Ваше резюме готове</div>
        <button className="download-btn" onClick={() => window.print()}>
          ⬇ Скачати PDF
        </button>
      </div>

      <div className="resume-wrapper">
        <div className="resume-card" id="resume-content">
          {resume.split('\n').map((line, i) => renderLine(line, i))}
        </div>
      </div>

    </div>
  )
}

export default Resume