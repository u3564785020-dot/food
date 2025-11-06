import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { notifyPaymentReturn } from '../utils/telegramBot'
import { trackPageView, trackLead, trackCompleteRegistration } from '../utils/fbPixel'
import './OrderConfirmation.css'

const OrderConfirmation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const [orderData, setOrderData] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)
  
  useEffect(() => {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(location.search)
    const status = urlParams.get('status')
    const orderId = urlParams.get('order_id')
    
    setPaymentStatus(status)
    
    if (orderId) {
      // Пытаемся получить данные заказа из localStorage
      const savedOrderData = localStorage.getItem(`order_${orderId}`)
      if (savedOrderData) {
        setOrderData(JSON.parse(savedOrderData))
      }
      
      // Отправляем уведомление о возврате с платёжной системы
      if (status) {
        notifyPaymentReturn(orderId, status)
      }
    } else {
      // Если нет order_id, используем данные из state (старый способ)
      setOrderData(location.state?.orderData)
    }
  }, [location])

  // Отслеживание Facebook Pixel событий на странице подтверждения
  useEffect(() => {
    if (orderData) {
      const { total } = orderData
      const deliveryFee = 0 // Доставка всегда бесплатная
      const finalTotal = total + deliveryFee
      
      // Отслеживаем PageView
      trackPageView()
      
      // Отслеживаем Lead событие с реальной суммой заказа
      // (в оригинале было 5.00 USD, но лучше использовать реальную сумму)
      trackLead(finalTotal, 'THB')
      
      // Отслеживаем CompleteRegistration событие с реальной суммой заказа
      // (в оригинале было 10.00 USD, но лучше использовать реальную сумму)
      trackCompleteRegistration(finalTotal, 'THB')
    }
  }, [orderData])

  if (!orderData) {
    return (
      <div className="order-confirmation-page">
        <div className="order-confirmation-container">
          <div className="no-order-data">
            <h2>{t('noOrderData')}</h2>
            <button onClick={() => navigate('/')} className="back-to-home-btn">
              {t('backToHome')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { formData, cartItems, total } = orderData
  const deliveryFee = 0 // Доставка всегда бесплатная
  const finalTotal = total + deliveryFee

  // Определяем статус и сообщение в зависимости от результата платежа
  const isSuccess = paymentStatus === 'success'
  const isFailed = paymentStatus === 'failed'
  
  const getStatusMessage = () => {
    if (isSuccess) {
      return {
        title: t('paymentSuccessful'),
        message: t('paymentSuccessMessage'),
        icon: 'https://www.burgerking.co.th/img/ic-check-circle.svg'
      }
    } else if (isFailed) {
      return {
        title: t('paymentFailed'),
        message: t('paymentFailedMessage'),
        icon: 'https://www.burgerking.co.th/img/ic-error-circle.svg'
      }
    } else {
      return {
        title: t('orderConfirmed'),
        message: t('orderConfirmationMessage'),
        icon: 'https://www.burgerking.co.th/img/ic-check-circle.svg'
      }
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-container">
        <div className="confirmation-header">
          <div className={`status-icon ${isFailed ? 'error' : 'success'}`}>
            <img src={statusInfo.icon} alt={isSuccess ? "Success" : "Error"} />
          </div>
          <h1>{statusInfo.title}</h1>
          <p className="confirmation-message">{statusInfo.message}</p>
          {orderData.orderId && (
            <p className="order-id">Order ID: {orderData.orderId}</p>
          )}
        </div>

        <div className="confirmation-content">
          <div className="order-details-section">
            <h3>{t('orderDetails')}</h3>
            
            <div className="order-info">
              <div className="info-group">
                <h4>{t('customerInfo')}</h4>
                <p><strong>{t('name')}:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>{t('phoneNumber')}:</strong> {formData.phone}</p>
                <p><strong>{t('email')}:</strong> {formData.email}</p>
              </div>
              
              <div className="info-group">
                <h4>{t('deliveryAddress')}</h4>
                <p>{formData.address}</p>
                <p>{formData.district}, {formData.city} {formData.postalCode}</p>
                {formData.deliveryInstructions && (
                  <p><strong>{t('deliveryInstructions')}:</strong> {formData.deliveryInstructions}</p>
                )}
              </div>
              
              <div className="info-group">
                <h4>{t('paymentMethod')}</h4>
                <p>{formData.paymentMethod === 'cash' ? t('cashOnDelivery') : t('creditCard')}</p>
              </div>
            </div>
          </div>

          <div className="order-items-section">
            <h3>{t('orderItems')}</h3>
            <div className="order-items-list">
              {cartItems.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name_en} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name_en}</h4>
                    <p className="item-price">{item.price} {t('baht')}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-summary">
              <div className="summary-line">
                <span>{t('subtotal')}</span>
                <span>{total} {t('baht')}</span>
              </div>
              <div className="summary-line">
                <span>{t('deliveryFee')}</span>
                <span>0 {t('baht')}</span>
              </div>
              <div className="summary-line total-line">
                <span>{t('total')}</span>
                <span>{finalTotal} {t('baht')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          {isFailed ? (
            <>
              <button onClick={() => navigate('/checkout')} className="retry-payment-btn">
                {t('retryPayment')}
              </button>
              <button onClick={() => navigate('/')} className="back-to-home-btn">
                {t('backToHome')}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/')} className="continue-shopping-btn">
                {t('continueShopping')}
              </button>
              <button onClick={() => window.print()} className="print-order-btn">
                {t('printOrder')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
