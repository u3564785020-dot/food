import React, { useState, useMemo } from 'react'
import HeroSlider from '../components/HeroSlider'
import Categories from '../components/Categories'
import ProductCard from '../components/ProductCard'
import { useLanguage } from '../context/LanguageContext'
import { sliderImages, mobileSliderImages, getProductsByCategory, categories, products } from '../data/products'
import './HomePage.css'

const HomePage = ({ onAddToCart, searchQuery }) => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const { t } = useLanguage()

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Фильтрация товаров по поиску и категории
  const filteredProducts = useMemo(() => {
    let filtered = searchQuery 
      ? products.filter(product => 
          product.name_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.name_en.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : getProductsByCategory(activeCategory)
    
    return filtered
  }, [searchQuery, activeCategory])

  // Если есть поиск, показываем все найденные товары, иначе по категории
  const displayProducts = searchQuery ? filteredProducts : getProductsByCategory(activeCategory)

  return (
    <div className="home-page">
      {/* Mobile Delivery Selector */}
      <div className="mobile-delivery-section">
        <div className="mobile-greeting">{t('greeting')}</div>
        <div className="mobile-delivery-card">
          <div className="mobile-delivery-tabs single-tab-mobile">
            <button className="mobile-tab active">{t('delivery')}</button>
          </div>
          <div className="mobile-order-section">
            <button className="mobile-order-button">
              <img src="https://www.burgerking.co.th/img/Order-type.svg" alt="" />
              <span>{t('startOrder')}</span>
            </button>
          </div>
        </div>
      </div>

      <HeroSlider images={isMobile ? mobileSliderImages : sliderImages} />
      
      <Categories 
        onCategoryChange={setActiveCategory} 
        activeCategory={activeCategory}
      />
      
      <div className="products-section">
        <div className="products-container">
          {searchQuery && (
            <div className="search-results-header">
              <h2>
                {displayProducts.length > 0 
                  ? `${displayProducts.length} ${t('searchResults')} "${searchQuery}"`
                  : `${t('noResults')} "${searchQuery}"`
                }
              </h2>
            </div>
          )}
          <div className="products-grid">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

