import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  // Перевіряємо чи є токен
  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <nav className="navbar">

      <div className="navbar-logo" onClick={() => navigate('/')}>
        Resume<em>AI</em>
      </div>

      <div className="navbar-links">
        {isLoggedIn ? (
          // Якщо залогінений — показуємо іконку профілю
          <button
            className="btn-dark"
            onClick={() => navigate('/dashboard')}
          >
            Кабінет
          </button>
        ) : (
          // Якщо не залогінений — Увійти і Почати
          <>
            <button
              className="btn-ghost"
              onClick={() => navigate('/auth')}
            >
              Увійти
            </button>
            <button
              className="btn-dark"
              onClick={() => navigate('/auth')}
            >
              Почати
            </button>
          </>
        )}
      </div>

    </nav>
  )
}

export default Navbar