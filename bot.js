const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// 🔐 PEGA TU TOKEN AQUÍ
const TOKEN = "8735540730:AAFFKuhJMoGy3XjJo6YssABA-wkQNWOnMIs";

// 🔒 TU CHAT ID
const OWNER = 6601338545;

// 🌐 (por ahora no lo usamos)
const API_URL = "https://tu-render.onrender.com/update";

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", async (msg) => {

 const chatId = msg.chat.id;
 const text = (msg.text || "").toLowerCase();

 // 🔒 SOLO TÚ PUEDES USARLO
 if(chatId !== OWNER){
  return bot.sendMessage(chatId, "⛔ No autorizado");
 }

 // 🧪 prueba básica
 if(text === "hola"){
  return bot.sendMessage(chatId, "🤖 Bot activo correctamente");
 }

 // 📌 ayuda
 bot.sendMessage(chatId,
`Comandos:

hola → probar bot`
 );
});
const express = require("express");
const app = express();

app.get("/", (req, res) => {
 res.send("🤖 Bot activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log("🌐 Web server activo en puerto " + PORT);
});
