const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const TOKEN = "TU_TOKEN_AQUI";
const API_URL = "https://TU-RENDER.onrender.com/update";

const bot = new TelegramBot(TOKEN, { polling: true });

let data = {
 diaria: null,
 premia2: null,
 juega3: null
};

function parseNums(text){
 return text.split(" ").filter(x => !isNaN(x));
}

bot.on("message", async (msg) => {

 const chatId = msg.chat.id;
 const text = msg.text.toLowerCase();

 if(text.startsWith("diaria")){
  const p = text.split(" ");
  data.diaria = {
   numeros: parseNums(p.slice(1,5)),
   multiplicador: p[5] || "7"
  };
  return bot.sendMessage(chatId, "✔ Diaria guardada");
 }

 if(text.startsWith("premia2")){
  const p = text.split(" ");
  data.premia2 = {
   numeros: parseNums(p.slice(1,5))
  };
  return bot.sendMessage(chatId, "✔ Premia2 guardada");
 }

 if(text.startsWith("juega3")){
  const p = text.split(" ");
  data.juega3 = {
   numeros: parseNums(p.slice(1,5))
  };
  return bot.sendMessage(chatId, "✔ Juega3 guardada");
 }

 if(text === "enviar"){
  await axios.post(API_URL, data);
  return bot.sendMessage(chatId, "🚀 Enviado a Render");
 }

 bot.sendMessage(chatId,
`Comandos:
diaria 8 8 1 3 7
premia2 2373 8080 2344 2343
juega3 211 000 693 373
enviar`
 );
});
