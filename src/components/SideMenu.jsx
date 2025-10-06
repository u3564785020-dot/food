import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './SideMenu.css'

const SideMenu = ({ show, onClose }) => {
  const { t } = useLanguage()
  return (
    <>
      {show && <div className="overlay" onClick={onClose}></div>}
      <div className={`side-menu ${show ? 'open' : ''}`}>
        <div className="side-menu-header">
          <button className="close-button" onClick={onClose}>
            <img src="https://www.burgerking.co.th/img/ic-close-brown.svg" alt="Close" />
          </button>
        </div>
        <nav className="side-menu-nav">
          <Link to="/" className="menu-item" onClick={onClose}>
            <img src="https://www.burgerking.co.th/img/ic-Home.svg" alt="Home" />
            <span>{t('home')}</span>
          </Link>
          <Link to="/orders" className="menu-item" onClick={onClose}>
            <img src="https://www.burgerking.co.th/img/ic-Tracking.svg" alt="Orders" />
            <span>{t('orders')}</span>
          </Link>
        </nav>
      </div>
    </>
  )
}

export default SideMenu


