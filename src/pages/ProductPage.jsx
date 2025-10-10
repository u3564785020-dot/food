import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../data/products'
import { useLanguage } from '../context/LanguageContext'
import './ProductPage.css'

const ProductPage = ({ onAddToCart }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const product = getProductById(id)

  // Отладочная информация
  console.log('ProductPage render:', { id, product })

  // Фиксированная скидка 50% для всех товаров
  const discount = useMemo(() => {
    if (!product?.price) return { originalPrice: 0, newPrice: 0, discountPercent: 0 }
    
    const discountPercent = 50; // Фиксированная скидка 50%
    const discountAmount = Math.floor(product.price * discountPercent / 100);
    const newPrice = product.price - discountAmount;
    return {
      originalPrice: product.price,
      newPrice,
      discountPercent
    };
  }, [product?.price])
  const [selectedMeat, setSelectedMeat] = useState(
    product?.icons && product.icons.length > 0 ? product.icons[0] : 'pork'
  )
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="product-page-error">
        <h1>Product not found</h1>
        <p>Product ID: {id}</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    )
  }

  const handleAddToCart = () => {
    const item = {
      ...product,
      price: discount.newPrice * quantity,
      unitPrice: discount.newPrice,
      originalPrice: discount.originalPrice,
      discountPercent: discount.discountPercent,
      selectedMeat,
      quantity
    }
    onAddToCart(item)
    navigate('/')
  }

  const getIconImage = (iconType) => {
    const iconMap = {
      pork: 'https://buzzebees.blob.core.windows.net/burgerking/icon-pork.png',
      beef: 'https://buzzebees.blob.core.windows.net/burgerking/icon-beef.png',
      chicken: 'https://buzzebees.blob.core.windows.net/burgerking/icon-chicken.png',
      fish: 'https://buzzebees.blob.core.windows.net/burgerking/icon-fish.png'
    }
    return iconMap[iconType]
  }

  const getMeatName = (meatType) => {
    const meatNames = {
      pork: language === 'th' ? 'หมู' : 'Pork',
      beef: language === 'th' ? 'เนื้อ' : 'Beef',
      chicken: language === 'th' ? 'ไก่' : 'Chicken',
      fish: language === 'th' ? 'ปลา' : 'Fish'
    }
    return meatNames[meatType] || meatType
  }

  const productName = language === 'th' ? product.name_th : product.name_en

  return (
    <div className="product-page">
      <div className="product-container">
        <button className="back-button" onClick={() => navigate('/')}>
          <img src="https://www.burgerking.co.th/img/back-btn.svg" alt="Back" />
          <span>{language === 'th' ? 'กลับ' : 'Back'}</span>
        </button>

        <div className="product-layout">
          {/* Left Panel - Product Information */}
          <div className="product-image-section">
            {/* Promotional Badge - только для товаров со скидками */}
            {product.categoryId === 28255 && (
              <div className="promotional-badge">
                {language === 'th' ? '1ฟรี1' : '1 Free 1'}
              </div>
            )}
            
            {/* Product Image */}
            <img src={product.image} alt={productName} className="product-main-image" />
            
            {/* Product Title */}
            <h1 className="product-title">{productName}</h1>
            
            {/* Favorite Icon */}
            <button className="favorite-button">
              <span className="heart-icon">♡</span>
            </button>
            
            {/* Detail Section */}
            <div className="detail-section">
              <h3 className="detail-title">{language === 'th' ? 'Detail' : 'Detail'}</h3>
              <p className="product-description">{productName}</p>
            </div>
          </div>

          {/* Right Panel - Ordering Options */}
          <div className="product-details-section">
            {/* Choose Section - только если есть варианты мяса */}
            {product.icons && product.icons.length > 0 && (
              <div className="choose-section">
                <h3 className="section-title">{language === 'th' ? 'Choose' : 'Choose'}</h3>
                
                {/* Meat Type Selector */}
                <div className="meat-selector">
                  <div className="meat-option">
                    <img 
                      src={getIconImage(selectedMeat)} 
                      alt={selectedMeat}
                      className="meat-icon"
                    />
                    <span className="meat-name">{getMeatName(selectedMeat)}</span>
                    <span className="checkmark">✓</span>
                  </div>
                </div>
                
                {/* Meat Type Buttons */}
                <div className="meat-buttons">
                  {product.icons.map((meatType, index) => (
                    <button
                      key={index}
                      className={`meat-button ${selectedMeat === meatType ? 'active' : ''}`}
                      onClick={() => setSelectedMeat(meatType)}
                    >
                      {getMeatName(meatType)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add on Section */}
            <div className="addon-section">
              <h3 className="section-title">
                {language === 'th' ? 'Add on (Optional)' : 'Add on (Optional)'}
                <span className="chevron">▼</span>
              </h3>
            </div>

            {/* Ingredients Section */}
            <div className="ingredients-section">
              <h3 className="section-title">
                {language === 'th' ? 'Ingredients (Optional)' : 'Ingredients (Optional)'}
                <span className="chevron">▼</span>
              </h3>
            </div>

            {/* Quantity Section */}
            <div className="quantity-section">
              <h3 className="section-title">{language === 'th' ? 'Quantity' : 'Quantity'}</h3>
              <div className="quantity-selector">
                <button 
                  className="qty-button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="qty-display">{quantity}</span>
                <button 
                  className="qty-button"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Display */}
            <div className="price-display">
              <span className="price-label">{language === 'th' ? 'Price' : 'Price'}</span>
              <span className="price-value">{discount.newPrice * quantity} {language === 'th' ? 'บาท' : 'baht'}</span>
            </div>

            {/* Add to Cart Button */}
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              {language === 'th' ? 'Add to bag' : 'Select'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage


