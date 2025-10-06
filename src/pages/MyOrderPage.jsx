import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './MyOrderPage.css'

const MyOrderPage = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [orders] = useState([]) // Пока пустой массив, после подключения платежки будет заполняться

  const handleSearch = (e) => {
    e.preventDefault()
    // Логика поиска заказов будет добавлена после подключения платежной системы
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="my-order-page">
      <div className="my-order-container">
        {/* Search Bar */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder={t('orderSearchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
        </div>

        {/* Orders Content */}
        <div className="orders-content">
          {orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-illustration">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  {/* Burger */}
                  <ellipse cx="60" cy="45" rx="25" ry="8" fill="currentColor"/>
                  <ellipse cx="60" cy="40" rx="25" ry="8" fill="currentColor"/>
                  <ellipse cx="60" cy="35" rx="25" ry="8" fill="currentColor"/>
                  
                  {/* Fries */}
                  <rect x="25" y="30" width="3" height="25" rx="1.5" fill="currentColor"/>
                  <rect x="30" y="28" width="3" height="27" rx="1.5" fill="currentColor"/>
                  <rect x="35" y="32" width="3" height="23" rx="1.5" fill="currentColor"/>
                  
                  {/* Drink */}
                  <rect x="85" y="25" width="8" height="35" rx="4" fill="currentColor"/>
                  <rect x="87" y="20" width="4" height="8" rx="2" fill="currentColor"/>
                  <path d="M89 20L89 15L91 15L91 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="empty-message">
                <h2>{t('noOrdersYet')}</h2>
                <p>{t('noOrdersDescription')}</p>
              </div>
            </div>
          ) : (
            <div className="orders-list">
              {/* Здесь будут отображаться заказы после подключения платежной системы */}
              {orders.map((order) => (
                <div key={order.id} className="order-item">
                  {/* Структура заказа будет добавлена позже */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrderPage
