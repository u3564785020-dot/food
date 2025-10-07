import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmation from './pages/OrderConfirmation'
import MorePage from './pages/MorePage'
import MyOrderPage from './pages/MyOrderPage'
import EarnPointPage from './pages/EarnPointPage'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import SideMenu from './components/SideMenu'
import ShoppingCart from './components/ShoppingCart'
import BottomNavigation from './components/BottomNavigation'
import { useLanguage } from './context/LanguageContext'
import { notifySiteEntry } from './utils/telegramBot'
import './App.css'

function AppContent() {
  const [showCookie, setShowCookie] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { language } = useLanguage()
  const location = useLocation()

  // Устанавливаем язык HTML документа
  useEffect(() => {
    document.documentElement.lang = language === 'th' ? 'th' : 'en'
  }, [language])

  // Отправляем уведомление о входе на сайт при первой загрузке
  useEffect(() => {
    const hasNotified = sessionStorage.getItem('telegram_notified')
    if (!hasNotified) {
      notifySiteEntry()
      sessionStorage.setItem('telegram_notified', 'true')
    }
  }, [])

  const addToCart = (item) => {
    setCartItems([...cartItems, item])
  }

  // Определяем класс для app в зависимости от текущей страницы
  const appClassName = location.pathname === '/checkout' ? 'app checkout-page' : 'app'

  return (
    <div className={appClassName}>
      {showCookie && <CookieBanner onAccept={() => setShowCookie(false)} />}
      <Header 
        cartCount={cartItems.length} 
        onCartClick={() => setShowCart(true)}
        onMenuClick={() => setShowMenu(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <SideMenu show={showMenu} onClose={() => setShowMenu(false)} />
      <ShoppingCart 
        show={showCart} 
        onClose={() => setShowCart(false)} 
        items={cartItems}
      />
      <Routes>
        <Route path="/" element={<HomePage onAddToCart={addToCart} searchQuery={searchQuery} />} />
        <Route path="/product/:id" element={<ProductPage onAddToCart={addToCart} />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/more" element={<MorePage />} />
        <Route path="/my-order" element={<MyOrderPage />} />
        <Route path="/earn-point" element={<EarnPointPage />} />
      </Routes>
      <Footer />
      {location.pathname !== '/checkout' && <BottomNavigation />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App


