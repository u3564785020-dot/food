import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  
  const getIconImage = (iconType) => {
    const iconMap = {
      pork: 'https://buzzebees.blob.core.windows.net/burgerking/icon-pork.png',
      beef: 'https://buzzebees.blob.core.windows.net/burgerking/icon-beef.png',
      chicken: 'https://buzzebees.blob.core.windows.net/burgerking/icon-chicken.png',
      fish: 'https://buzzebees.blob.core.windows.net/burgerking/icon-fish.png'
    }
    return iconMap[iconType]
  }

  // Фиксированная скидка 50% для всех товаров
  const discount = useMemo(() => {
    const discountPercent = 50; // Фиксированная скидка 50%
    const discountAmount = Math.floor(product.price * discountPercent / 100);
    const newPrice = product.price - discountAmount;
    return {
      originalPrice: product.price,
      newPrice,
      discountPercent
    };
  }, [product.price])

  const productName = language === 'th' ? product.name_th : product.name_en

  const handleCardClick = () => {
    navigate(`/product/${product.id}`)
  }

  const handleButtonClick = (e) => {
    e.stopPropagation()
    navigate(`/product/${product.id}`)
  }

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div 
        className="product-image"
        style={{ backgroundImage: `url(${product.image})` }}
      />
      <div className="product-info">
        <div className="product-name">{productName}</div>
        
        <div className="product-price">
          <span className="original-price">{discount.originalPrice} {t('baht')}</span>
          <span className="new-price">{discount.newPrice} {t('baht')}</span>
          <span className="discount-badge">-{discount.discountPercent}%</span>
        </div>
        
        <div className="product-icons">
          {product.icons.map((icon, index) => (
            <img 
              key={index}
              src={getIconImage(icon)} 
              alt={icon}
              className="product-icon"
            />
          ))}
        </div>

        <div className="product-buttons">
          <button className="product-add-button" onClick={handleButtonClick}>
            {language === 'th' ? 'เลือก' : 'Select'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

