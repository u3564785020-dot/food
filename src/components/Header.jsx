import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Header.css'

const Header = ({ cartCount, onCartClick, onMenuClick, searchQuery, onSearchChange }) => {
  const [deliveryType, setDeliveryType] = useState('delivery')
  const { language, changeLanguage, t } = useLanguage()

  return (
    <>
      {/* Desktop Header */}
      <header className="header desktop-header">
        <div className="header-content">
          <div className="header-left">
            <img 
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASBAMAAACtCzMeAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAVUExURVAjE1AgEEdwTFAiE1AiE1AlEFAjFEQRtvoAAAAGdFJOU58gAIjnMJuXk7wAAAA7SURBVAjXYzBLg4FkhjQEYGBDElcUhAEhBiUEwMkOYIABQwY3uDkpKGxhuBpWosxEdgPCzQkobkbyCwDZUCzDH2AFcAAAAABJRU5ErkJggg==" 
              alt="Crown" 
              className="crown-icon"
            />
            <Link to="/">
              <img 
                src="https://www.burgerking.co.th/img/Logo.svg" 
                alt="Burger King" 
                className="logo"
              />
            </Link>
            <div className="delivery-selector">
              <div className="search-container">
                <input
                  type="text"
                  placeholder={language === 'th' ? 'ค้นหาเมนู...' : 'Search menu...'}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="search-input"
                />
              </div>
              <button className="order-button">
                <img src="https://www.burgerking.co.th/img/Order-type.svg" alt="" />
                <span>{t('startOrder')}</span>
              </button>
            </div>
          </div>

          <div className="header-right">
            <div className="greeting">{t('greeting')}</div>
            <button className="icon-button cart-button" onClick={onCartClick}>
              <img src="https://www.burgerking.co.th/img/ic-bag-brown.svg" alt="Cart" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <div className="language-selector">
              <button 
                className={`lang-button ${language === 'th' ? 'active' : ''}`}
                onClick={() => changeLanguage('th')}
              >
                TH
              </button>
              <button 
                className={`lang-button ${language === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="header mobile-header">
        <div className="mobile-header-content">
          <div className="mobile-left">
            <button className="mobile-menu-button" onClick={onMenuClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M4 6H20M6 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="language-selector mobile-lang">
              <button 
                className={`lang-button ${language === 'th' ? 'active' : ''}`}
                onClick={() => changeLanguage('th')}
              >
                TH
              </button>
              <button 
                className={`lang-button ${language === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>
            </div>
          </div>
          <Link to="/">
            <img src="https://www.burgerking.co.th/img/Logo.svg" alt="Burger King" className="mobile-logo" />
          </Link>
          <div className="mobile-right">
            <button className="icon-button" onClick={onCartClick}>
              <img src="https://www.burgerking.co.th/img/ic-bag-brown.svg" alt="Cart" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header

