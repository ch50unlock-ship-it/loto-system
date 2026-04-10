const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// 🔐 TU TOKEN (RECOMENDADO: cámbialo si ya lo compartiste)
const TOKEN = "8735540730:AAFFKuhJMoGy3XjJo6YssABA-wkQNWOnMIs";

// 🌐 URL DE TU RENDER
const API_URL = "https://TU-RENDER.onrender.com/update";

// 🔒 SOLO TU CHAT ID
const ALLOWED_CHAT_ID = 6601338545;

const bot = new TelegramBot(TOKEN, { polling: true });

// 📦 buffer temporal de datos
let dataBuffer = {
  diaria: null,
  premia2: null,
  juega3: null
};

// 🧠 parseador de números
function parseNums(text){
  return text
    .split(" ")
    .filter(x => x && !isNaN(x));
}

// 🔐 seguridad: solo tú puedes usar el bot
bot.on("message", async (msg) => {

  const chatId = msg.chat.id;
  const text = (msg.text || "").toLowerCase();

  if(chatId !== ALLOWED_CHAT_ID){
    return bot.sendMessage(chatId, "⛔ No autorizado");
  }

  try {

    // 🎯 DIARIA
    if(text.startsWith("diaria")){
      const p = text.split(" ");
      dataBuffer.diaria = {
        numeros: parseNums(p.slice(1,5)),
        multiplicador: p[5] || "7"
      };
      return bot.sendMessage(chatId, "✔ Diaria guardada");
    }

    // 🎯 PREMIA2
    if(text.startsWith("premia2")){
      const p = text.split(" ");
      dataBuffer.premia2 = {
        numeros: parseNums(p.slice(1,5))
      };
      return bot.sendMessage(chatId, "✔ Premia2 guardada");
    }

    // 🎯 JUEGA3
    if(text.startsWith("juega3")){
      const p = text.split(" ");
      dataBuffer.juega3 = {
        numeros: parseNums(p.slice(1,5))
      };
      return bot.sendMessage(chatId, "✔ Juega3 guardada");
    }

    // 🚀 ENVIAR A RENDER
    if(text === "enviar"){
      await axios.post(API_URL, dataBuffer);

      dataBuffer = {
        diaria: null,
        premia2: null,
        juega3: null
      };

      return bot.sendMessage(chatId, "🚀 Datos enviados a Render");
    }

    // 📋 AYUDA
    bot.sendMessage(chatId,
`📌 COMANDOS:

diaria 8 8 1 3 7
premia2 2373 8080 2344 2343
juega3 211 000 693 373
enviar`
    );

  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, "❌ Error en el bot");
  }
});
