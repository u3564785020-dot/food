const https = require('https')

// Конфигурация
const BOT_TOKEN = '8406857793:AAGDQnLYrL78nWDrBxi1AS1kWTTVjxdUbpg'
const WEBHOOK_URL = 'https://web-production-1d02b.up.railway.app/webhook'

function setWebhook() {
  const url = `/bot${BOT_TOKEN}/setWebhook`
  const data = JSON.stringify({
    url: WEBHOOK_URL,
    allowed_updates: ['callback_query']
  })

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  console.log(`\n🔧 Setting webhook to: ${WEBHOOK_URL}\n`)

  const req = https.request(options, (res) => {
    let responseData = ''

    res.on('data', (chunk) => {
      responseData += chunk
    })

    res.on('end', () => {
      try {
        const result = JSON.parse(responseData)
        if (result.ok) {
          console.log('✅ Webhook set successfully!')
          console.log('📍 URL:', WEBHOOK_URL)
          getWebhookInfo()
        } else {
          console.error('❌ Error setting webhook:', result)
        }
      } catch (error) {
        console.error('❌ Error parsing response:', error)
        console.error('Response:', responseData)
      }
    })
  })

  req.on('error', (error) => {
    console.error('❌ Request error:', error)
  })

  req.write(data)
  req.end()
}

function getWebhookInfo() {
  const url = `/bot${BOT_TOKEN}/getWebhookInfo`

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: url,
    method: 'GET'
  }

  setTimeout(() => {
    console.log('\n🔍 Checking webhook info...\n')

    const req = https.request(options, (res) => {
      let responseData = ''

      res.on('data', (chunk) => {
        responseData += chunk
      })

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData)
          if (result.ok) {
            console.log('📋 Webhook Info:')
            console.log('   URL:', result.result.url)
            console.log('   Pending updates:', result.result.pending_update_count)
            console.log('   Last error:', result.result.last_error_message || 'None')
            console.log('\n✅ Setup complete!')
          }
        } catch (error) {
          console.error('❌ Error parsing webhook info:', error)
        }
      })
    })

    req.on('error', (error) => {
      console.error('❌ Request error:', error)
    })

    req.end()
  }, 1000)
}

function deleteWebhook() {
  const url = `/bot${BOT_TOKEN}/deleteWebhook`

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: url,
    method: 'POST'
  }

  console.log('\n🗑️  Deleting webhook...\n')

  const req = https.request(options, (res) => {
    let responseData = ''

    res.on('data', (chunk) => {
      responseData += chunk
    })

    res.on('end', () => {
      try {
        const result = JSON.parse(responseData)
        if (result.ok) {
          console.log('✅ Webhook deleted successfully!')
        }
      } catch (error) {
        console.error('❌ Error:', error)
      }
    })
  })

  req.on('error', (error) => {
    console.error('❌ Request error:', error)
  })

  req.end()
}

// Проверяем аргументы командной строки
const command = process.argv[2]

if (command === 'set') {
  setWebhook()
} else if (command === 'delete') {
  deleteWebhook()
} else if (command === 'info') {
  getWebhookInfo()
} else {
  console.log(`
📝 Usage:
  node setup-webhook.cjs set     - Set webhook
  node setup-webhook.cjs delete  - Delete webhook
  node setup-webhook.cjs info    - Get webhook info

Current webhook URL: ${WEBHOOK_URL}
`)
}

