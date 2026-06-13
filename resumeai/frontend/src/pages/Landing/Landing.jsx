import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Landing.css'

function Landing() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [experience, setExperience] = useState('')
  const [skills, setSkills] = useState('')
  const [style, setStyle] = useState('Класичне')
  const [language, setLanguage] = useState('Українська')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/auth')
      return
    }

    try {
      setLoading(true)
      setError('')

      const user = JSON.parse(localStorage.getItem('user'))

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resume/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          position,
          experience,
          skills,
          style,
          language,
          userId: user.id
        })
      })

      const data = await response.json()

      if (!data.success) {
        if (data.limitReached) {
          navigate('/pricing')
          return
        }
      throw new Error(data.message)
      }

      // Зберігаємо і переходимо на сторінку резюме
      localStorage.setItem('generatedResume', data.resume)
      navigate('/resume')

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="hero">

      <div className="eyebrow">ШІ генерація · 5 мов</div>

      <h1 className="hero-title">
        Резюме будь-якою<br />
        <em>мовою</em> за 5 секунд
      </h1>

      <p className="hero-sub">
        Заповни форму — отримай готове PDF. Українська, англійська, іспанська, німецька, польська.
      </p>

      <div className="card">

        <div className="lang-row">
          {['🇺🇦 УКР', '🇬🇧 ENG', '🇪🇸 ESP', '🇩🇪 DEU', '🇵🇱 POL'].map((lang, i) => {
            const langNames = ['Українська', 'Англійська', 'Іспанська', 'Німецька', 'Польська']
            return (
              <button
                key={i}
                className={language === langNames[i] ? 'lang-pill active' : 'lang-pill'}
                onClick={() => setLanguage(langNames[i])}
              >
                {lang}
              </button>
            )
          })}
        </div>

        <div className="divider"></div>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label>Ім'я</label>
            <input
              type="text"
              placeholder="Іван Петренко"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Посада</label>
            <input
              type="text"
              placeholder="Frontend Dev"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Досвід</label>
          <textarea
            rows="3"
            placeholder="Твій досвід, проекти, досягнення..."
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Навички</label>
            <input
              type="text"
              placeholder="React, Node.js..."
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Стиль</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option>Класичне</option>
              <option>Сучасне</option>
              <option>Мінімальне</option>
            </select>
          </div>
        </div>

        <button
          className="gen-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? 'Генеруємо...' : 'Згенерувати резюме →'}
        </button>

        <p className="card-foot">Потрібна реєстрація · Безкоштовно</p>

      </div>

      <div className="trust-row">
        <div className="trust-item"><span className="dot"></span>5 мов</div>
        <div className="trust-item"><span className="dot"></span>PDF одразу</div>
        <div className="trust-item"><span className="dot"></span>Історія збережена</div>
        <div className="trust-item"><span className="dot"></span>Безкоштовно</div>
      </div>

    </section>
  )
}

export default Landing