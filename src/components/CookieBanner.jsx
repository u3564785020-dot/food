import React, { useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './CookieBanner.css'

const CookieBanner = ({ onAccept }) => {
  const { t } = useLanguage()

  // Автоматически закрываем баннер через 7 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      onAccept()
    }, 7000) // 7 секунд

    return () => clearTimeout(timer)
  }, [onAccept])

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

