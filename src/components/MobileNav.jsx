import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './MobileNav.css'

const MobileNav = ({ cartCount }) => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="mobile-nav">
      <nav className="mobile-nav-menu">
        <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
          <img 
            src={isActive('/') 
              ? "https://www.burgerking.co.th/img/ic-Home.svg"
              : "https://www.burgerking.co.th/img/ic-Home-inactive.svg"
            } 
            alt="Home" 
          />
          <span>หน้าหลัก</span>
        </Link>
        <Link to="/reward" className="nav-item">
          <img src="https://www.burgerking.co.th/img/ic-Rewards.svg" alt="Rewards" />
          <span>รางวัล</span>
        </Link>
        <Link to="/earn" className="nav-item">
          <img src="https://www.burgerking.co.th/img/ic-earn.svg" alt="Earn" />
          <span>สะสมคะแนน</span>
        </Link>
        <Link to="/orders" className="nav-item">
          <img src="https://www.burgerking.co.th/img/ic-Tracking.svg" alt="Orders" />
          <span>รายการอาหาร</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <img src="https://www.burgerking.co.th/img/ic-More.svg" alt="More" />
          <span>เพิ่มเติม</span>
        </Link>
      </nav>
    </div>
  )
}

export default MobileNav


