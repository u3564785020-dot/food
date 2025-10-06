import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './BottomNavigation.css'

const BottomNavigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const navItems = [
    {
      id: 'home',
      label: t('home'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="currentColor"
          />
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: '/'
    },
    {
      id: 'rewards',
      label: t('rewards'),
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
      path: '/rewards'
    },
    {
      id: 'earn-point',
      label: t('earnPoint'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path d="M12 6V12M12 12L9 9M12 12L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: '/earn-point'
    },
    {
      id: 'my-order',
      label: t('myOrder'),
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
      path: '/my-order'
    },
    {
      id: 'more',
      label: t('more'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="1" fill="currentColor"/>
          <circle cx="19" cy="12" r="1" fill="currentColor"/>
          <circle cx="5" cy="12" r="1" fill="currentColor"/>
        </svg>
      ),
      path: '/more'
    }
  ]

  const handleNavClick = (path) => {
    navigate(path)
  }

  return (
    <div className="bottom-navigation">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => handleNavClick(item.path)}
          >
            <div className="nav-icon">
              {item.icon}
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default BottomNavigation
