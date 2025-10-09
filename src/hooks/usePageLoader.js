import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const usePageLoader = () => {
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Показываем лоадер при изменении маршрута
    setIsLoading(true)
    
    // Скрываем лоадер через короткое время
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800) // 800ms - достаточно для показа лоадера

    return () => clearTimeout(timer)
  }, [location.pathname])

  const showLoader = () => setIsLoading(true)
  const hideLoader = () => setIsLoading(false)

  return {
    isLoading,
    showLoader,
    hideLoader
  }
}
