import React, { useState, useRef, useEffect } from 'react'
import { categories } from '../data/products'
import { useLanguage } from '../context/LanguageContext'
import './Categories.css'

const Categories = ({ onCategoryChange, activeCategory }) => {
  const { language } = useLanguage()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const scrollRef = useRef(null)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="categories-section">
      <div className="categories-container">
        <div 
          className="categories-scroll"
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.id)}
            >
              <div className="category-icon">
                <img 
                  src={activeCategory === category.id ? category.icon : category.iconInactive} 
                  alt={language === 'th' ? category.name_th : category.name_en} 
                />
              </div>
              <div className="category-name">
                {language === 'th' ? category.name_th : category.name_en}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="categories-divider"></div>
    </div>
  )
}

export default Categories

