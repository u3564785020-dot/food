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
        image: 'https://buzzebees.blob.core.windows.net/campaigns/7720682-large?time=20250919104851',
        crowns: 0
      },
      {
        id: 2,
        title: 'Imm Sood Chic Set',
        image: 'https://buzzebees.blob.core.windows.net/campaigns/7550350-large?time=20250919104852',
        crowns: 0
      },
      {
        id: 3,
        title: 'Aroi Tid Peek Set',
        image: 'https://buzzebees.blob.core.windows.net/campaigns/7550409-large?time=20250919104856',
        crowns: 0
      },
      {
        id: 4,
        title: 'Single set (Beef or Pork)',
        image: 'https://buzzebees.blob.core.windows.net/campaigns/3298663-large?time=20250919104859',
        crowns: 0
      },
      {
        id: 5,
        title: 'BBQ Bacon Cheese Beef or Pork Set',
        image: 'https://buzzebees.blob.core.windows.net/campaigns/1630842-large?time=20250919104902',
        crowns: 0
      },
      {
        id: 6,
        title: 'Double Cheeseburger Beef or Pork Set',
        image: 'https://buzzebees.blob.core.windows.net/campaigns/1630985-large?time=20250919104905',
        crowns: 0
      }
    ],
    special: [
      {
        id: 7,
        title: 'Soft Serve Cone + Small French Fries',
        image: 'https://buzzebees.blob.core.windows.net/campaigns/4376989-large?time=20250919111006',
        crowns: 0
      },
      {
        id: 8,
        title: 'Soft Serve Cone + Small Hash Browns',
        image: 'https://buzzebees.blob.core.windows.net/campaigns/4377196-large?time=20250919111010',
        crowns: 0
      },
      {
        id: 9,
        title: 'Strawberry Sundae + Small French Fries',
        image: 'https://buzzebees.blob.core.windows.net/campaigns/4377272-large?time=20250919112021',
        crowns: 0
      }
    ],
    deals: [
      {
        id: 10,
        title: 'Buy 1 Get 1 Free! Mushroom Swiss Beef or Pork + French Fries Set',
        image: 'https://buzzebees.blob.core.windows.net/campaigns/6421312-large?time=20250919110951',
        crowns: 0
      },
      {
        id: 11,
        title: 'Hot Deals Fish\'N Crisp Set',
        image: 'https://buzzebees.blob.core.windows.net/campaigns/8217209-large?time=20250919104912',
        crowns: 0
      },
      {
        id: 12,
        title: 'Hot Deals Chic\'N Crisp BBQ Cheese Set',
        image: 'https://buzzebees.blob.core.windows.net/campaigns/8217221-large?time=20250919110944',
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
              <div 
                className="reward-image"
                style={{ backgroundImage: `url(${reward.image})` }}
              ></div>
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
