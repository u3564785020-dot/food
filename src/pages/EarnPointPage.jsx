import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './EarnPointPage.css'

const EarnPointPage = () => {
  const { t, language, setLanguage } = useLanguage()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    mobile: '',
    name: '',
    acceptTerms: false,
    acceptMarketing: false
  })
  
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = t('mobileRequired')
    } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\s/g, ''))) {
      newErrors.mobile = t('mobileInvalid')
    }
    
    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired')
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = t('termsRequired')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Сохраняем данные пользователя в localStorage
      const userData = {
        mobile: formData.mobile,
        name: formData.name,
        acceptMarketing: formData.acceptMarketing,
        registeredAt: new Date().toISOString()
      }
      
      localStorage.setItem('guestUser', JSON.stringify(userData))
      
      // Перенаправляем на главную страницу
      navigate('/')
    }
  }

  const handleLanguageToggle = () => {
    setLanguage(language === 'th' ? 'en' : 'th')
  }

  return (
    <div className="earn-point-page">
      <div className="earn-point-container">
        {/* Header */}
        <div className="earn-point-header">
          <div className="logo">
            <img src="https://www.burgerking.co.th/img/Logo.svg" alt="Burger King" />
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

        {/* Main Content */}
        <div className="earn-point-content">
          <h1 className="page-title">{t('guest')}</h1>
          
          <form onSubmit={handleSubmit} className="guest-form">
            {/* Mobile Number */}
            <div className="form-group">
              <label className="form-label">
                <span className="required">*</span>
                {t('mobileNumber')}
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder={t('mobilePlaceholder')}
                className={`form-input ${errors.mobile ? 'error' : ''}`}
              />
              {errors.mobile && <span className="error-message">{errors.mobile}</span>}
            </div>

            {/* Name */}
            <div className="form-group">
              <label className="form-label">
                <span className="required">*</span>
                {t('name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t('namePlaceholder')}
                className={`form-input ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Terms and Conditions */}
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">
                  {t('acceptTermsText')}
                  <a href="#" className="link">{t('termsAndConditions')}</a>
                  {t('and')}
                  <a href="#" className="link">{t('privacyStatement')}</a>
                  {t('ofBurgerKing')}
                </span>
              </label>
              {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
            </div>

            {/* Marketing Consent */}
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acceptMarketing"
                  checked={formData.acceptMarketing}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">
                  {t('marketingConsentText')}
                  <a href="#" className="link">{t('affiliatedCompanies')}</a>
                  {t('marketingConsentText2')}
                  <a href="#" className="link">{t('privacyStatement')}</a>
                  {t('marketingConsentText3')}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`submit-button ${formData.mobile && formData.name && formData.acceptTerms ? 'active' : ''}`}
              disabled={!formData.mobile || !formData.name || !formData.acceptTerms}
            >
              {t('continue')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EarnPointPage
