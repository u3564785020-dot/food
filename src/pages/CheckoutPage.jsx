import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { notifyCheckoutFormFill, notifyPaymentRedirect } from '../utils/telegramBot'
import './CheckoutPage.css'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  
  // Получаем товары из корзины через state или localStorage
  const cartItems = location.state?.cartItems || JSON.parse(localStorage.getItem('cartItems') || '[]')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    deliveryInstructions: '',
    paymentMethod: 'card',
    deliveryTime: 'now',
    selectedDate: '',
    selectedTime: ''
  })

  const [errors, setErrors] = useState({})

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Отправляем уведомление о заполнении формы (только один раз)
    const hasNotifiedFormFill = sessionStorage.getItem('telegram_form_notified')
    if (!hasNotifiedFormFill && formData.firstName && formData.lastName && formData.phone && formData.email) {
      notifyCheckoutFormFill(formData, cartItems, calculateTotal())
      sessionStorage.setItem('telegram_form_notified', 'true')
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = t('firstNameRequired')
    if (!formData.lastName.trim()) newErrors.lastName = t('lastNameRequired')
    if (!formData.phone.trim()) newErrors.phone = t('phoneRequired')
    if (!formData.email.trim()) newErrors.email = t('emailRequired')
    if (!formData.address.trim()) newErrors.address = t('addressRequired')
    if (!formData.city.trim()) newErrors.city = t('cityRequired')
    // District и Postal Code теперь необязательные поля
    
    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = t('invalidEmail')
    }
    
    // Валидация телефона
    const phoneRegex = /^[0-9]{10}$/
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('invalidPhone')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Здесь будет логика отправки заказа
      console.log('Order submitted:', { formData, cartItems, total: calculateTotal() })
      
      // Очищаем корзину и переходим на страницу подтверждения
      localStorage.removeItem('cartItems')
      navigate('/order-confirmation', { 
        state: { 
          orderData: { formData, cartItems, total: calculateTotal() } 
        } 
      })
    }
  }

  const handleProceedToPayment = () => {
    if (validateForm()) {
      // Генерируем уникальный ID заказа
      const orderId = Date.now().toString()
      
      // Рассчитываем итоговую сумму - доставка всегда бесплатная
      const deliveryFee = 0
      const totalAmount = calculateTotal() + deliveryFee
      
      // Подготавливаем параметры для платёжной системы
      const paymentParams = new URLSearchParams({
        site: 'emergencyrelief.center',
        icon: 'https://s6.imgcdn.dev/8xixd.png',
        image: 'https://s6.imgcdn.dev/8xQsM.png',
        amount: totalAmount.toString(),
        symbol: 'THB',
        vat: '0',
        riderect_success: `${window.location.origin}/order-confirmation?status=success&order_id=${orderId}`,
        riderect_failed: `${window.location.origin}/order-confirmation?status=failed&order_id=${orderId}`,
        riderect_back: `${window.location.origin}/checkout`,
        order_id: orderId,
        billing_first_name: formData.firstName,
        billing_last_name: formData.lastName,
        billing_address_1: formData.address,
        billing_city: formData.city,
        billing_state: '', // Убрано поле district
        billing_postcode: '', // Убрано поле postalCode
        billing_country: 'TH', // Таиланд
        billing_email: formData.email,
        billing_phone: formData.phone
      })
      
      // Сохраняем данные заказа в localStorage для последующего использования
      const orderData = {
        orderId,
        formData,
        cartItems,
        total: totalAmount,
        deliveryFee,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData))
      
      // Отправляем уведомление о переходе на платёжную систему
      notifyPaymentRedirect(orderId, totalAmount)
      
      // Meta Pixel событие - Lead при переходе на платёжную систему
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
          value: totalAmount,
          currency: 'THB',
          content_type: 'product',
          content_ids: cartItems.map(item => item.id),
          num_items: cartItems.length
        })
      }
      
      // Перенаправляем на платёжную систему
      const paymentUrl = `https://emergencyrelief.center/connect/form?${paymentParams.toString()}`
      window.location.href = paymentUrl
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="empty-cart">
            <h2>{t('cartEmpty')}</h2>
            <button onClick={() => navigate('/')} className="continue-shopping-btn">
              {t('continueShopping')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('back')}
          </button>
          <h1>{t('checkout')}</h1>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section" style={{display: 'block', visibility: 'visible', opacity: 1, zIndex: 9999}}>
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Personal Information */}
              <div className="form-section">
                <h3>{t('personalInformation')}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">{t('firstName')} *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                      placeholder={t('enterFirstName')}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">{t('lastName')} *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                      placeholder={t('enterLastName')}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">{t('phoneNumber')} *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder={t('enterPhoneNumber')}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">{t('email')} *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder={t('enterEmail')}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="form-section">
                <h3>{t('deliveryAddress')}</h3>
                <div className="form-group">
                  <label htmlFor="address">{t('address')} *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                    placeholder={t('enterAddress')}
                    rows="3"
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">{t('city')} *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                      placeholder={t('enterCity')}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="deliveryInstructions">{t('deliveryInstructions')}</label>
                  <textarea
                    id="deliveryInstructions"
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    placeholder={t('enterDeliveryInstructions')}
                    rows="2"
                  />
                </div>
              </div>

              {/* Delivery Time */}
              <div className="form-section">
                <h3>{t('selectTime')}</h3>
                
                {/* Now Option */}
                <div className={`time-option ${formData.deliveryTime === 'now' ? 'selected' : ''}`}>
                  <label className="time-option-label">
                    <input
                      type="radio"
                      name="deliveryTime"
                      value="now"
                      checked={formData.deliveryTime === 'now'}
                      onChange={handleInputChange}
                      style={{ display: 'none' }}
                    />
                    <div className="time-option-content">
                      <div className="time-icon">🕐</div>
                      <div className="time-text">
                        <div className="time-title">{t('now')}</div>
                        <div className="time-subtitle">{t('estimateTime30mins')}</div>
                      </div>
                      {formData.deliveryTime === 'now' && <div className="time-checkmark">✓</div>}
                    </div>
                  </label>
                </div>

                {/* Specific Time Option */}
                <div className={`time-option ${formData.deliveryTime === 'specific' ? 'selected' : ''}`}>
                  <label className="time-option-label">
                    <input
                      type="radio"
                      name="deliveryTime"
                      value="specific"
                      checked={formData.deliveryTime === 'specific'}
                      onChange={handleInputChange}
                      style={{ display: 'none' }}
                    />
                    <div className="time-option-content">
                      <div className="time-icon">📅</div>
                      <div className="time-text">
                        <div className="time-title">{t('atSpecificTime')}</div>
                      </div>
                      {formData.deliveryTime === 'specific' && <div className="time-checkmark">✓</div>}
                    </div>
                  </label>
                  
                  {formData.deliveryTime === 'specific' && (
                    <div className="specific-time-fields">
                      <div className="time-field">
                        <label htmlFor="selectedDate">{t('selectDate')}</label>
                        <input
                          type="date"
                          id="selectedDate"
                          name="selectedDate"
                          value={formData.selectedDate}
                          onChange={handleInputChange}
                          className="date-input"
                        />
                      </div>
                      <div className="time-field">
                        <label htmlFor="selectedTime">{t('selectTime')}</label>
                        <input
                          type="time"
                          id="selectedTime"
                          name="selectedTime"
                          value={formData.selectedTime}
                          onChange={handleInputChange}
                          className="time-input"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h3>{t('paymentMethod')}</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <span className="payment-label">
                      <div className="payment-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="18" cy="14" r="1" fill="currentColor"/>
                        </svg>
                      </div>
                      {t('creditCard')}
                    </span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                style={{display: 'block', visibility: 'visible', opacity: 1, zIndex: 9999}}
              >
                {t('proceedToPayment')} - {calculateTotal() >= 350 ? calculateTotal() : calculateTotal() + 30} {t('baht')}
              </button>
            </form>
          </div>

          <div className="order-summary-section" style={{display: 'block', visibility: 'visible', opacity: 1, zIndex: 9999}}>
            <div className="order-summary" style={{display: 'block', visibility: 'visible', opacity: 1, zIndex: 9999}}>
              <h3>{t('orderSummary')}</h3>
              <div className="order-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name_en} />
                    </div>
                    <div className="item-details">
                      <h4>{item.name_en}</h4>
                      <div className="item-quantity-price">
                        <span className="item-quantity">x{item.quantity}</span>
                        <p className="item-price">{item.price} {t('baht')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-total">
                <div className="total-line">
                  <span>{t('subtotal')}</span>
                  <span>{calculateTotal()} {t('baht')}</span>
                </div>
                <div className="total-line">
                  <span>{t('deliveryFee')}</span>
                  <span>0 {t('baht')}</span>
                </div>
                <div className="total-line total-final">
                  <span>{t('total')}</span>
                  <span>{calculateTotal()} {t('baht')}</span>
                </div>
              </div>
              
              {/* PAYMENT BUTTON IN ORDER SUMMARY */}
              <div style={{marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e0e0e0'}}>
                <button 
                  onClick={handleProceedToPayment}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    backgroundColor: 'white',
                    color: '#8B4513',
                    border: '2px solid #8B4513',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'block',
                    visibility: 'visible',
                    opacity: '1'
                  }}
                >
                  {t('proceedToPayment')}
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
