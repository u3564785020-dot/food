import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import './MorePage.css'

const MorePage = () => {
  const { t, language, setLanguage } = useLanguage()

  const menuItems = [
    {
      id: 'stores',
      label: t('stores'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M3 21H21L20 9H4L3 21Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M9 9V5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5V9" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path d="M7 21V9H17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      hasArrow: true
    },
    {
      id: 'contact-us',
      label: t('contactUs'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3L20 7L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 7H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      hasArrow: true
    },
    {
      id: 'terms',
      label: t('termsAndConditions'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      hasArrow: true
    },
    {
      id: 'privacy',
      label: t('privacyStatement'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M12 22S8 18 8 12V5L12 3L16 5V12C16 18 12 22 12 22Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      hasArrow: true
    },
    {
      id: 'catering',
      label: t('catering'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M12 2L2 7L12 12L22 7L12 2Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      hasArrow: true
    },
    {
      id: 'fresh-taste',
      label: t('freshTaste'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 14S9.5 16 12 16S16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      hasArrow: true
    },
    {
      id: 'made-to-order',
      label: t('madeToOrder'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V19C17 19.5304 16.7893 20.0391 16.4142 20.4142C16.0391 20.7893 15.5304 21 15 21H9C8.46957 21 7.96086 20.7893 7.58579 20.4142C7.21071 20.0391 7 19.5304 7 19V13M17 13H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      hasArrow: true
    },
    {
      id: 'promotion',
      label: t('promotion'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      ),
      hasArrow: true
    }
  ]

  const handleLanguageToggle = () => {
    setLanguage(language === 'th' ? 'en' : 'th')
  }

  return (
    <div className="more-page">
      <div className="more-container">
        <div className="more-content">
          {/* Language Selector */}
          <div className="menu-item language-item">
            <div className="menu-item-left">
              <div className="menu-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="menu-label">{t('language')}</span>
            </div>
            <div className="language-selector">
              <button 
                className={`lang-option ${language === 'th' ? 'active' : ''}`}
                onClick={handleLanguageToggle}
              >
                TH
              </button>
              <button 
                className={`lang-option ${language === 'en' ? 'active' : ''}`}
                onClick={handleLanguageToggle}
              >
                EN
              </button>
            </div>
          </div>

          {/* Other Menu Items */}
          {menuItems.map((item, index) => (
            <div key={item.id} className="menu-item">
              <div className="menu-item-left">
                <div className="menu-icon">
                  {item.icon}
                </div>
                <span className="menu-label">{item.label}</span>
              </div>
              {item.hasArrow && (
                <div className="menu-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MorePage
