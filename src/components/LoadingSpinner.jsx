import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner = ({ isVisible }) => {
  if (!isVisible) return null

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <img 
          src="https://www.burgerking.co.th/img/bk-loading.gif" 
          alt="Loading..." 
          className="loading-gif"
        />
      </div>
    </div>
  )
}

export default LoadingSpinner
