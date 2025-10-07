import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './ProductCard.css'

const ProductCard = ({ product, onAddToCart }) => {
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

  // Генерируем случайную скидку от 10% до 35%
  const generateDiscount = (originalPrice) => {
    const discountPercent = Math.floor(Math.random() * 26) + 10; // 10-35%
    const discountAmount = Math.floor(originalPrice * discountPercent / 100);
    const newPrice = originalPrice - discountAmount;
    return {
      originalPrice,
      newPrice,
      discountPercent
    };
  }

  const productName = language === 'th' ? product.name_th : product.name_en
  const discount = generateDiscount(product.price)

  const handleCustomize = () => {
    navigate(`/product/${product.id}`)
  }

  const handleAdd = (e) => {
    e.stopPropagation()
    // Создаем продукт с новой ценой для добавления в корзину
    const productWithNewPrice = {
      ...product,
      price: discount.newPrice,
      originalPrice: discount.originalPrice,
      discountPercent: discount.discountPercent
    }
    onAddToCart(productWithNewPrice)
  }

  return (
    <div className="product-card">
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
          <button className="product-customize-button" onClick={handleCustomize}>
            {language === 'th' ? 'ปรับแต่ง' : 'Customize'}
          </button>
          <button className="product-add-button" onClick={handleAdd}>
            <span>🛒</span> {language === 'th' ? 'เพิ่ม' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

