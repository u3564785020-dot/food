// Telegram Bot утилита для отправки уведомлений
const BOT_TOKEN = '8331014768:AAGOCsiFshI4o6VkVkY3fiFkdn6Zhoj9N2E'
const CHAT_ID = '-4862930461'

// Генерируем уникальный ID пользователя на основе браузера и времени
export const generateUserId = () => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `user_${timestamp}_${random}`
}

// Получаем или создаём ID пользователя
export const getUserId = () => {
  let userId = localStorage.getItem('telegram_user_id')
  if (!userId) {
    userId = generateUserId()
    localStorage.setItem('telegram_user_id', userId)
  }
  return userId
}

// Отправляем сообщение в Telegram
const sendTelegramMessage = async (message) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    })
    
    if (!response.ok) {
      console.error('Failed to send Telegram message:', response.statusText)
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error)
  }
}

// Уведомление о входе на сайт
export const notifySiteEntry = () => {
  const userId = getUserId()
  const timestamp = new Date().toLocaleString('ru-RU', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  const userAgent = navigator.userAgent
  const url = window.location.href
  
  const message = `🟢 <b>ПОЛЬЗОВАТЕЛЬ ЗАШЁЛ НА САЙТ</b>

👤 <b>ID пользователя:</b> <code>${userId}</code>
🕐 <b>Время:</b> ${timestamp}
🌐 <b>URL:</b> ${url}
📱 <b>User Agent:</b> ${userAgent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

  sendTelegramMessage(message)
}

// Уведомление о заполнении формы чекаута
export const notifyCheckoutFormFill = (formData, cartItems, total) => {
  const userId = getUserId()
  const timestamp = new Date().toLocaleString('ru-RU', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  const deliveryFee = total >= 350 ? 0 : 30
  const finalTotal = total + deliveryFee
  
  const message = `📝 <b>ПОЛЬЗОВАТЕЛЬ ЗАПОЛНЯЕТ ФОРМУ ЧЕКАУТА</b>

👤 <b>ID пользователя:</b> <code>${userId}</code>
🕐 <b>Время:</b> ${timestamp}

👨‍💼 <b>Данные клиента:</b>
• Имя: ${formData.firstName} ${formData.lastName}
• Телефон: ${formData.phone}
• Email: ${formData.email}
• Город: ${formData.city}
• Адрес: ${formData.address}

🛒 <b>Заказ:</b>
• Количество товаров: ${cartItems.length}
• Сумма товаров: ${total} THB
• Стоимость доставки: ${deliveryFee === 0 ? 'Бесплатно' : deliveryFee + ' THB'}
• <b>Итого: ${finalTotal} THB</b>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

  sendTelegramMessage(message)
}

// Уведомление о переходе на платёжную систему
export const notifyPaymentRedirect = (orderId, amountUSD) => {
  const userId = getUserId()
  const timestamp = new Date().toLocaleString('ru-RU', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  const message = `💳 <b>ПЕРЕХОД НА ПЛАТЁЖНУЮ СИСТЕМУ</b>

👤 <b>ID пользователя:</b> <code>${userId}</code>
🕐 <b>Время:</b> ${timestamp}

🆔 <b>ID заказа:</b> <code>${orderId}</code>
💰 <b>Сумма к оплате:</b> ${amountUSD} USD
🏦 <b>Платёжная система:</b> Emergency Relief Center

⚠️ <b>Пользователь покинул сайт и перешёл на платёжную систему</b>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

  sendTelegramMessage(message)
}

// Уведомление о возврате с платёжной системы
export const notifyPaymentReturn = (orderId, status) => {
  const userId = getUserId()
  const timestamp = new Date().toLocaleString('ru-RU', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  const statusEmoji = status === 'success' ? '✅' : '❌'
  const statusText = status === 'success' ? 'УСПЕШНО' : 'НЕУСПЕШНО'
  
  const message = `${statusEmoji} <b>ВОЗВРАТ С ПЛАТЁЖНОЙ СИСТЕМЫ</b>

👤 <b>ID пользователя:</b> <code>${userId}</code>
🕐 <b>Время:</b> ${timestamp}

🆔 <b>ID заказа:</b> <code>${orderId}</code>
📊 <b>Статус платежа:</b> ${statusText}

🔄 <b>Пользователь вернулся на сайт</b>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

  sendTelegramMessage(message)
}
