import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../data/products'
import { useLanguage } from '../context/LanguageContext'
import './ProductPage.css'

const ProductPage = ({ onAddToCart }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const product = getProductById(id)

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

  const discount = generateDiscount(product?.price || 0)

  const [selectedOptions, setSelectedOptions] = useState({
    patty: product?.customizations?.pattyOptions?.[0] || '',
    cheese: product?.customizations?.cheeseOptions?.[0] || '',
    sauce: product?.customizations?.sauceOptions?.[0] || '',
    drink: product?.customizations?.drinks?.[0] || '',
    side: product?.customizations?.sides?.[0] || '',
    cookingLevel: product?.customizations?.cookingLevel?.[0] || '',
    extras: []
  })

  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return <div className="product-page-error">Product not found</div>
  }

  const handleOptionChange = (optionType, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: value
    }))
  }

  const handleExtraToggle = (extra) => {
    setSelectedOptions(prev => ({
      ...prev,
      extras: prev.extras.includes(extra)
        ? prev.extras.filter(e => e !== extra)
        : [...prev.extras, extra]
    }))
  }

  const handleAddToCart = () => {
    const item = {
      ...product,
      price: discount.newPrice,
      originalPrice: discount.originalPrice,
      discountPercent: discount.discountPercent,
      selectedOptions,
      quantity
    }
    onAddToCart(item)
    navigate('/')
  }

  const getIconImage = (iconType) => {
    const iconMap = {
      pork: 'https://buzzebees.blob.core.windows.net/burgerking/icon-pork.png',
      beef: 'https://buzzebees.blob.core.windows.net/burgerking/icon-beef.png'
    }
    return iconMap[iconType]
  }

  const productName = language === 'th' ? product.name_th : product.name_en
  const productDescription = language === 'th' ? product.description_th : product.description_en

  return (
    <div className="product-page">
      <div className="product-container">
        <button className="back-button" onClick={() => navigate('/')}>
          <img src="https://www.burgerking.co.th/img/back-btn.svg" alt="Back" />
          <span>กลับ</span>
        </button>

        <div className="product-layout">
          <div className="product-image-section">
            <img src={product.image} alt={productName} className="product-main-image" />
          </div>

          <div className="product-details-section">
            <h1 className="product-title">{productName}</h1>
            <p className="product-description">{productDescription}</p>
            
            <div className="product-icons-display">
              {product.icons.map((icon, index) => (
                <img 
                  key={index}
                  src={getIconImage(icon)} 
                  alt={icon}
                  className="product-icon-display"
                />
              ))}
            </div>

            <div className="product-price-display">
              <span className="original-price">{discount.originalPrice} บาท</span>
              <span className="new-price">{discount.newPrice} บาท</span>
              <span className="discount-badge">-{discount.discountPercent}%</span>
            </div>

            {/* Customization Options */}
            <div className="customization-section">
              {product.customizations.pattyOptions && (
                <div className="option-group">
                  <h3 className="option-title">เลือกแพตตี้</h3>
                  <div className="option-buttons">
                    {product.customizations.pattyOptions.map((option, index) => (
                      <button
                        key={index}
                        className={`option-button ${selectedOptions.patty === option ? 'active' : ''}`}
                        onClick={() => handleOptionChange('patty', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.customizations.cookingLevel && (
                <div className="option-group">
                  <h3 className="option-title">ระดับความสุก</h3>
                  <div className="option-buttons">
                    {product.customizations.cookingLevel.map((option, index) => (
                      <button
                        key={index}
                        className={`option-button ${selectedOptions.cookingLevel === option ? 'active' : ''}`}
                        onClick={() => handleOptionChange('cookingLevel', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.customizations.cheeseOptions && (
                <div className="option-group">
                  <h3 className="option-title">เลือกชีส</h3>
                  <div className="option-buttons">
                    {product.customizations.cheeseOptions.map((option, index) => (
                      <button
                        key={index}
                        className={`option-button ${selectedOptions.cheese === option ? 'active' : ''}`}
                        onClick={() => handleOptionChange('cheese', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.customizations.sauceOptions && (
                <div className="option-group">
                  <h3 className="option-title">เลือกซอส</h3>
                  <div className="option-buttons">
                    {product.customizations.sauceOptions.map((option, index) => (
                      <button
                        key={index}
                        className={`option-button ${selectedOptions.sauce === option ? 'active' : ''}`}
                        onClick={() => handleOptionChange('sauce', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.customizations.drinks && (
                <div className="option-group">
                  <h3 className="option-title">เลือกเครื่องดื่ม</h3>
                  <div className="option-buttons">
                    {product.customizations.drinks.map((option, index) => (
                      <button
                        key={index}
                        className={`option-button ${selectedOptions.drink === option ? 'active' : ''}`}
                        onClick={() => handleOptionChange('drink', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.customizations.sides && (
                <div className="option-group">
                  <h3 className="option-title">เลือกเครื่องเคียง</h3>
                  <div className="option-buttons">
                    {product.customizations.sides.map((option, index) => (
                      <button
                        key={index}
                        className={`option-button ${selectedOptions.side === option ? 'active' : ''}`}
                        onClick={() => handleOptionChange('side', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.customizations.extras && (
                <div className="option-group">
                  <h3 className="option-title">เพิ่มเติม</h3>
                  <div className="option-checkboxes">
                    {product.customizations.extras.map((extra, index) => (
                      <label key={index} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedOptions.extras.includes(extra)}
                          onChange={() => handleExtraToggle(extra)}
                        />
                        <span>{extra}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="product-actions">
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
              <button className="add-to-cart-button" onClick={handleAddToCart}>
                เพิ่มลงตะกร้า - {discount.newPrice * quantity} บาท
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage


