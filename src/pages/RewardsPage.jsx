import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './RewardsPage.css'

const RewardsPage = () => {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState('ecoupons')

  // Данные купонов/наград
  const rewardsData = {
    ecoupons: [
      {
        id: 1,
        title: 'Special Promotion!! Tom Yum Chicken with Rice + Beverage 12 oz.',
        crowns: 0
      },
      {
        id: 2,
        title: 'Imm Sood Chic Set',
        crowns: 0
      },
      {
        id: 3,
        title: 'Aroi Tid Peek Set',
        crowns: 0
      },
      {
        id: 4,
        title: 'Single set (Beef or Pork)',
        crowns: 0
      },
      {
        id: 5,
        title: 'BBQ Bacon Cheese Beef or Pork Set',
        crowns: 0
      },
      {
        id: 6,
        title: 'Double Cheeseburger Beef or Pork Set',
        crowns: 0
      }
    ],
    special: [
      {
        id: 7,
        title: 'Soft Serve Cone + Small French Fries',
        crowns: 0
      },
      {
        id: 8,
        title: 'Soft Serve Cone + Small Hash Browns',
        crowns: 0
      },
      {
        id: 9,
        title: 'Strawberry Sundae + Small French Fries',
        crowns: 0
      }
    ],
    deals: [
      {
        id: 10,
        title: 'Buy 1 Get 1 Free! Mushroom Swiss Beef or Pork + French Fries Set',
        crowns: 0
      },
      {
        id: 11,
        title: 'Hot Deals Fish\'N Crisp Set',
        crowns: 0
      },
      {
        id: 12,
        title: 'Hot Deals Chic\'N Crisp BBQ Cheese Set',
        crowns: 0
      }
    ]
  }

  const tabs = [
    { id: 'ecoupons', label: t('eCouponsAtStore'), icon: '28510' },
    { id: 'special', label: t('specialRedeemAtCashier'), icon: '29749' },
    { id: 'deals', label: t('dealsAtStore'), icon: '28509' }
  ]

  const currentRewards = rewardsData[activeTab] || []

  return (
    <div className="rewards-page">
      <div className="rewards-container">
        {/* Header */}
        <div className="rewards-header">
          <h1 className="rewards-title">{t('rewards')}</h1>
        </div>


        {/* Tabs */}
        <div className="rewards-tabs">
          <div className="tabs-container">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="tab-content">
                  <div className="tab-icon">
                    <img 
                      src={`/reward_files/${tab.icon}_${activeTab === tab.id ? 'active' : 'inactive'}`}
                      alt={tab.label}
                    />
                  </div>
                  <div className="tab-label">{tab.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="rewards-grid">
          {currentRewards.map((reward) => (
            <div key={reward.id} className="reward-card">
              <div className="reward-info">
                <div className="reward-title">{reward.title}</div>
                <div className="reward-crowns">
                  {t('use')} {reward.crowns} {t('crowns')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RewardsPage
