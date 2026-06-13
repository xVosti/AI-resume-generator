import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'
/* import { useGoogleReCaptcha } from 'react-google-recaptcha-v3' */

function Auth() {
  console.log('API URL:', import.meta.env.VITE_API_URL)
  /* const { executeRecaptcha } = useGoogleReCaptcha() */
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('login')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Перевірка email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Валідація перед реєстрацією
  const validateRegister = () => {
  if (name.trim().length < 2) {
    return 'Ім\'я має містити мінімум 2 символи'
  }
  if (!isValidEmail(email)) {
    return 'Введіть коректний email'
  }
  if (password.length < 6) {
    return 'Пароль має містити мінімум 6 символів'
  }
  if (!/\d/.test(password)) {
    return 'Пароль має містити хоча б одну цифру'
  }
  return null
}

  // Валідація перед входом
  const validateLogin = () => {
    if (!isValidEmail(email)) {
      return 'Введіть коректний email'
    }
    if (password.length === 0) {
      return 'Введіть пароль'
    }
    return null
  }

  const handleRegister = async () => {
    /* const token = await executeRecaptcha('register') */
    const validationError = validateRegister()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!data.success) throw new Error(data.message)

      if (data.session) {
        localStorage.setItem('token', data.session.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      navigate('/dashboard')

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    /* const token = await executeRecaptcha('register') */
    const validationError = validateLogin()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!data.success) throw new Error(data.message)

      localStorage.setItem('token', data.session.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))

      navigate('/dashboard')

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-logo">Resume<em>AI</em></div>
        <p className="auth-hint">Резюме зберігаються в акаунті</p>

        <div className="auth-tabs">
          <button
            className={activeTab === 'login' ? 'tab active' : 'tab'}
            onClick={() => { setActiveTab('login'); setError('') }}
          >
            Увійти
          </button>
          <button
            className={activeTab === 'register' ? 'tab active' : 'tab'}
            onClick={() => { setActiveTab('register'); setError('') }}
          >
            Реєстрація
          </button>
        </div>

        {error && (
          <div className="error-msg">{error}</div>
        )}

        {activeTab === 'login' && (
          <div className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="ivan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="auth-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Завантаження...' : 'Увійти'}
            </button>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="auth-form">
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
              <label>Email</label>
              <input
                type="email"
                placeholder="ivan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                placeholder="мінімум 6 символів"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="auth-btn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Завантаження...' : 'Створити акаунт'}
            </button>
          </div>
        )}

        <div className="or-row">або</div>

        <button className="google-btn">
          <svg width="15" height="15" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Продовжити з Google
        </button>

      </div>
    </div>
  )
}

export default Auth