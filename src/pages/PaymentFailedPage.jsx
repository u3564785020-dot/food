import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './PaymentFailedPage.css'

const PaymentFailedPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  
  const orderData = location.state?.orderData || {}

  const handleRetry = () => {
    navigate('/payment', { state: { orderData } })
  }

  const handleHome = () => {
    navigate('/')
  }

  return (
    <div className="payment-failed-page">
      <div className="payment-failed-container">
        <div className="payment-failed-header">
          <div className="failed-icon">❌</div>
          <h1>{t('paymentFailed')}</h1>
        </div>

        <div className="payment-failed-content">
          <p className="failed-message">{t('paymentFailedMessage')}</p>
          
          <div className="order-summary">
            <h3>{t('orderSummary')}</h3>
            <div className="order-total">
              <span>{t('total')}:</span>
              <strong>{orderData.total?.toFixed(2)} THB</strong>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={handleRetry} className="retry-button">
              {t('tryAgain')}
            </button>
            <button onClick={handleHome} className="home-button">
              {t('backToHome')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailedPage
