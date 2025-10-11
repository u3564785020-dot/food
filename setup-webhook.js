/**
 * Скрипт для установки webhook в Telegram
 */

const https = require('https')

// Конфигурация
const BOT_TOKEN = '8406857793:AAGDQnLYrL78nWDrBxi1AS1kWTTVjxdUbpg'
const WEBHOOK_URL = 'burgerkingtai-production.up.railway.app' // Замените на ваш Railway URL

/**
 * Установка webhook
 */
function setWebhook() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      url: WEBHOOK_URL
    })

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/setWebhook`,
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
        try {
          const json = JSON.parse(data)
          resolve(json)
        } catch (e) {
          reject(e)
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
 * Получение информации о webhook
 */
function getWebhookInfo() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getWebhookInfo`,
      method: 'GET'
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.end()
  })
}

/**
 * Удаление webhook
 */
function deleteWebhook() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/deleteWebhook`,
      method: 'POST'
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.end()
  })
}

// Основная функция
async function main() {
  const command = process.argv[2]

  try {
    switch (command) {
      case 'set':
        console.log('🔧 Setting webhook...')
        const setResult = await setWebhook()
        console.log('✅ Webhook set:', setResult)
        break

      case 'info':
        console.log('📊 Getting webhook info...')
        const infoResult = await getWebhookInfo()
        console.log('📋 Webhook info:', JSON.stringify(infoResult, null, 2))
        break

      case 'delete':
        console.log('🗑️ Deleting webhook...')
        const deleteResult = await deleteWebhook()
        console.log('✅ Webhook deleted:', deleteResult)
        break

      default:
        console.log('Usage:')
        console.log('  node setup-webhook.js set   - Set webhook')
        console.log('  node setup-webhook.js info - Get webhook info')
        console.log('  node setup-webhook.js delete - Delete webhook')
        break
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

main()