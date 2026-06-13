import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')

  // Якщо немає токену — перекидаємо на вхід
  if (!token) {
    return <Navigate to="/auth" replace />
  }

  // Якщо є токен — показуємо сторінку
  return children
}

export default ProtectedRoute