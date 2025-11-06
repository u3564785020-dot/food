/**
 * Facebook Pixel Dynamic Integration
 * 
 * Этот модуль позволяет динамически инициализировать Facebook Pixel
 * с ID из URL-параметра 'p', как в PHP-версии.
 */

// Получить ID пикселя из URL или localStorage
export const getPixelId = () => {
  // Сначала проверяем URL-параметры
  const urlParams = new URLSearchParams(window.location.search)
  const pixelIdFromUrl = urlParams.get('p')
  
  if (pixelIdFromUrl) {
    // Сохраняем в localStorage для использования на других страницах
    localStorage.setItem('fb_pixel_id', pixelIdFromUrl)
    return pixelIdFromUrl
  }
  
  // Если нет в URL, проверяем localStorage
  const pixelIdFromStorage = localStorage.getItem('fb_pixel_id')
  if (pixelIdFromStorage) {
    return pixelIdFromStorage
  }
  
  // Дефолтный ID (если не указан)
  return '1381928929958008'
}

// Инициализировать пиксель с динамическим ID
export const initPixel = () => {
  const pixelId = getPixelId()
  
  if (typeof fbq !== 'undefined') {
    // Всегда инициализируем пиксель с текущим ID
    // Это гарантирует, что пиксель работает на всех страницах
    fbq('init', pixelId)
    return pixelId
  } else {
    // Если fbq ещё не загружен, используем глобальную функцию
    if (typeof window !== 'undefined' && window.initFBPixel) {
      window.initFBPixel()
    }
  }
  
  return pixelId
}

// Отслеживание PageView
export const trackPageView = () => {
  // Сначала убеждаемся, что пиксель инициализирован
  if (typeof fbq !== 'undefined') {
    const pixelId = getPixelId()
    fbq('init', pixelId)
    fbq('track', 'PageView')
  }
}

// Отслеживание Lead события
export const trackLead = (value = 5.00, currency = 'THB') => {
  if (typeof fbq !== 'undefined') {
    const pixelId = getPixelId()
    fbq('init', pixelId)
    fbq('track', 'Lead', {
      currency: currency,
      value: value
    })
  }
}

// Отслеживание CompleteRegistration события
export const trackCompleteRegistration = (value = 10.00, currency = 'THB') => {
  if (typeof fbq !== 'undefined') {
    const pixelId = getPixelId()
    fbq('init', pixelId)
    fbq('track', 'CompleteRegistration', {
      currency: currency,
      value: value
    })
  }
}

// Отслеживание Purchase события
export const trackPurchase = (value, currency = 'THB', orderId = null) => {
  if (typeof fbq !== 'undefined') {
    const pixelId = getPixelId()
    fbq('init', pixelId)
    
    const params = {
      currency: currency,
      value: value
    }
    
    if (orderId) {
      params.content_ids = [orderId]
      params.content_type = 'product'
    }
    
    fbq('track', 'Purchase', params)
  }
}

// Отслеживание ViewContent события (для просмотра товаров)
export const trackViewContent = (contentName = '', contentIds = [], value = 0, currency = 'THB') => {
  if (typeof fbq !== 'undefined') {
    const pixelId = getPixelId()
    fbq('init', pixelId)
    
    const params = {
      content_type: 'product',
      currency: currency
    }
    
    if (contentName) {
      params.content_name = contentName
    }
    
    if (contentIds.length > 0) {
      params.content_ids = contentIds
    }
    
    if (value > 0) {
      params.value = value
    }
    
    fbq('track', 'ViewContent', params)
  }
}

// Отслеживание Search события
export const trackSearch = (searchString = '') => {
  if (typeof fbq !== 'undefined') {
    const pixelId = getPixelId()
    fbq('init', pixelId)
    fbq('track', 'Search', {
      search_string: searchString
    })
  }
}

// Сохранить параметр 'p' из URL для использования на других страницах
export const savePixelIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const pixelId = urlParams.get('p')
  
  if (pixelId) {
    localStorage.setItem('fb_pixel_id', pixelId)
    return pixelId
  }
  
  return null
}

// Получить сохранённый ID пикселя
export const getSavedPixelId = () => {
  return localStorage.getItem('fb_pixel_id') || '1381928929958008'
}

