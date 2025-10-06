import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <>
      {/* Desktop Footer */}
      <footer className="footer desktop-footer">
        <div className="footer-top">
          <div className="footer-content">
            <div className="footer-app">
              <img 
                src="https://www.burgerking.co.th/img/app-screen.png" 
                alt="App" 
                className="app-image"
              />
            </div>
            <div className="footer-download">
              <h2 className="download-title">Download Application</h2>
              <p className="download-subtitle">Burger King Thailand Applications</p>
              <div className="download-badges">
                <a href="#" className="badge-link">
                  <img src="https://www.burgerking.co.th/img/app-store-badge.png" alt="App Store" />
                </a>
                <a href="#" className="badge-link">
                  <img src="https://www.burgerking.co.th/img/google-play-badge.png" alt="Google Play" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-content">
            <div className="footer-columns">
              <div className="footer-col-4">
                <div className="footer-sections">
                  <div className="footer-section">
                    <h3 className="footer-heading">BK INFO</h3>
                    <Link to="#" className="footer-link">About Burger King</Link>
                    <Link to="#" className="footer-link">Fresh Taste</Link>
                    <Link to="#" className="footer-link">Made to Order</Link>
                    <Link to="#" className="footer-link">Careers</Link>
                  </div>
                  <div className="footer-section">
                    <Link to="#" className="footer-link mt-top">Locations</Link>
                    <Link to="#" className="footer-link">Promotions</Link>
                  </div>
                  <div className="footer-section">
                    <h3 className="footer-heading">Members</h3>
                    <Link to="#" className="footer-link">Member Registration</Link>
                    <Link to="#" className="footer-link">Crown Points</Link>
                    <Link to="#" className="footer-link">Rewards</Link>
                  </div>
                </div>
              </div>
              <div className="footer-col-3">
                <h3 className="footer-heading">BURGER KING</h3>
                <div className="footer-links-row">
                  <Link to="#" className="footer-link-inline">Privacy Policy</Link>
                  <span className="separator">|</span>
                  <Link to="#" className="footer-link-inline">Terms & Conditions</Link>
                  <span className="separator">|</span>
                  <Link to="#" className="footer-link-inline">Contact us</Link>
                </div>
                <div className="social-links">
                  <a href="https://instagram.com/burgerkingthailand" target="_blank" rel="noopener noreferrer">
                    <img src="https://www.burgerking.co.th/img/ig-icon.svg" alt="Instagram" />
                  </a>
                  <a href="https://www.facebook.com/BurgerKingThailand" target="_blank" rel="noopener noreferrer">
                    <img src="https://www.burgerking.co.th/img/fb-icon.svg" alt="Facebook" />
                  </a>
                </div>
                <p className="copyright">
                  TM & Copyright 2022 MINOR INTERNATIONAL PCL. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Footer */}
      <footer className="footer mobile-footer">
        <div className="mobile-footer-content">
          <h3 className="mobile-footer-title">BURGER KING</h3>
          <div className="mobile-footer-links">
            <Link to="#">Privacy Policy</Link>
            <span>|</span>
            <Link to="#">Terms & Conditions</Link>
            <span>|</span>
            <Link to="#">Contact us</Link>
          </div>
          <div className="mobile-social">
            <a href="https://instagram.com/burgerkingthailand">
              <img src="https://www.burgerking.co.th/img/ig-icon.svg" alt="Instagram" />
            </a>
            <a href="https://www.facebook.com/BurgerKingThailand">
              <img src="https://www.burgerking.co.th/img/fb-icon.svg" alt="Facebook" />
            </a>
          </div>
          <p className="mobile-copyright">
            TM & Copyright 2022 MINOR INTERNATIONAL PCL. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer


