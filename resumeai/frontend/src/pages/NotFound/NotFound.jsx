import { useNavigate } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="notfound">
      <div className="notfound-code">404</div>
      <h1 className="notfound-title">Сторінку не знайдено</h1>
      <p className="notfound-text">
        Можливо, вона була видалена або ви ввели неправильну адресу.
      </p>
      <button className="btn-dark" onClick={() => navigate('/')}>
        ← На головну
      </button>
    </div>
  )
}

export default NotFound