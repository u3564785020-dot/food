import React, { useState, useEffect } from 'react'
import './HeroSlider.css'

const HeroSlider = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Отладочная информация для мобильных устройств
  console.log('HeroSlider images:', images)
  console.log('Images length:', images?.length)
  console.log('Current slide:', currentSlide)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="hero-slider">
      <div className="slider-container">
        <div 
          className="slider-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="slide">
              <img 
                src={image} 
                alt={`Slide ${index + 1}`}
                onError={(e) => {
                  console.error('Failed to load image:', image)
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', image)
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="slider-controls">
        <button className="slider-arrow prev" onClick={prevSlide}>
          <img src="https://www.burgerking.co.th/img/btn-prev.svg" alt="Previous" />
        </button>
        <button className="slider-arrow next" onClick={nextSlide}>
          <img src="https://www.burgerking.co.th/img/btn-next.svg" alt="Next" />
        </button>
      </div>

      <div className="slider-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider


