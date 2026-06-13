import { useNavigate } from 'react-router-dom'
import './Pricing.css'

function Pricing() {
  const navigate = useNavigate()

  return (
    <section className="pricing">

      <div className="eyebrow">Тарифи</div>

      <h1 className="pricing-title">
        Обери свій <em>план</em>
      </h1>

      <p className="pricing-sub">
        Ти використав усі безкоштовні генерації. Переходь на Pro щоб продовжити.
      </p>

      <div className="plans">

        {/* FREE PLAN */}
        <div className="plan-card">
          <div className="plan-name">Free</div>
          <div className="plan-price">$0<span>/міс</span></div>
          <ul className="plan-features">
            <li>✓ 5 генерацій резюме</li>
            <li>✓ Всі мови</li>
            <li>✓ PDF скачування</li>
            <li className="disabled">✗ Без водяного знаку</li>
            <li className="disabled">✗ Пріоритетна генерація</li>
          </ul>
          <button className="plan-btn current" disabled>
            Поточний план
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="plan-card featured">
          <div className="plan-badge">Популярний</div>
          <div className="plan-name">Pro</div>
          <div className="plan-price">$7<span>/міс</span></div>
          <ul className="plan-features">
            <li>✓ Необмежена кількість резюме</li>
            <li>✓ Всі мови</li>
            <li>✓ PDF скачування</li>
            <li>✓ Без водяного знаку</li>
            <li>✓ Пріоритетна генерація</li>
          </ul>
          <button className="plan-btn">
            Перейти на Pro
          </button>
        </div>

      </div>

      <button className="back-link" onClick={() => navigate('/dashboard')}>
        ← Повернутись до кабінету
      </button>

    </section>
  )
}

export default Pricing