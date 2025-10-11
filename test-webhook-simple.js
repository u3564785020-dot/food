/**
 * Простой тест webhook
 */

const https = require('https')

const testData = {
  update_id: 123,
  callback_query: {
    id: "test",
    from: {
      id: 123,
      first_name: "Test"
    },
    message: {
      chat: {
        id: -1003171719602
      }
    },
    data: "request_sms_user_1760057702671_2up930lg2"
  }
}

function testWebhook() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testData)

    const options = {
      hostname: 'burgerth-webhook.loca.lt',
      path: '/webhook',
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
          resolve({ error: e.message, data })
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

async function main() {
  try {
    console.log('🧪 Testing webhook...')
    const result = await testWebhook()
    console.log('✅ Webhook test result:', result)
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

main()
