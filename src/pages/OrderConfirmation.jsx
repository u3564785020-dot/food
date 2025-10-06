import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './OrderConfirmation.css'

const OrderConfirmation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  
  const orderData = location.state?.orderData

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
  const deliveryFee = total >= 350 ? 0 : 30
  const finalTotal = total + deliveryFee

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">
            <img src="https://www.burgerking.co.th/img/ic-check-circle.svg" alt="Success" />
          </div>
          <h1>{t('orderConfirmed')}</h1>
          <p className="confirmation-message">{t('orderConfirmationMessage')}</p>
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
                <span>{deliveryFee === 0 ? t('free') : `${deliveryFee} ${t('baht')}`}</span>
              </div>
              <div className="summary-line total-line">
                <span>{t('total')}</span>
                <span>{finalTotal} {t('baht')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            {t('continueShopping')}
          </button>
          <button onClick={() => window.print()} className="print-order-btn">
            {t('printOrder')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
