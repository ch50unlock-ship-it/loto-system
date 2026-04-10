const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// 🔐 TU TOKEN
const TOKEN = "8735540730:AAFFKuhJMoGy3XjJo6YssABA-wkQNWOnMIs";

// 🌐 TU RENDER URL
const API_URL = "https://TU-RENDER.onrender.com/update";

// 🔒 TU CHAT ID
const ALLOWED_CHAT_ID = 6601338545;

const bot = new TelegramBot(TOKEN, { polling: true });

let dataBuffer = {
 diaria: null,
 premia2: null,
 juega3: null
};

function parseNums(text){
 return text.split(" ").filter(x => x && !isNaN(x));
}

bot.on("message", async (msg) => {

 const chatId = msg.chat.id;
 const text = (msg.text || "").toLowerCase();

 // 🔒 seguridad
 if(chatId !== ALLOWED_CHAT_ID){
  return bot.sendMessage(chatId, "⛔ No autorizado");
 }

 // 🎯 diaria
 if(text.startsWith("diaria")){
  let p = text.split(" ");
  dataBuffer.diaria = {
   numeros: parseNums(p.slice(1,5)),
   multiplicador: p[5] || "7"
  };
  return bot.sendMessage(chatId, "✔ Diaria guardada");
 }

 // 🎯 premia2
 if(text.startsWith("premia2")){
  let p = text.split(" ");
  dataBuffer.premia2 = {
   numeros: parseNums(p.slice(1,5))
  };
  return bot.sendMessage(chatId, "✔ Premia2 guardada");
 }

 // 🎯 juega3
 if(text.startsWith("juega3")){
  let p = text.split(" ");
  dataBuffer.juega3 = {
   numeros: parseNums(p.slice(1,5))
  };
  return bot.sendMessage(chatId, "✔ Juega3 guardada");
 }

 // 🚀 enviar a render
 if(text === "enviar"){
  await axios.post(API_URL, dataBuffer);

  dataBuffer = {
   diaria: null,
   premia2: null,
   juega3: null
  };

  return bot.sendMessage(chatId, "🚀 Enviado a Render");
 }

 // 📋 ayuda
 bot.sendMessage(chatId,
`COMANDOS:

diaria 8 8 1 3 7
premia2 2373 8080 2344 2343
juega3 211 000 693 373
enviar`
 );
});
