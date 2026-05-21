# Қыз Ұзату — Адия · 22 тамыз 2026

Свадебный лендинг-приглашение. Стек: **Vanilla JS + Vite**.

---

## Быстрый старт

```bash
npm install
npm run dev        # http://localhost:3000
```

Для продакшн-сборки:

```bash
npm run build      # → папка dist/
npm run preview    # локальный превью dist/
```

---

## Структура проекта

```
kyz-uzatu/
├── index.html              # Разметка (единственный HTML)
├── vite.config.js
├── package.json
├── public/
│   └── assets/
│       └── adiya.jpg       # ← положите фото сюда
└── src/
    ├── main.js             # Точка входа — подключает все модули
    ├── styles/
    │   └── main.css        # Все стили
    └── modules/
        ├── cursor.js       # Кастомный курсор
        ├── loader.js       # Лоадер при открытии
        ├── particles.js    # Плавающие частицы
        ├── countdown.js    # Обратный отсчёт
        ├── lang.js         # Переключатель РУС / ҚАЗ
        ├── music.js        # Фоновая музыка
        ├── reveal.js       # Scroll-анимации
        ├── wishes.js       # Лента пожеланий
        └── rsvp.js         # Форма подтверждения
```

---

## Подключение Google Sheets (RSVP)

1. Перейдите на [script.google.com](https://script.google.com) → Новый проект.

2. Вставьте этот код:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  const data  = JSON.parse(e.postData.contents)
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.phone,
    data.guests,
    data.attendance,
  ])
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}
```

3. **Развернуть → Новое развёртывание → Web App**  
   - Выполнять от имени: **Я**  
   - Доступ: **Все**

4. Скопируйте URL и вставьте в `src/modules/rsvp.js`:

```js
const SHEET_URL = 'https://script.google.com/macros/s/ВАШ_ID/exec'
```

5. Раскомментируйте блок `fetch(SHEET_URL, ...)` в том же файле.

---

## Подключение пожеланий к бэкенду

Аналогично — в `src/modules/wishes.js` раскомментируйте блок `fetch()`.  
Можно использовать тот же Google Apps Script, добавив лист `Wishes`.

---

## Деплой

| Платформа | Команда / действие |
|-----------|-------------------|
| **Vercel** | `vercel` или импорт GitHub репо |
| **Netlify** | Drag & drop папки `dist/` |
| **GitHub Pages** | `npm run build`, затем залить `dist/` |

---

## Замена контента

| Что менять | Где |
|------------|-----|
| Имена, дата, город | `index.html` — текст в блоках |
| Дата таймера | `src/modules/countdown.js` → `WEDDING_DATE` |
| Фото | `public/assets/adiya.jpg` |
| Музыка | `index.html` → тег `<audio>` → `src` |
| Цвета | `src/styles/main.css` → блок `:root` |
| Карта | `index.html` → `<iframe>` → атрибут `src` |
