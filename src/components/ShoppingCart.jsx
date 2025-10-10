import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './ShoppingCart.css'

const ShoppingCart = ({ show, onClose, items, onRemoveItem }) => {
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const total = items.reduce((sum, item) => sum + item.price, 0)

  const handleCheckout = () => {
    // Сохраняем товары в localStorage для передачи на страницу чекаута
    localStorage.setItem('cartItems', JSON.stringify(items))
    // Переходим на страницу чекаута
    navigate('/checkout', { state: { cartItems: items } })
    // Закрываем корзину
    onClose()
  }

  return (
    <>
      {show && <div className="overlay" onClick={onClose}></div>}
      <div className={`shopping-cart ${show ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>{t('shoppingBag')}</h2>
          <button className="cart-close" onClick={onClose}>
            <img src="https://www.burgerking.co.th/img/ic-close-brown.svg" alt="Close" />
          </button>
        </div>
        <div className="cart-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>{t('cartEmpty')}</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item, index) => {
                  const itemName = language === 'th' ? item.name_th : item.name_en
                  return (
                    <div key={index} className="cart-item">
                      <img src={item.image} alt={itemName} className="cart-item-image" />
                      <div className="cart-item-info">
                        <div className="cart-item-name">{itemName}</div>
                        <div className="cart-item-details">
                          <span className="cart-item-quantity">x{item.quantity}</span>
                          <span className="cart-item-price">{item.price} {t('baht')}</span>
                        </div>
                      </div>
                      <button 
                        className="cart-item-remove" 
                        onClick={() => onRemoveItem(index)}
                        title={language === 'th' ? 'ลบ' : 'Remove'}
                      >
                        <img src="https://www.burgerking.co.th/img/ic-close-brown.svg" alt="Remove" />
                      </button>
                    </div>
                  )
                })}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <span>{t('total')}</span>
                  <span>{total} {t('baht')}</span>
                </div>
                <button className="cart-checkout" onClick={handleCheckout}>
                  {t('checkout')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ShoppingCart


