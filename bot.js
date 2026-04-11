const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const axios = require("axios");

// 🔐 TOKEN
const TOKEN = "8735540730:AAFFKuhJMoGy3XjJo6YssABA-wkQNWOnMIs";

// 🔒 TU CHAT ID
const OWNER = 6601338545;

// 🌐 TU RENDER BACKEND (luego lo conectamos)
const API_URL = "https://TU-RENDER.onrender.com/update";

const bot = new TelegramBot(TOKEN, { polling: true });

// 📦 datos del día
let data = {
 diaria: null,
 premia2: null,
 juega3: null
};

// 🧠 limpiar números
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

 // 🧹 RESET
 if(text === "reset"){
  data = { diaria:null, premia2:null, juega3:null };
  return bot.sendMessage(chatId, "🧹 Datos borrados");
 }

 // 🚀 ENVIAR A BACKEND
 if(text === "enviar"){
  try{
   await axios.post(API_URL, data);
   return bot.sendMessage(chatId, "🚀 Datos enviados al sistema");
  }catch(e){
   return bot.sendMessage(chatId, "❌ Error enviando a Render");
  }
 }

 // 📌 AYUDA
 bot.sendMessage(chatId,
`🎯 COMANDOS:

diaria 8 8 1 3 7
premia2 2373 8080 2344 2343
juega3 211 000 693 373

ver → ver datos
reset → borrar
enviar → guardar en sistema`
 );
});

// 🌐 servidor para Render
const app = express();

app.get("/", (req,res)=>{
 res.send("🤖 BOT PRO ACTIVO");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
 console.log("🌐 Web activo en puerto " + PORT);
});
