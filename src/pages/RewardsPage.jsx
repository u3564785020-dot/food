import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import './RewardsPage.css'

const RewardsPage = () => {
  const { t, language } = useLanguage()

  return (
    <div className="rewards-page">
      <div className="rewards-container">
        {/* Header Section */}
        <div className="rewards-header">
          <div className="rewards-icon">
            <div className="ribbon-icon">
              <div className="crown-icon">👑</div>
            </div>
          </div>
          <h1 className="rewards-title">{t('rewards')}</h1>
        </div>

        {/* Rewards Content */}
        <div className="rewards-content">
          <div className="rewards-intro">
            <h2>{t('welcomeToRewards')}</h2>
            <p>{t('rewardsDescription')}</p>
          </div>

          {/* Rewards Cards */}
          <div className="rewards-cards">
            <div className="reward-card">
              <div className="reward-icon">🎁</div>
              <h3>{t('freeItems')}</h3>
              <p>{t('freeItemsDescription')}</p>
            </div>

            <div className="reward-card">
              <div className="reward-icon">⭐</div>
              <h3>{t('exclusiveOffers')}</h3>
              <p>{t('exclusiveOffersDescription')}</p>
            </div>

            <div className="reward-card">
              <div className="reward-icon">🏆</div>
              <h3>{t('specialEvents')}</h3>
              <p>{t('specialEventsDescription')}</p>
            </div>
          </div>

          {/* How It Works */}
          <div className="how-it-works">
            <h2>{t('howItWorks')}</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>{t('step1Title')}</h3>
                  <p>{t('step1Description')}</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>{t('step2Title')}</h3>
                  <p>{t('step2Description')}</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>{t('step3Title')}</h3>
                  <p>{t('step3Description')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Join Now Button */}
          <div className="join-section">
            <button className="join-rewards-btn">
              {t('joinRewards')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RewardsPage
