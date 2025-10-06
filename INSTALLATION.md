# 🚀 Инструкция по установке и запуску

## Требования

- **Node.js** версии 16 или выше
- **npm** или **yarn**

## Установка

### 1. Клонируйте репозиторий (или скачайте проект)

```bash
git clone <repository-url>
cd "тайланд БК орига"
```

### 2. Установите зависимости

```bash
npm install
```

Если возникают ошибки, попробуйте:

```bash
npm cache clean --force
npm install
```

## Запуск проекта

### Способ 1: Через npm (рекомендуется)

```bash
npm run dev
```

Проект откроется автоматически в браузере по адресу: **http://localhost:3000**

### Способ 2: Через bat файл (Windows)

Дважды кликните на файл `START_SERVER.bat` в корне проекта

### Способ 3: Через PowerShell

```powershell
.\START_SERVER.ps1
```

## Устранение проблем

### Проблема: npm error ENOENT package.json

**Причина**: Вы находитесь не в той папке

**Решение**:
```bash
# Убедитесь, что вы в правильной папке
cd "путь/к/проекту/тайланд БК орига"
# Проверьте наличие package.json
dir package.json
# Запустите проект
npm run dev
```

### Проблема: Port 3000 уже используется

**Решение**:
1. Закройте другие приложения на порту 3000
2. Или измените порт в `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Измените на любой свободный порт
    open: true
  }
})
```

### Проблема: Ошибки при установке зависимостей

**Решение**:
```bash
# Удалите папку node_modules и package-lock.json
rm -rf node_modules package-lock.json
# Очистите кэш npm
npm cache clean --force
# Установите заново
npm install
```

## Сборка для Production

```bash
npm run build
```

Готовые файлы будут в папке `dist/`

## Просмотр Production версии

```bash
npm run preview
```

## Структура проекта

```
тайланд БК орига/
├── src/
│   ├── components/       # Компоненты React
│   ├── pages/           # Страницы
│   ├── data/            # База данных товаров
│   ├── context/         # React Context (Language)
│   ├── i18n/            # Переводы
│   └── main.jsx         # Точка входа
├── index.html           # HTML шаблон
├── package.json         # Зависимости
├── vite.config.js       # Конфигурация Vite
└── START_SERVER.bat     # Быстрый запуск (Windows)
```

## Горячие клавиши в режиме разработки

- **r** - перезагрузить страницу
- **h** - показать помощь
- **q** - остановить сервер

## Полезные команды

```bash
# Проверить версию Node.js
node --version

# Проверить версию npm
npm --version

# Установить конкретную зависимость
npm install <package-name>

# Удалить зависимость
npm uninstall <package-name>
```

## Поддержка браузеров

- ✅ Chrome (рекомендуется)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ IE 11 не поддерживается

## Помощь

Если возникли проблемы:

1. Проверьте, что Node.js установлен: `node --version`
2. Проверьте, что npm установлен: `npm --version`
3. Убедитесь, что вы в правильной папке
4. Попробуйте переустановить зависимости
5. Проверьте, что порт 3000 свободен

---

**Успешного запуска! 🎉**

