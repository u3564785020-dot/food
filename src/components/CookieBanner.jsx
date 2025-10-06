import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import './CookieBanner.css'

const CookieBanner = ({ onAccept }) => {
  const { t } = useLanguage()
  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <div className="cookie-text">
          {t('cookieText')}{' '}
          <a href="/privacy" className="cookie-link">{t('cookieLink')}</a>
        </div>
        <button className="cookie-button" onClick={onAccept}>
          {t('acceptCookie')}
        </button>
      </div>
    </div>
  )
}

export default CookieBanner

