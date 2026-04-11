const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

// 🔐 TOKEN
const TOKEN = "8735540730:AAFFKuhJMoGy3XjJo6YssABA-wkQNWOnMIs";

// 🔒 TU ID
const OWNER = 6601338545;

const bot = new TelegramBot(TOKEN, { polling: true });

// 📦 memoria temporal
let data = {
 diaria: null,
 premia2: null,
 juega3: null
};

// 🧠 parsear números
function nums(arr){
 return arr.filter(x => !isNaN(x));
}

bot.on("message", async (msg) => {

 const chatId = msg.chat.id;
 const text = (msg.text || "").toLowerCase();

 if(chatId !== OWNER){
  return bot.sendMessage(chatId, "⛔ No autorizado");
 }

 let p = text.split(" ");

 // 🎯 DIARIA
 if(text.startsWith("diaria")){
  data.diaria = {
   numeros: nums(p.slice(1,5)),
   multiplicador: p[5] || "7"
  };
  return bot.sendMessage(chatId, "✔ Diaria guardada");
 }

 // 🎯 PREMIA2
 if(text.startsWith("premia2")){
  data.premia2 = {
   numeros: nums(p.slice(1,5))
  };
  return bot.sendMessage(chatId, "✔ Premia2 guardada");
 }

 // 🎯 JUEGA3
 if(text.startsWith("juega3")){
  data.juega3 = {
   numeros: nums(p.slice(1,5))
  };
  return bot.sendMessage(chatId, "✔ Juega3 guardada");
 }

 // 📊 VER DATOS
 if(text === "ver"){
  return bot.sendMessage(chatId, JSON.stringify(data, null, 2));
 }

 // 🧹 LIMPIAR
 if(text === "reset"){
  data = { diaria:null, premia2:null, juega3:null };
  return bot.sendMessage(chatId, "🧹 Datos limpiados");
 }

 // 📌 AYUDA
 bot.sendMessage(chatId,
`COMANDOS:

diaria 8 8 1 3 7
premia2 2373 8080 2344 2343
juega3 211 000 693 373

ver → ver datos
reset → limpiar`
 );
});

// 🌐 servidor para Render
const app = express();

app.get("/", (req,res)=>{
 res.send("🤖 BOT ACTIVO PRO");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
 console.log("🌐 Web activo en puerto " + PORT);
});
